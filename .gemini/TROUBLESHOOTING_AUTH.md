# Authentication & Profile Setup Troubleshooting Guide

**Date**: 2026-02-16  
**Status**: DEPLOYED with enhanced error logging

## 🚨 Current Issue: Profile Setup Failing

### What I've Done:
1. ✅ **Deployed Firestore Rules** - Ensured security rules are up to date
2. ✅ **Enhanced Error Logging** - SetupPage now shows detailed error messages
3. ✅ **Removed Email Verification Gate** - No longer blocking Google users

### Next Steps for Debugging:

#### **Test the Profile Setup Again**:
1. Go to https://sai-sms-by-ssiom-mysaiya-2026.web.app/
2. Click "Sign Up" → "Sign Up with Google"
3. Complete Google authentication
4. Fill out the profile form
5. Click "Save Profile"
6. **Open Browser Console (F12 or Cmd+Option+I)**
7. Look for error messages that start with:
   - `Setup failed:`
   - `Error code:`
   - `Error message:`

#### **Copy the Console Error**:
When the error appears, copy the **exact error message** from the browser console and share it with me. It will look something like:

```
Setup failed: FirebaseError: ...
Error code: permission-denied (or unavailable, or something else)
Error message: Missing or insufficient permissions
```

---

## Possible Causes & Solutions:

### 1. **Firestore Permission Issue**
**Symptom**: Error code `permission-denied`  
**Cause**: User's auth token doesn't match Firestore security rules  
**Solution**: 
- Sign out completely
- Clear browser cache
- Sign in again with Google
- Try profile setup again

### 2. **Network Issue**
**Symptom**: Error code `unavailable`  
**Cause**: Internet connection problems  
**Solution**: Check internet connection and try again

### 3. **Auth State Not Ready**
**Symptom**: `auth.currentUser` is null  
**Cause**: Trying to save before Firebase auth fully initialized  
**Solution**: Wait 2-3 seconds after landing on setup page before clicking save

### 4. **Browser Issues**
**Symptom**: Random failures  
**Cause**: Browser extensions, cache, cookies  
**Solution**:
- Try in incognito/private mode
- Disable browser extensions
- Clear cache and cookies for the site

---

## Testing Checklist:

### ✅ **Sign In Flow** (Returning User):
1. Go to /#/signin
2. Click "Continue with Google"
3. After auth → Should see "Signed in successfully!" toast
4. Should auto-redirect to /dashboard
5. **Expected**: Dashboard shows personalized greeting

### ✅ **Sign Up Flow** (New User):
1. Go to /#/signup
2. Click "Sign Up with Google"
3. After auth → Should see "Signed in successfully!" toast
4. Should auto-redirect to /setup
5. Fill out profile form (select avatar, enter name, select region/centre)
6. Click "Save Profile"
7. **Expected**: Navigate to /dashboard with welcome message

### ✅ **Guest Flow**:
1. Click "Continue as Guest"
2. Modal appears with warning
3. Click "Enter as Guest"
4. Should go to homepage
5. Menu should show "Browsing as Guest" indicator

---

## Firebase Console Checks:

### Firestore Rules Status:
- ✅ Deployed at: 2026-02-16
- ✅ Users collection: READ/WRITE allowed if auth.uid matches
- ✅ No email verification requirement for user profiles

### Authentication Methods:
- ✅ Google Sign-In: Enabled
- ✅ Anonymous Auth: Enabled
- ⚠️ Check authorized domains include: `sai-sms-by-ssiom-mysaiya-2026.web.app`

---

## Debug Mode Instructions:

If you want to see real-time logs while testing:

1. Open browser console (F12)
2. Go to Console tab
3. Clear console
4. Perform the sign-up flow
5. Watch for:
   - `Firebase Auth state changed`
   - `User profile:` logs
   - Any red error messages
6. Screenshot the console and share

---

## Quick Fixes to Try NOW:

### Option A: Clear Everything
```
1. Sign out
2. Open browser console
3. Run: localStorage.clear()
4. Run: sessionStorage.clear()
5. Close browser completely
6. Reopen and try sign up again
```

### Option B: Use Incognito Mode
```
1. Open incognito/private window
2. Go to the app URL
3. Try sign up flow
4. This bypasses cache/cookie issues
```

### Option C: Check Firebase Console
```
1. Go to Firebase Console → Authentication
2. Check if your email appears after Google sign-in
3. Go to Firestore → users collection
4. Check if a document with your UID got created (even partially)
```

---

## What to Report Back:

Please provide:
1. **Exact error message from console** (copy-paste)
2. **Error code** (if shown)
3. **What step failed** (Google auth, or profile save?)
4. **Browser being used** (Chrome, Safari, Firefox?)
5. **Any screenshots** of console errors

This will help me pinpoint the exact issue!
