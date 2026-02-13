# 🚀 Quick Deployment Guide

**Estimated Time**: 20-30 minutes

This is a condensed version of the full deployment guide. For detailed instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## Prerequisites Checklist

- [ ] GitHub account
- [ ] MongoDB Atlas account with connection string
- [ ] OpenAI API key
- [ ] Code pushed to GitHub repository

---

## Part 1: Deploy Backend (Railway) - 10 minutes

### 1. Create Railway Project
1. Go to [railway.app](https://railway.app) → Login with GitHub
2. **New Project** → **Deploy from GitHub repo** → Select `prapp`
3. Configure service:
   - Name: `prapp-backend`
   - Root Directory: `backend`

### 2. Add Environment Variables
Go to **Variables** tab and add:

```env
APP_ENV=production
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/prapp
JWT_SECRET=GENERATE_RANDOM_STRING_HERE
CORS_ORIGINS=*
OPENAI_API_KEY=sk-YOUR_KEY_HERE
OPENAI_MODEL=gpt-4
```

**Generate JWT_SECRET:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Deploy & Get URL
1. Click **Deploy**
2. Wait 2-5 minutes
3. Copy your Railway URL (e.g., `https://prapp-backend-production.up.railway.app`)
4. Test: Visit `YOUR_URL/healthz` - should return `{"status":"ok"}`

---

## Part 2: Deploy Frontend (Vercel) - 10 minutes

### 1. Create Vercel Project
1. Go to [vercel.com](https://vercel.com) → Login with GitHub
2. **Add New** → **Project** → Import `prapp`
3. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`

### 2. Add Environment Variable
Go to **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
```

Replace with your actual Railway URL from Part 1.

### 3. Deploy
1. Click **Deploy**
2. Wait 2-4 minutes
3. Copy your Vercel URL (e.g., `https://prapp-frontend.vercel.app`)

---

## Part 3: Final Configuration - 5 minutes

### 1. Update Backend CORS
Go back to Railway → **Variables** → Update:

```env
CORS_ORIGINS=https://your-vercel-url.vercel.app,https://your-vercel-url-*.vercel.app
```

Railway will auto-redeploy.

### 2. Configure MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. **Network Access** → **Add IP Address** → Add `0.0.0.0/0`

### 3. Test Your Deployment
Visit your Vercel URL and:
- [ ] Sign up for an account
- [ ] Log in
- [ ] Create an interview session
- [ ] Test AI conversation
- [ ] Check session history

---

## 🎉 Success!

Your Interview OS is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/docs`

---

## 📚 Additional Resources

- **Full Deployment Guide**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Environment Variables**: [`ENV_VARIABLES.md`](./ENV_VARIABLES.md)
- **Troubleshooting**: See [`DEPLOYMENT.md`](./DEPLOYMENT.md#-troubleshooting)

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend health check fails | Check Railway logs, verify MongoDB URI |
| Frontend can't connect | Verify `NEXT_PUBLIC_API_URL` in Vercel |
| CORS errors | Update `CORS_ORIGINS` in Railway with Vercel URL |
| MongoDB connection fails | Add `0.0.0.0/0` to MongoDB Atlas IP whitelist |

---

## 🔄 Continuous Deployment

Both platforms auto-deploy when you push to `main`:
- **Railway**: Backend auto-deploys
- **Vercel**: Frontend auto-deploys + creates preview URLs for PRs

---

**Need help?** Check the full [`DEPLOYMENT.md`](./DEPLOYMENT.md) guide for detailed instructions and troubleshooting.