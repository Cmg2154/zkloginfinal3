# Sui zkLogin Demo - Google OAuth Setup

## 🔧 Setting Up Real Google OAuth Authentication

To use your own Google account instead of demo mode, follow these steps:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for development)
     - `http://localhost:5173` (for development)
   - Copy the Client ID

### 2. Update Environment Variables

Replace the demo values in your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
VITE_FACEBOOK_CLIENT_ID=your_facebook_client_id_here
VITE_TWITCH_CLIENT_ID=your_twitch_client_id_here
```

### 3. Test Real Authentication

1. Restart your development server: `npm run dev`
2. Click the "Google" login button
3. You'll be redirected to Google's OAuth consent screen
4. Sign in with your personal Google account
5. Grant permissions and you'll be redirected back

### 4. Troubleshooting

**Common Issues:**

- **"redirect_uri_mismatch"**: Make sure your redirect URI in Google Console matches exactly
- **"invalid_client"**: Double-check your Client ID is correct
- **"access_blocked"**: Your app needs to be verified for production use

**Development vs Production:**
- For development: Use `http://localhost:5173`
- For production: Use your actual domain

### 5. OAuth Flow Details

The authentication flow:
1. User clicks login → redirects to Google
2. User signs in → Google redirects back with ID token
3. App decodes JWT token to get user info
4. Creates Sui address and saves session

## 🚀 Quick Start

1. Get your Google Client ID from Google Cloud Console
2. Update `.env` with your real Client ID
3. Restart the dev server
4. Try logging in with your Google account!

## 📝 Notes

- The current implementation uses ID tokens (implicit flow)
- For production, consider using authorization code flow
- zkLogin proof generation is simulated for demo purposes
- Real zkLogin integration requires additional Sui SDK setup
