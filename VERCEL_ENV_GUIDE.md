# Vercel Deployment Guide

## 1. Frontend Configuration (Vercel)
You found the correct backend URL! You need to update your **Frontend** project settings on Vercel to point to it.

**Update these Environment Variables:**
- **VITE_API_BASE_URL**: `https://backend-jautpgozo-yugenjrs-projects.vercel.app`
- **VITE_SOCKET_URL**: `https://backend-jautpgozo-yugenjrs-projects.vercel.app`

*(After updating these variables in the Vercel dashboard, go to the "Deployments" tab and **Redeploy** the latest commit for changes to take effect.)*

---

## 2. Backend Configuration (Vercel)
Yes, you **MUST redeploy the backend** to apply the CORS fixes I made in the previous step.

**Required Environment Variables:**
Since `localhost` won't work on the cloud, you must add these variables to your **Backend** project settings in Vercel:

| Variable Name | Value |
|--------------|-------|
| `MONGO_URI` | *Copy from your local .env* |
| `GEMINI_API_KEY` | *Copy from your local .env* |
| `GROQ_API_KEY` | *Copy from your local .env* |
| `RTDB_URL` | *Copy from your local .env* |

### **Firebase Admin Setup for Backend**
The backend cannot read your local `firebase-admin-sdk.json` file on Vercel. You must open that JSON file on your computer and copy its values into individual environment variables:

| Variable Name | Value (from your JSON file) |
|--------------|-----------------------------|
| `FIREBASE_PROJECT_ID` | `project_id` value from file |
| `FIREBASE_CLIENT_EMAIL` | `client_email` value from file |
| `FIREBASE_PRIVATE_KEY` | `private_key` value (Copy the WHOLE string, including `-----BEGIN PRIVATE KEY...`) |

**Important Note on Private Key:**
When you copy the private key, it will look like one long line with `\n` characters working. **Paste it exactly like that.** Our code is smart enough to handle the newlines correctly.

---

## 3. Deployment Steps
1. **Push Changes**:
   ```bash
   git push origin main
   ```
   *(This triggers a deployment, but it might fail or look wrong until variables are set.)*

2. **Update Variables**: 
   - Go to Vercel Dashboards for both projects.
   - Add the variables listed above.

3. **Redeploy**:
   - In Vercel, go to **Deployments** -> **... (Three dots)** -> **Redeploy**.
   - Do this for **BOTH** Frontend and Backend.

This resolves the mismatch and ensures your live site works just like your local version!
