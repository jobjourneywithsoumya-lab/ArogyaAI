# Deploy ArogyaAI on Vercel

## 1. Push to GitHub
Push the `healthcare and well being` folder as your repo root (or set Root Directory in Vercel).

## 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your repository
3. **Root Directory:** `healthcare and well being` (if monorepo)
4. Framework: **Vite** (auto-detected)

## 3. Environment Variables
Add these in Vercel → Project → Settings → Environment Variables:

| Variable | Example |
|----------|---------|
| `JWT_SECRET` | long random string |
| `EMAIL_USER` | your@gmail.com |
| `EMAIL_PASS` | Gmail app password |
| `VITE_API_BASE_URL` | `https://your-project.vercel.app` |
| `FRONTEND_URL` | `https://your-project.vercel.app` |
| `CORS_ORIGIN` | `https://your-project.vercel.app` |
| `CRON_SECRET` | random secret for cron |
| `MONGODB_URI` | (optional) Atlas connection string |
| `TWILIO_*` | (optional) for live SMS |

## 4. Deploy
Click **Deploy**. Vercel will:
- Build the React app (`dist/`)
- Run API routes from `/api` (Express backend)
- Run daily appointment reminders at 7:00 AM UTC via cron

## 5. Local development
```bash
npm install
npm run dev:all
```
- Frontend: http://localhost:5173
- API: http://127.0.0.1:4000

## Notes
- **Email/SMS:** Without Gmail/Twilio credentials, messages are logged in the server console (demo mode).
- **Logo:** Replace `public/arogyaai-logo.svg` with your PNG if you have the original file.
- **MongoDB:** Optional; JSON file storage works for demos.
