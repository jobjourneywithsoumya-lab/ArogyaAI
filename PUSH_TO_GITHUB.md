# Push ArogyaAI to GitHub (for Vercel)

Your project is already committed locally on branch `main`.

## Step 1 — Create a GitHub repository

1. Open https://github.com/new
2. Repository name: `arogyaai` (or any name you prefer)
3. Set visibility: **Public** (or Private)
4. **Do not** add README, .gitignore, or license (repo must be empty)
5. Click **Create repository**

## Step 2 — Push from your PC

In PowerShell, run (replace `YOUR_USERNAME` with your GitHub username):

```powershell
cd "C:\Users\soumy\Desktop\healthcare and well being\healthcare and well being"

git remote add origin https://github.com/YOUR_USERNAME/arogyaai.git
git push -u origin main
```

If `origin` already exists:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/arogyaai.git
git push -u origin main
```

## Step 3 — Deploy on Vercel

1. Go to https://vercel.com/new
2. **Import** your `arogyaai` GitHub repository
3. Root Directory: `.` (project root — where `vercel.json` is)
4. Add environment variables from `.env.example`
5. Deploy

See `VERCEL_DEPLOY.md` for full environment variable list.
