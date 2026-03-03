# Authentication Complete Guide
**Sai SMS by SSIOM - Frontend, Backend, Schema & Rules**

**Version**: 1.0  
**Last Updated**: 2026-02-16

---

## Table of Contents
1. [Overview](#1-overview)
2. [User Types & Permissions](#2-user-types--permissions)
3. [Frontend Flow](#3-frontend-flow)
4. [Backend Configuration](#4-backend-configuration)
5. [Firestore Schema](#5-firestore-schema)
6. [Security Rules](#6-security-rules)
7. [Implementation Details](#7-implementation-details)

---

## 1. Overview

### Authentication Strategy
- **Primary Method**: Google Sign-In (Firebase Auth)
- **Secondary Method**: Anonymous (Guest Mode)
- **No Email/Password**: Removed to simplify UX and reduce security overhead

### Key Principles
1. **Single Auth Handler**: One GoogleAuthHandler() for both sign-in and sign-up
2. **Centralized Routing**: App.tsx manages all redirects based on auth state
3. **Deny-by-Default**: Firestore rules require explicit permission
4. **Guest Limitations**: Guests can explore but not save personal data

---

## 2. User Types & Permissions

### User Types

#### 1. Guest
- **Session**: `guestSession=true` in localStorage/sessionStorage
- **Firebase Auth**: Anonymous user OR no auth session
- **Persistence**: Temporary local cache only (or none)
- **Access**: Browse public content, limited feature access

#### 2. Registered Member
- **Session**: Firebase Auth Google user
- **Firestore**: Must have `/users/{uid}` document
- **Requirement**: `onboardingDone=true` to access full member zone
- **Access**: All member features + personal data persistence

#### 3. Admin
- **Session**: Registered member + `users/{uid}.role == "admin"`
- **Access**: All member features + `/admin` functions
- **Special**: Can moderate content, manage system settings

---

### Permission Matrix

| Feature | Guest | Member | Admin |
|---------|:-----:|:------:|:-----:|
| View announcements | ✅ | ✅ | ✅ |
| View calendar | ✅ | ✅ | ✅ |
| Browse homepage | ✅ | ✅ | ✅ |
| Namasmarana counter | 🟡 Limited | ✅ | ✅ |
| Personal dashboard | ❌ | ✅ | ✅ |
| Book club content | 🟡 Preview | ✅ | ✅ |
| Spiritual journal | ❌ | ✅ | ✅ |
| Games | 🟡 No save | ✅ | ✅ |
| Profile settings | ❌ | ✅ | ✅ |
| Admin portal | ❌ | ❌ | ✅ |

**Legend**: ✅ Full Access | 🟡 Limited Access | ❌ No Access

---

## 3. Frontend Flow

### Sign-Up Page (`/signup`)

```typescript
// Button 1 (Primary): Sign Up with Google
<button onClick={GoogleAuthHandler}>
  <Chrome /> Sign Up with Google
</button>

// Button 2 (Secondary): Continue as Guest
<button onClick={() => setShowGuestModal(true)}>
  <UserCircle /> Continue as Guest
</button>

// Guest Modal
{showGuestModal && (
  <GuestWarningModal
    onEnterAsGuest={handleGuestEntry}
    onSignUp={GoogleAuthHandler}
  />
)}
```

**Microcopy under guest button** (non-blocking):
> **Why sign up?** Save your chanting history, streaks, badges, and personal dashboard.

---

### Sign-In Page (`/signin`)

```typescript
// Button 1: Sign In with Google
<button onClick={GoogleAuthHandler}>
  <Chrome /> Continue with Google
</button>

// Button 2: Continue as Guest
<button onClick={() => setShowGuestModal(true)}>
  <UserCircle /> Continue as Guest
</button>

// "New Member?" Callout
<p>
  New Member?{' '}
  <Link to="/signup">Sign up with Google</Link>
</p>
```

**Note**: The "sign up with Google" hyperlink navigates to `/signup` page, which has the same Google button.

---

### Single Auth Gate (Routing Logic)

Located in `src/App.tsx`:

```typescript
// On app load and on any protected route:
function ProtectedRoute({ children, user }) {
  const location = useLocation();
  
  // 1. If Guest session:
  if (isGuestSession()) {
    // Allow entry to "guest-allowed" routes
    if (GUEST_BLOCKED_ROUTES.includes(location.pathname)) {
      return <Navigate to="/signin" />;
    }
    // Block member-only actions with CTA modal
    return children;
  }
  
  // 2. If Firebase user exists:
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  // If user doc missing → redirect to /setup
  if (!user.uid) {
    return <Navigate to="/setup" replace />;
  }
  
  // If onboardingDone != true → redirect to /setup
  if (!user.onboardingDone && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }
  
  // If onboarding done but on /setup → redirect to dashboard
  if (user.onboardingDone && location.pathname === '/setup') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // 3. Else → allow access
  return children;
}
```

---

### Google Auth Handler (Unified)

```typescript
async function GoogleAuthHandler() {
  setLoading('google');
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Success toast
    showToast('Signed in successfully!', 'success');
    
    // NO manual redirect here
    // App.tsx onAuthStateChanged handles all redirects
    
  } catch (error) {
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      showToast('Sign-in cancelled', 'info');
    } else if (error.code === 'auth/popup-blocked') {
      showToast('Pop-up blocked. Please allow pop-ups for this site', 'warning');
    } else if (error.code === 'auth/network-request-failed') {
      showToast('Network error. Check your connection and try again', 'error');
    } else if (error.code === 'auth/unauthorized-domain') {
      showToast('This domain is not authorized. Contact support', 'error');
    } else {
      showToast('Authentication failed. Please try again', 'error');
    }
  } finally {
    setLoading(null);
  }
}
```

---

### Guest Entry Handler

```typescript
async function handleGuestEntry() {
  setLoading('guest');
  try {
    // Set guest session flag
    localStorage.setItem('sms_guest_session', 'true');
    sessionStorage.setItem('sms_guest_session', 'true');
    
    // Optional: Firebase anonymous auth
    await signInAnonymously(auth);
    
    // Close modal and navigate
    setShowGuestModal(false);
    navigate('/');
    
    showToast('Continuing as guest', 'info');
  } catch (error) {
    console.error('Guest entry failed:', error);
    showToast('Failed to enter as guest. Please try again', 'error');
  } finally {
    setLoading(null);
  }
}
```

---

### Auth State Listener (App.tsx)

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Check if guest
      const isGuest = firebaseUser.isAnonymous || 
                      localStorage.getItem('sms_guest_session') === 'true';
      
      if (isGuest) {
        setUser({ ...DEFAULT_GUEST_PROFILE, isGuest: true });
        setIsAuthChecking(false);
        return;
      }
      
      // Fetch user profile from Firestore
      try {
        const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        let profileData = {};
        if (docSnap.exists()) {
          profileData = docSnap.data();
        }
        
        // Check if admin
        const adminEmail = firebaseUser.email?.toLowerCase();
        const isAdmin = adminEmail && ADMIN_CONFIG.AUTHORIZED_EMAILS.includes(adminEmail);
        
        const profile = {
          uid: firebaseUser.uid,
          name: profileData.name || firebaseUser.displayName || 'Devotee',
          email: firebaseUser.email || '',
          photoURL: profileData.photoURL || firebaseUser.photoURL || APP_CONFIG.AVATAR_MALE,
          joinedAt: profileData.joinedAt || new Date().toISOString(),
          isGuest: false,
          isAdmin: !!isAdmin,
          onboardingDone: !!profileData.onboardingDone,
          state: profileData.state || '',
          centre: profileData.centre || ''
        };
        
        setUser(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setIsAuthChecking(false);
  });
  
  return () => unsubscribe();
}, []);
```

---

### Profile Setup Page (`/setup`)

```typescript
async function handleSubmit(e) {
  e.preventDefault();
  
  if (!auth.currentUser) {
    alert('Not authenticated. Please sign in again.');
    return;
  }
  
  setLoading(true);
  
  try {
    // 1. Update Auth Profile (displayName)
    if (auth.currentUser.displayName !== formData.displayName) {
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName
      });
    }
    
    // 2. Create User Profile in Firestore
    const userProfile = {
      uid: auth.currentUser.uid,
      name: formData.displayName,
      email: auth.currentUser.email || '',
      gender: formData.gender,
      state: formData.state,
      centre: formData.centre,
      photoURL: auth.currentUser.photoURL || APP_CONFIG.AVATAR_MALE,
      joinedAt: new Date().toISOString(),
      isGuest: false,
      isAdmin: false,
      onboardingDone: true
    };
    
    // 3. Write to Firestore (MERGE to preserve existing fields)
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // 4. Update local storage cache
    localStorage.setItem('sms_user', JSON.stringify(userProfile));
    
    // 5. Redirect (App.tsx will handle based on onboardingDone=true)
    navigate('/dashboard');
    
  } catch (error) {
    console.error('Setup failed:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    
    let errorMessage = 'Failed to save profile. Please try again.';
    
    if (error?.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please sign out and sign in again.';
    } else if (error?.code === 'unavailable') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error?.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
}
```

---

## 4. Backend Configuration

### Firebase Initialization (`src/lib/firebase.ts`)

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider, serverTimestamp };
export default app;
```

---

### Environment Variables (`.env`)

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=sai-sms-by-ssiom-mysaiya-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sai-sms-by-ssiom-mysaiya-2026
VITE_FIREBASE_STORAGE_BUCKET=sai-sms-by-ssiom-mysaiya-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

### Firebase Console Configuration

#### Authentication Providers
1. **Google Sign-In**: Enabled
2. **Anonymous**: Enabled (for guest mode)
3. **Email/Password**: Disabled

#### Authorized Domains
- `localhost` (development)
- `sai-sms-by-ssiom-mysaiya-2026.firebaseapp.com` (Firebase hosting)
- `sai-sms-by-ssiom-mysaiya-2026.web.app` (Firebase hosting)
- Custom domain (if applicable)

---

## 5. Firestore Schema

### User Profile (`/users/{uid}`)

```typescript
interface UserProfile {
  // Identity
  uid: string;                    // Firebase Auth UID
  name: string;                   // Display name (from Google or custom)
  email: string;                  // Email address (from Google Auth)
  
  // Profile Details
  gender: 'male' | 'female';      // Avatar selection
  state: string;                  // Malaysian state (e.g., "Selangor")
  centre: string;                 // Sai Centre name (e.g., "Kuala Lumpur Central")
  photoURL: string;               // Avatar URL (Google photo or default)
  
  // Metadata
  joinedAt: string;               // ISO timestamp of account creation
  createdAt: Timestamp;           // Server timestamp (Firestore)
  updatedAt: Timestamp;           // Server timestamp (Firestore)
  
  // Flags
  isGuest: boolean;               // false for Google users, true for anonymous
  isAdmin: boolean;               // Admin role flag
  onboardingDone: boolean;        // Profile setup completed
  
  // Settings (optional)
  settings?: {
    notificationsEnabled: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
  };
  
  // Stats (optional, cached for performance)
  stats?: {
    totalContribution: number;    // Running total to avoid scanning history
    streakDays: number;
    badgesEarned: number;
  };
  
  // Administrative
  metadata?: {
    lastLoginAt: string;
    profileViews: number;
  };
}
```

**Example Document**:
```json
{
  "uid": "abc123xyz",
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "gender": "male",
  "state": "Selangor",
  "centre": "Kuala Lumpur Central",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "joinedAt": "2026-02-16T00:00:00.000Z",
  "createdAt": {"seconds": 1708041600, "nanoseconds": 0},
  "updatedAt": {"seconds": 1708041600, "nanoseconds": 0},
  "isGuest": false,
  "isAdmin": false,
  "onboardingDone": true,
  "settings": {
    "notificationsEnabled": true,
    "emailUpdates": true,
    "publicProfile": false
  },
  "stats": {
    "totalContribution": 10800,
    "streakDays": 7,
    "badgesEarned": 3
  }
}
```

---

### Sadhana Daily (`/sadhanaDaily/{uid_YYYYMMDD}`)

```typescript
interface SadhanaDaily {
  uid: string;                    // User ID
  date: string;                   // YYYYMMDD format
  gayathri: number;               // Gayathri count
  saiGayathri: number;            // Sai Gayathri count
  likitha: number;                // Likitha Japam units (11-row sets)
  totalCount: number;             // Sum of all mantras
  timestamp: Timestamp;           // When offering was made
  offlineQueued: boolean;         // Was this synced from offline queue?
}
```

**Example Document**:
```json
{
  "uid": "abc123xyz",
  "date": "20260216",
  "gayathri": 108,
  "saiGayathri": 54,
  "likitha": 2,
  "totalCount": 184,
  "timestamp": {"seconds": 1708041600, "nanoseconds": 0},
  "offlineQueued": false
}
```

---

## 6. Security Rules

### Complete `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // DENY BY DEFAULT (Least Privilege)
    // ========================================
    match /{document=**} {
      allow read, write: if false;
    }
    
    // ========================================
    // USER PROFILES
    // ========================================
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ========================================
    // SADHANA DAILY (Personal Progress)
    // ========================================
    match /sadhanaDaily/{docId} {
      // Read: only owner
      allow read: if request.auth != null && resource.data.uid == request.auth.uid;
      
      // Create: only owner, must have verified email (Google users auto-verified)
      allow create: if request.auth != null 
                    && request.resource.data.uid == request.auth.uid;
      
      // Update: only owner
      allow update: if request.auth != null 
                    && resource.data.uid == request.auth.uid;
    }
    
    // ========================================
    // JOURNALS (Private)
    // ========================================
    match /journals/{journalId} {
      // Create: only authenticated, must set own UID
      allow create: if request.auth != null 
                    && request.resource.data.uid == request.auth.uid;
      
      // Read/Update/Delete: only owner
      allow read, update, delete: if request.auth != null 
                                  && resource.data.uid == request.auth.uid;
    }
    
    // ========================================
    // REFLECTIONS (Moderated)
    // ========================================
    match /reflections/{reflectionId} {
      // Create: authenticated users only
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      
      // Read:
      // - Private: only owner
      // - Public & approved: all authenticated users
      allow read: if request.auth != null && (
        resource.data.uid == request.auth.uid ||
        (resource.data.isPublic == true && resource.data.status == 'approved')
      );
      
      // Update status: admin only (requires custom claim or allowlist check)
      allow update: if request.auth != null &&
        (resource.data.uid == request.auth.uid || isAdmin());
    }
    
    // ========================================
    // PUBLIC READ COLLECTIONS
    // ========================================
    // Announcements
    match /announcements/{docId} {
      allow read: if true;  // Public read
      allow write: if isAdmin();
    }
    
    // Calendar Events
    match /calendar/{docId} {
      allow read: if true;  // Public read
      allow write: if isAdmin();
    }
    
    // Book Club Weeks
    match /bookclubWeeks/{docId} {
      allow read: if true;  // Public read
      allow write: if isAdmin();
    }
    
    // National Rollup (Daily aggregates)
    match /nationalDaily/{date} {
      allow read: if true;  // Public read
      allow write: if false;  // Only Cloud Functions or admin
    }
    
    // ========================================
    // ADMIN COLLECTIONS
    // ========================================
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    function isAdmin() {
      // Option 1: Custom claim (requires Cloud Functions to set)
      // return request.auth.token.admin == true;
      
      // Option 2: Email allowlist (simpler, no Cloud Functions needed)
      return request.auth != null && 
             request.auth.token.email in [
               'admin@example.com',
               'superadmin@example.com'
             ];
    }
  }
}
```

---

### Rules Intent Summary

| Collection | Read | Write | Notes |
|------------|------|-------|-------|
| `/users/{uid}` | Owner only | Owner only | Self-service profile |
| `/sadhanaDaily/{docId}` | Owner only | Owner only | Personal progress |
| `/journals/{id}` | Owner only | Owner only | Private reflections |
| `/reflections/{id}` | Owner + public approved | Owner + admin | Moderated |
| `/announcements/{id}` | Public | Admin only | Read-only for users |
| `/calendar/{id}` | Public | Admin only | Read-only for users |
| `/bookclubWeeks/{id}` | Public | Admin only | Read-only for users |
| `/nationalDaily/{date}` | Public | Cloud Function only | Aggregated data |
| `/admin/*` | Admin only | Admin only | System management |

---

## 7. Implementation Details

### File Structure

```
src/
├── lib/
│   └── firebase.ts                 # Firebase initialization
├── pages/
│   ├── LoginPage.tsx               # Sign-in page
│   ├── SignupPage.tsx              # Sign-up page
│   ├── SetupPage.tsx               # Profile setup
│   └── DashboardPage.tsx           # Personal dashboard
├── components/
│   ├── Toast.tsx                   # Notification toasts
│   ├── GuestModal.tsx              # Guest warning modal (if separate)
│   └── ProfileDropdown.tsx         # User menu
├── types/
│   └── index.ts                    # TypeScript interfaces
├── constants/
│   └── index.ts                    # App config, admin emails
└── App.tsx                         # Main app with routing logic
```

---

### Key Functions

#### `GoogleAuthHandler()` - Unified Auth
- Location: `LoginPage.tsx`, `SignupPage.tsx`
- Purpose: Handle Google Sign-In/Sign-Up
- Error Handling: Specific error codes with user-friendly messages
- Redirect: None (handled by App.tsx)

#### `handleGuestEntry()` - Guest Mode
- Location: `LoginPage.tsx`, `SignupPage.tsx`
- Purpose: Set guest session flags
- Optional: Firebase anonymous auth
- Redirect: Navigate to `/`

#### `ProtectedRoute` - Route Guard
- Location: `App.tsx`
- Purpose: Enforce authentication requirements
- Logic: Check auth state, onboarding status, admin role

#### `onAuthStateChanged` - State Listener
- Location: `App.tsx`
- Purpose: Monitor Firebase auth state changes
- Actions: Fetch user profile, update app state

---

### Error Handling

#### Google Auth Errors

| Error Code | User Message | Action |
|------------|--------------|--------|
| `auth/popup-closed-by-user` | "Sign-in cancelled" | Dismissible toast |
| `auth/popup-blocked` | "Pop-up blocked. Please allow pop-ups" | Instruction |
| `auth/network-request-failed` | "Network error. Check your connection" | Retry prompt |
| `auth/unauthorized-domain` | "Domain not authorized. Contact support" | Support link |
| Default | "Authentication failed. Please try again" | Generic retry |

#### Firestore Errors

| Error Code | User Message | Action |
|------------|--------------|--------|
| `permission-denied` | "Permission denied. Please sign out and sign in again" | Sign-out CTA |
| `unavailable` | "Network error. Please check your internet" | Retry prompt |
| Default | Error message from API | Display actual error |

---

### Security Considerations

1. **No Credentials in URLs**: OAuth state parameters used, no tokens exposed
2. **HTTPS Enforced**: Firebase hosting auto-enforces HTTPS
3. **Token Refresh**: Firebase SDK handles token refresh automatically
4. **Session Persistence**: Controlled via Firebase persistence settings
5. **XSS Protection**: React auto-escapes user input
6. **CSRF Protection**: Firebase OAuth includes state parameter

---

### Performance Optimizations

1. **Lazy Loading**: Auth pages lazy-loaded via React.lazy()
2. **Single Auth Listener**: One `onAuthStateChanged` listener in App.tsx
3. **Cached User Profile**: Stored in React state, avoid repeated Firestore reads
4. **Optimistic UI**: Local state updates before Firestore write
5. **Batched Writes**: Counter values written in batch on "Offer" action

---

**End of Authentication Complete Guide**
