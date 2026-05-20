# Where ArogyaAI stores user data

## On Vercel (current live site) — without MongoDB

If you did **not** add a valid `MONGODB_URI` in Vercel:

| Data | Location |
|------|----------|
| **User accounts** | Serverless temp folder: `/tmp/arogyaai-data/users.json` |
| **Appointments** | `/tmp/arogyaai-data/appointments.json` |
| **Health cart/records** | `/tmp/arogyaai-data/db.json` |

**Important:** Vercel `/tmp` is **temporary**. Data can be **lost** when the server restarts or redeploys. For a real app, use **MongoDB Atlas** (below).

Passwords are stored **hashed** with bcrypt (never plain text).

---

## Local development (`npm run server`)

| Data | File path |
|------|-----------|
| Users | `backend/users.json` |
| Appointments | `backend/appointments.json` |
| Health data | `backend/db.json` |

---

## With MongoDB Atlas (recommended for production)

Add a real connection string in Vercel → Environment Variables:

```
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/arogyaai
```

| Collection | Stores |
|------------|--------|
| `users` | Registration, login, profile |
| `appointments` | Booked appointments |
| `medicines`, `orders`, etc. | Pharmacy & orders |

Data persists permanently in your Atlas cluster.

---

## Browser (frontend only)

| Data | Location |
|------|----------|
| Login session | `localStorage` → keys `token`, `user` |
| Health UI state | `localStorage` → `vitalis_health_data` |

This is only on the user's device, not the server database.
