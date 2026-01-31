# Deploying Question Generator Backend

Since this is a standalone backend, you must deploy it as a **Separate Project** on Vercel.

## 1. Prepare Code
1. Push the changes I just made (I added `vercel.json` and fixed CORS):
   ```bash
   git add backend-question-generator/server.js backend-question-generator/vercel.json
   git commit -m "Prepare Question Generator for Vercel"
   git push origin main
   ```

## 2. Create NEW Project in Vercel
1. Go to Vercel Dashboard -> **"Add New..."** -> **"Project"**.
2. Select `College_companion` repo again.
3. **Project Name**: Give it a unique name like `college-companion-cms` or `question-generator`.
4. **Root Directory**: Click "Edit" and select `backend-question-generator`.
   *(This ensures it runs this specific backend, not the main one)*.
5. **Framework Preset**: Select **Other**.

## 3. Environment Variables
Add these to the new project settings before deploying:

| Variable Name | Value (Copy from local `.env`) |
|--------------|--------------------------------|
| `MONGO_URI` | *Your connection string* |
| `GROQ_API_KEY` | *Your Groq Key* |
| `NODE_ENV` | `production` |

## 4. Deploy & Connect
1. Click **Deploy**.
2. Copy the new URL (e.g., `https://question-generator-xyz.vercel.app`).
3. You may need to update your **Frontend** or **Main Backend** environment variables to point to this new service if they communicate with it.
   - If your Frontend calls this directly, add `VITE_QUESTION_API_URL` (or similar) to your Frontend project settings.
