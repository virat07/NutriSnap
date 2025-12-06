# Firebase Security Rules Deployment Guide

## Problem
You're getting `FirebaseError: Missing or insufficient permissions` because Firestore security rules are blocking read/write operations.

## Solution
Deploy the security rules files to your Firebase project.

---

## Method 1: Deploy via Firebase Console (Recommended - Quick Fix)

### Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nutrisnap-ead5d**
3. In the left sidebar, click **Firestore Database**
4. Click on the **Rules** tab at the top
5. Replace the existing rules with the content from `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /photos/{photoId} {
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.keys().hasAll(['userId', 'calories', 'createdAt']);
      
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.userId == request.auth.uid;
      
      allow delete: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
    }
    
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. Click **Publish** to deploy the rules

### Storage Rules

1. In the Firebase Console left sidebar, click **Storage**
2. Click on the **Rules** tab at the top
3. Replace the existing rules with the content from `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      allow write: if isAuthenticated() && 
                      request.auth.uid == userId &&
                      request.resource.size < 10 * 1024 * 1024;
      
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **Publish** to deploy the rules

---

## Method 2: Deploy via Firebase CLI (Advanced)

### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

### Initialize Firebase (one-time setup)
```bash
cd /Users/bharatgupta/Desktop/project/NutriSnap
firebase init
```

When prompted:
- Select **Firestore** and **Storage**
- Use existing project: **nutrisnap-ead5d**
- Accept default file names (`firestore.rules` and `storage.rules`)

### Deploy Rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## Verification

After deploying the rules, test your app:

1. Reload your app (shake device and tap "Reload" or press `r` in terminal)
2. Navigate to the Profile/Dashboard screen
3. The error should be gone and your photos should load

If you still see errors:
- Check that you're logged in (authentication is working)
- Open browser console/terminal for detailed error messages
- Verify rules were published in Firebase Console (check the timestamp)

---

## What These Rules Do

### Firestore Rules
- ✅ Allow users to read only their own photos
- ✅ Allow users to create photos tagged with their userId
- ✅ Allow users to update/delete only their own photos
- ❌ Deny all other access by default

### Storage Rules
- ✅ Allow users to upload files to their own folder (`users/{userId}/`)
- ✅ Limit file uploads to 10MB
- ✅ Allow users to read/delete only their own files
- ❌ Deny all other access by default

---

## Security Notes

These rules ensure:
1. Users can only access their own data (data isolation)
2. All operations require authentication
3. File uploads are size-limited to prevent abuse
4. No cross-user data access is possible
