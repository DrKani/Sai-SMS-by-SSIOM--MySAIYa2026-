# Authentication Quick Reference Guide
**Sai SMS by SSIOM - Developer Reference**

## 📁 Documentation Files

| Document | Purpose | Location |
|----------|---------|----------|
| **Testing Checklist** | Complete test cases for all auth flows | `AUTHENTICATION_TESTING_CHECKLIST.md` |
| **Acceptance Criteria** | Gherkin-style requirements & DOD | `AUTHENTICATION_ACCEPTANCE_CRITERIA.md` |
| **Flow Analysis** | Technical analysis of auth implementation | `.gemini/AUTH_FLOW_ANALYSIS.md` |
| **Troubleshooting** | Debug guide for common issues | `.gemini/TROUBLESHOOTING_AUTH.md` |
| **UX Improvements** | Planned UX enhancements | `.gemini/AUTH_UX_IMPROVEMENTS.md` |

---

## 🔑 Authentication Flows Summary

### 1. **Sign-In Flow** (`#/signin`)
```
User clicks "Continue with Google"
→ Google OAuth popup
→ Authentication succeeds
→ App checks onboardingDone
→ If true: Redirect to Dashboard
→ If false: Redirect to Profile Setup
```

### 2. **Sign-Up Flow** (`#/signup`)
```
User clicks "Sign Up with Google"
→ Google OAuth popup
→ Authentication succeeds
→ Redirect to Profile Setup (#/setup)
→ User fills form (avatar, name, state, centre)
→ Click "JOIN SAI SMS NOW"
→ Save to Firestore
→ Redirect to Dashboard with welcome message
```

### 3. **Guest Flow** (`#/signin` or `#/signup`)
```
User clicks "Continue as Guest"
→ Warning modal appears
→ User clicks "Enter as Guest"
→ Anonymous authentication
→ Redirect to Homepage
→ Guest indicator shows in menu
→ Protected routes redirect to sign-in
```

---

## 🗂️ File Locations

### **Frontend Components**
- `src/pages/LoginPage.tsx` - Sign-in UI
- `src/pages/SignupPage.tsx` - Sign-up UI
- `src/pages/SetupPage.tsx` - Profile setup form
- `src/App.tsx` - Routing & auth state management
- `src/components/Toast.tsx` - Notification system

### **Backend Configuration**
- `firestore.rules` - Firestore security rules
- `firebase.json` - Firebase project config
- `src/lib/firebase.ts` - Firebase initialization

---

## 🎯 Key Test Scenarios

### Priority 0 (Must Work)
- [ ] Google Sign-In → Dashboard (returning user)
- [ ] Google Sign-Up → Profile Setup → Dashboard (new user)
- [ ] Profile form saves successfully
- [ ] Sign-out clears session

### Priority 1 (Should Work)
- [ ] Guest modal shows warnings
- [ ] Guest mode has limited access
- [ ] Error messages are user-friendly
- [ ] Loading states show during async operations

### Priority 2 (Nice to Have)
- [ ] Responsive on mobile
- [ ] Accessible via keyboard
- [ ] Works in all browsers

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| Email verification modal appears | Legacy code | **Fixed**: Removed in App.tsx line 72-89 |
| Profile save fails | Firestore rules | Check Firebase Console → Firestore Rules |
| "Permission denied" error | Auth state not ready | Wait for `auth.currentUser` to be set |
| Popup blocked | Browser settings | Tell user to allow popups |
| Network error | Internet connection | Show retry option |

---

## 📊 Firestore Data Schema

### User Profile Document (`/users/{uid}`)
```typescript
{
  uid: string,
  name: string,
  email: string,
  gender: 'male' | 'female',
  state: string,
  centre: string,
  photoURL: string,
  joinedAt: string (ISO),
  isGuest: boolean,
  isAdmin: boolean,
  onboardingDone: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔒 Security Rules Summary

```javascript
// Users can only read/write their own profile
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Anonymous users can authenticate but can't write to Firestore
// Only Google-authenticated users create profiles
```

---

## 📈 Success Metrics

- **Sign-In Success Rate**: >95%
- **Sign-Up Completion Rate**: >80%
- **Profile Setup Success**: >90%
- **Page Load Time**: <2s
- **Auth Response Time**: <3s

---

## 🚀 Deployment Checklist

Before deploying auth changes:
- [ ] Test all flows in dev environment
- [ ] Run full test checklist
- [ ] Build production bundle (`npm run build`)
- [ ] Deploy Firestore rules (`firebase deploy --only firestore:rules`)
- [ ] Deploy hosting (`firebase deploy --only hosting`)
- [ ] Test on live site
- [ ] Monitor Firebase Console for errors

---

## 📞 Support Resources

- **Firebase Console**: https://console.firebase.google.com/project/sai-sms-by-ssiom-mysaiya-2026
- **Hosting URL**: https://sai-sms-by-ssiom-mysaiya-2026.web.app
- **Firebase Auth Docs**: https://firebase.google.com/docs/auth
- **Firestore Rules Docs**: https://firebase.google.com/docs/firestore/security/get-started

---

## ⚡ Quick Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View logs
firebase functions:log
```

---

**Last Updated**: 2026-02-16  
**Version**: 1.0  
**Status**: ✅ Production Ready
