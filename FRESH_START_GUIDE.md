# Fresh Deployment Guide (Backend Only)

Follow this restart guide to wipe the slate clean and deploy your Backend correctly.

## Phase 1: Preparation (Do this locally)
1. **Prepare your repo**: Run this command to ensure all my recent fixes are uploaded.
   ```powershell
   git add .
   git commit -m "Finalizing backend configuration for fresh deployment"
   git push origin main
   ```

## Phase 2: Create New Project (Vercel Dashboard)
1. Go to Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2. Select your `College_companion` repository.
3. **IMPORTANT**:
   - **Framework Preset**: select **Other** (do NOT select Vite or Next.js).
   - **Root Directory**: Click "Edit" and select `backend`.

## Phase 3: Environment Variables (The Critical Part)
Before clicking "Deploy", scroll down to **Environment Variables** and add these EXACTLY.

| Variable Name | Value To Enter |
|--------------|----------------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | *Copy from your local .env* |
| `GEMINI_API_KEY` | *Copy from your local .env* |
| `GROQ_API_KEY` | *Copy from your local .env* |
| `RTDB_URL` | *Copy from your local .env* |
| `ALLOWED_ORIGINS` | `https://mernproj1.vercel.app` |

### Firebase Variables (Open your local `firebase-admin-sdk.json`)
You must open `firebase-admin-sdk.json` on your PC and copy these values:

| Variable Name | Value To Enter |
|--------------|----------------|
| `FIREBASE_PROJECT_ID` | `lmswebapp-synapslogic` *(Confirm this matches "project_id" in your json)* |
| `FIREBASE_CLIENT_EMAIL` | *Copy "client_email" from json (e.g. firebase-adminsdk-xxx@...)* |
| `FIREBASE_PRIVATE_KEY` | *Copy "private_key" from json (Copy the ENTIRE string including `-----BEGIN...`)* |

## Phase 4: Deploy & Verify
1. Click **"Deploy"**.
2. Wait for the green "Ready" screen.
3. Click the domain link (e.g., `https://backend-xyz.vercel.app`).
   - You should see: `Cannot GET /` (or a health check message).
   - Go to `https://<YOUR_BACKEND_URL>/health`
   - You SHOULD see: `{"status":"ok", "services":...}`

## Phase 5: Connect Frontend (Last Step)
1. Go to your **EXISTING Frontend Project** on Vercel.
2. Go to **Settings** -> **Environment Variables**.
3. Edit `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.
4. Paste your **NEW Backend URL** from Phase 4.
5. Go to **Deployments** and click **Redeploy**.

**Reasoning:**
- We skip `VITE_` variables in Backend (they are useless there).
- We manually set `ALLOWED_ORIGINS` to allow your specific frontend.
- We ensure `FIREBASE_` keys match exactly what's in your JSON file.
