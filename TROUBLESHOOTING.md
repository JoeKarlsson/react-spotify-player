# 🔧 Troubleshooting Guide

This guide helps you resolve common issues when working with the React Spotify Player and Spotify Web API integration.

## 📋 Table of Contents

- [Authentication Issues](#authentication-issues)
- [API Connection Problems](#api-connection-problems)
- [Development Environment Issues](#development-environment-issues)
- [Production Deployment Issues](#production-deployment-issues)
- [Common Error Messages](#common-error-messages)
- [Debugging Tips](#debugging-tips)

---

## 🔐 Authentication Issues

### Problem: "Invalid client" error

**Symptoms:**

- Error message: "Invalid client"
- Login button doesn't work
- Redirect fails

**Solutions:**

1. **Check your Client ID**

   ```javascript
   // In src/config/spotify.js
   export const clientId = "YOUR_ACTUAL_CLIENT_ID_HERE";
   ```

2. **Verify Spotify App Settings**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Check that your app is active (not in development mode)
   - Ensure the redirect URI matches exactly:

     ```javascript
     export const redirectUri = "http://127.0.0.1:3001"; // Must match dashboard
     ```

3. **Check Redirect URI Format**
   - Must be exact match (including protocol, port, trailing slashes)
   - Common mistakes: `http://localhost:3001` vs `http://127.0.0.1:3001` (Spotify rejects `localhost`)

### Problem: "Access token expired" error

**Symptoms:**

- App works initially but stops after some time
- Error: "Your session has expired"

**Solutions:**

1. **Token Expiration is Normal**
   - Spotify tokens expire after 1 hour
   - The app handles this automatically by logging you out

2. **Implement Token Refresh (Advanced)**

   ```javascript
   // For production apps, implement refresh token flow
   const refreshToken = async (refreshToken) => {
     const response = await fetch('https://accounts.spotify.com/api/token', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
       },
       body: new URLSearchParams({
         grant_type: 'refresh_token',
         refresh_token: refreshToken
       })
     });
     return response.json();
   };
   ```

### Problem: Login redirects but doesn't work

**Symptoms:**

- Clicking login redirects to Spotify
- After authorizing, returns to app but nothing happens

**Solutions:**

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify the Authorization Code**

   ```javascript
   // Right after Spotify redirects back, the URL has ?code=...
   // The app trades it for a token, then clears it from the address bar.
   // "Login failed: Token request failed: 400" usually means the code was
   // already used or the code verifier is missing: open the app at
   // http://127.0.0.1:3001 (not localhost) so login and redirect share storage.
   console.log(localStorage.getItem('code_verifier'));
   ```

3. **Check URL Parameters**
   - Ensure redirect URI in Spotify dashboard matches your app
   - Verify scopes are correctly formatted

---

## 🌐 API Connection Problems

### Problem: "No data received from Spotify"

**Symptoms:**

- Login works but shows "You need to be playing a song"
- No track information displays

**Solutions:**

1. **Check Spotify Premium Status**
   - You need Spotify Premium to use the Web API
   - Free accounts cannot access playback information

2. **Verify Music is Playing**
   - Make sure Spotify is actively playing music
   - Check that music is playing on the same account you logged in with

3. **Check API Permissions**

   ```javascript
   // Ensure these scopes are included:
   export const scopes = [
     "user-read-currently-playing",
     "user-read-playback-state",
   ];
   ```

### Problem: CORS errors

**Symptoms:**

- Console shows CORS errors
- API requests fail

**Solutions:**

1. **CORS is Handled by Spotify**
   - Spotify API supports CORS for web applications
   - If you see CORS errors, check your request format

2. **Check Request Headers**

   ```javascript
   const response = await fetch("https://api.spotify.com/v1/me/player", {
     method: "GET",
     headers: {
       "Authorization": `Bearer ${accessToken}`,
       "Content-Type": "application/json"
     }
   });
   ```

### Problem: Rate limiting

**Symptoms:**

- API requests start failing
- Error: "Too Many Requests"

**Solutions:**

1. **Reduce Polling Frequency**

   ```javascript
   // Change from 5 seconds to 10 seconds
   const interval = setInterval(() => {
     if (_token) {
       getCurrentlyPlaying(_token);
     }
   }, 10000); // Increased from 5000ms
   ```

2. **Implement Exponential Backoff**

   ```javascript
   const fetchWithRetry = async (url, options, retries = 3) => {
     try {
       const response = await fetch(url, options);
       if (response.status === 429) {
         throw new Error('Rate limited');
       }
       return response;
     } catch (error) {
       if (retries > 0) {
         await new Promise(resolve => setTimeout(resolve, 1000));
         return fetchWithRetry(url, options, retries - 1);
       }
       throw error;
     }
   };
   ```

---

## 💻 Development Environment Issues

### Problem: App won't start

**Symptoms:**

- `npm start` fails
- Port already in use errors

**Solutions:**

1. **Check Port Availability**

   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   
   # Or use a different port
   PORT=3002 npm start
   ```

2. **Clear Node Modules**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node Version**

   ```bash
   node --version
   # Should be v14 or higher
   ```

### Problem: Hot reload not working

**Symptoms:**

- Changes don't reflect in browser
- Manual refresh required

**Solutions:**

1. **Check File Watchers**

   ```bash
   # Increase file watcher limit (Linux/Mac)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart Development Server**

   ```bash
   # Stop server (Ctrl+C) and restart
   npm start
   ```

### Problem: Import/Export errors

**Symptoms:**

- Module not found errors
- Import path issues

**Solutions:**

1. **Check File Extensions**

   ```javascript
   // Make sure imports match file extensions
   import Player from '/src/components/Player.jsx'; // .jsx extension
   import { login, getToken } from '/src/utils/pkce.js'; // .js extension
   ```

2. **Verify File Paths**
   - Use absolute paths from src root
   - Check file names match exactly

---

## 🚀 Production Deployment Issues

### Problem: App works locally but not in production

**Symptoms:**

- Works on localhost but fails when deployed
- Authentication redirects fail

**Solutions:**

1. **Update Redirect URIs**

   ```javascript
   // Update for production
   export const redirectUri = "https://yourdomain.com";
   
   // Add to Spotify Dashboard:
   // - https://yourdomain.com
   // - https://yourdomain.com/
   ```

2. **Use Environment Variables**

   ```javascript
   // Create .env file
   REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
   REACT_APP_SPOTIFY_REDIRECT_URI=https://yourdomain.com
   
   // Update config
   export const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
   export const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
   ```

3. **Check HTTPS Requirements**
   - Production apps must use HTTPS
   - Update redirect URI to use https://

### Problem: Build fails

**Symptoms:**

- `npm run build` fails
- TypeScript or ESLint errors

**Solutions:**

1. **Fix ESLint Errors**

   ```bash
   npm run build
   # Fix any errors shown
   ```

2. **Check for Console Errors**

   ```javascript
   // Remove console.log statements in production
   if (process.env.NODE_ENV !== 'production') {
     console.log('Debug info');
   }
   ```

---

## ❌ Common Error Messages

### "Network request failed"

- **Cause:** No internet connection or API endpoint down
- **Solution:** Check internet connection and Spotify API status

### "Failed to fetch"

- **Cause:** Network error or CORS issue
- **Solution:** Check request format and headers

### "Invalid token"

- **Cause:** Token expired or malformed
- **Solution:** Re-authenticate user

### "Insufficient client scope"

- **Cause:** Missing required scopes
- **Solution:** Add required scopes to configuration

### "User not found"

- **Cause:** Invalid user ID or token
- **Solution:** Check authentication flow

---

## 🐛 Debugging Tips

### 1. Enable Detailed Logging

```javascript
// Add to your API calls
const getCurrentlyPlaying = async (accessToken) => {
  console.log('Fetching with token:', accessToken.substring(0, 10) + '...');
  
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  
  // ... rest of function
};
```

### 2. Test API Endpoints Directly

```bash
# Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.spotify.com/v1/me/player"
```

### 3. Use Browser Developer Tools

- **Network Tab:** Check API requests and responses
- **Console Tab:** Look for JavaScript errors
- **Application Tab:** Check localStorage for tokens

### 4. Validate Token Manually

```javascript
// Test token validity
const testToken = async (token) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
```

### 5. Check Spotify API Status

- Visit [Spotify API Status](https://status.spotify.com/)
- Check for any ongoing issues

---

## 📞 Getting Help

If you're still having issues:

1. **Check the Console:** Look for specific error messages
2. **Search GitHub Issues:** Check if others have similar problems
3. **Spotify Developer Forums:** [Community Support](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/SpotifyforDevelopers)
4. **Create an Issue:** If it's a bug in this project, create a GitHub issue

---

## 🔗 Useful Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [OAuth 2.0 Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

---

*Last updated: December 2024*
