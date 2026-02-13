# Interview OS - Deployment Guide

This guide will walk you through deploying the Interview OS application to the cloud. The backend will be deployed to Railway, and the frontend to Vercel.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **GitHub Account** - For connecting to deployment platforms
2. **MongoDB Atlas Account** - For the production database
3. **OpenAI API Key** - For AI features
4. **Railway Account** - For backend deployment (free tier available)
5. **Vercel Account** - For frontend deployment (free tier available)

## 🎯 Deployment Overview

- **Backend**: FastAPI on Railway
- **Frontend**: Next.js on Vercel
- **Database**: MongoDB Atlas (already configured)
- **Estimated Time**: 20-30 minutes

---

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to GitHub:
```bash
cd /path/to/Prapp
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Click **"Login"** and sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `prapp` repository
6. Railway will detect it as a monorepo

### Step 3: Configure Backend Service

1. After selecting the repo, Railway will ask which service to deploy
2. Click **"Add Service"** → **"GitHub Repo"**
3. In the service settings:
   - **Name**: `prapp-backend`
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty, Railway auto-detects)
   - **Start Command**: (leave empty, uses railway.json)

### Step 4: Add Environment Variables

In the Railway dashboard for your backend service:

1. Go to **"Variables"** tab
2. Click **"Add Variable"** and add each of these:

```env
APP_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/prapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_EXPIRES_IN=604800
CORS_ORIGINS=*
OPENAI_API_KEY=sk-your-actual-openai-api-key
OPENAI_MODEL=gpt-4
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
- Replace `JWT_SECRET` with a strong random string (use a password generator)
- Replace `OPENAI_API_KEY` with your actual OpenAI API key
- `CORS_ORIGINS=*` allows all origins (you can restrict this later to your Vercel domain)

### Step 5: Deploy Backend

1. Click **"Deploy"** in the Railway dashboard
2. Wait for the build to complete (2-5 minutes)
3. Once deployed, Railway will provide a URL like: `https://prapp-backend-production.up.railway.app`
4. **Save this URL** - you'll need it for the frontend!

### Step 6: Verify Backend Deployment

1. Visit your Railway URL + `/healthz`
   - Example: `https://prapp-backend-production.up.railway.app/healthz`
2. You should see: `{"status":"ok","db_connected":true,"timestamp":"..."}`
3. Visit your Railway URL + `/docs` to see the API documentation

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"** with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `prapp` repository
5. Vercel will detect it as a monorepo

### Step 2: Configure Frontend Service

1. In the project configuration:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

In the Vercel project settings:

1. Go to **"Settings"** → **"Environment Variables"**
2. Add the following variable:

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
```

**Replace** `your-railway-backend-url.up.railway.app` with your actual Railway backend URL from Part 1, Step 5.

**Example:**
```env
NEXT_PUBLIC_API_URL=https://prapp-backend-production.up.railway.app
```

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for the build to complete (2-4 minutes)
3. Once deployed, Vercel will provide a URL like: `https://prapp-frontend.vercel.app`
4. **Save this URL** - this is your production frontend!

### Step 5: Update Backend CORS Settings

Now that you have your Vercel URL, update the backend CORS settings:

1. Go back to Railway dashboard
2. Navigate to your backend service → **"Variables"**
3. Update `CORS_ORIGINS` to include your Vercel URL:

```env
CORS_ORIGINS=https://prapp-frontend.vercel.app,https://prapp-frontend-*.vercel.app
```

This allows your Vercel frontend (including preview deployments) to communicate with the backend.

4. Click **"Save"** - Railway will automatically redeploy

### Step 6: Verify Full Deployment

1. Visit your Vercel URL: `https://prapp-frontend.vercel.app`
2. Try to sign up for a new account
3. Try to log in
4. Create a test interview session
5. Verify all features work correctly

---

## 🔧 Post-Deployment Configuration

### Update MongoDB Atlas IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **"Network Access"**
3. Click **"Add IP Address"**
4. Add `0.0.0.0/0` to allow access from anywhere (Railway and Vercel use dynamic IPs)
   - **Note**: This is safe because your database still requires authentication

### Set Up Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

#### For Backend (Railway):
1. Go to Railway project → **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow Railway's DNS configuration instructions

---

## 🔍 Monitoring and Logs

### Railway (Backend)

1. Go to your Railway project
2. Click on the backend service
3. Navigate to **"Deployments"** tab to see deployment history
4. Click **"View Logs"** to see real-time logs
5. Monitor for errors or issues

### Vercel (Frontend)

1. Go to your Vercel project
2. Navigate to **"Deployments"** tab
3. Click on any deployment to see build logs
4. Use **"Functions"** tab to monitor serverless function performance

---

## 🐛 Troubleshooting

### Backend Issues

#### "Failed to connect to MongoDB"
- Verify `MONGODB_URI` is correct in Railway environment variables
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user has correct permissions

#### "CORS Error" in Frontend
- Verify `CORS_ORIGINS` in Railway includes your Vercel URL
- Check that the URL doesn't have a trailing slash
- Redeploy backend after changing CORS settings

#### "Internal Server Error"
- Check Railway logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure `JWT_SECRET` is set and not the default value

### Frontend Issues

#### "Failed to fetch" or "Network Error"
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check that the backend URL is accessible
- Ensure backend is deployed and running

#### "Build Failed"
- Check Vercel build logs for specific errors
- Verify all dependencies are in `package.json`
- Try building locally first: `npm run build`

#### "Environment Variable Not Found"
- Ensure `NEXT_PUBLIC_API_URL` is set in Vercel
- Redeploy after adding environment variables
- Check that variable name starts with `NEXT_PUBLIC_`

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

### Automatic Deployments

- **Railway**: Automatically deploys when you push to `main` branch
- **Vercel**: Automatically deploys when you push to `main` branch
- **Preview Deployments**: Vercel creates preview URLs for pull requests

### Manual Deployments

#### Railway:
1. Go to your project
2. Click **"Deploy"** → **"Redeploy"**

#### Vercel:
1. Go to your project
2. Click **"Deployments"** → **"Redeploy"**

---

## 📊 Environment Variables Reference

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Railway) | `8000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration in seconds | `604800` (7 days) |
| `CORS_ORIGINS` | Allowed frontend origins | `https://your-app.vercel.app` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-backend.railway.app` |

---

## 🎉 Success Checklist

- [ ] Backend deployed to Railway
- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] User can sign up and log in
- [ ] User can create interview sessions
- [ ] AI conversation works
- [ ] Session history displays correctly
- [ ] Analytics dashboard shows data
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS settings updated with Vercel URL

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Railway and Vercel logs
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas is accessible
5. Test the backend health endpoint directly

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT secrets** - Generate random strings
3. **Restrict CORS origins** - Use specific domains in production
4. **Keep API keys secure** - Only set them in platform environment variables
5. **Monitor logs regularly** - Check for suspicious activity
6. **Update dependencies** - Keep packages up to date

---

## 📝 Next Steps

After successful deployment:

1. Set up custom domains (optional)
2. Configure monitoring and alerts
3. Set up backup strategies for MongoDB
4. Implement rate limiting (if needed)
5. Add analytics tracking
6. Set up error tracking (e.g., Sentry)

---

**Congratulations! Your Interview OS application is now live! 🚀**

For questions or issues, refer to the troubleshooting section or check the platform documentation:
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)