# Environment Variables Documentation

This document provides a comprehensive reference for all environment variables used in the Interview OS application.

## 📋 Table of Contents

- [Backend Environment Variables](#backend-environment-variables)
- [Frontend Environment Variables](#frontend-environment-variables)
- [How to Set Environment Variables](#how-to-set-environment-variables)
- [Security Best Practices](#security-best-practices)

---

## Backend Environment Variables

### Required Variables

These variables **must** be set for the backend to function properly.

#### `MONGODB_URI`
- **Description**: MongoDB Atlas connection string
- **Type**: String (URI)
- **Required**: Yes
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/prapp?retryWrites=true&w=majority`
- **Where to get it**: 
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
  2. Click "Connect" on your cluster
  3. Choose "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your database user password
  6. Replace `<dbname>` with `prapp` (or your preferred database name)

#### `JWT_SECRET`
- **Description**: Secret key used to sign and verify JWT tokens
- **Type**: String
- **Required**: Yes
- **Default**: `your-secret-key-change-in-production` (⚠️ MUST change in production)
- **Example**: `a8f5f167f44f4964e6c998dee827110c` (use a random string)
- **How to generate**: 
  ```bash
  # Using Python
  python3 -c "import secrets; print(secrets.token_hex(32))"
  
  # Using OpenSSL
  openssl rand -hex 32
  
  # Using Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security**: Never commit this to version control. Use a strong, random string.

#### `OPENAI_API_KEY`
- **Description**: OpenAI API key for AI-powered features
- **Type**: String
- **Required**: Yes (for AI features)
- **Example**: `sk-proj-abc123...`
- **Where to get it**:
  1. Go to [OpenAI Platform](https://platform.openai.com)
  2. Navigate to API Keys section
  3. Create a new secret key
  4. Copy and save it immediately (you won't see it again)
- **Cost**: OpenAI charges per API call. Monitor usage in your OpenAI dashboard.

### Optional Variables

These variables have sensible defaults but can be customized.

#### `APP_ENV`
- **Description**: Application environment mode
- **Type**: String
- **Required**: No
- **Default**: `development`
- **Options**: `development`, `production`, `staging`
- **Example**: `production`
- **Usage**: Affects logging levels and error reporting

#### `PORT`
- **Description**: Port number for the backend server
- **Type**: Integer
- **Required**: No
- **Default**: `8000`
- **Example**: `8000`
- **Note**: Railway and other platforms automatically set this variable

#### `JWT_EXPIRES_IN`
- **Description**: JWT token expiration time in seconds
- **Type**: Integer
- **Required**: No
- **Default**: `604800` (7 days)
- **Example**: `604800`
- **Common values**:
  - 1 hour: `3600`
  - 1 day: `86400`
  - 7 days: `604800`
  - 30 days: `2592000`

#### `CORS_ORIGINS`
- **Description**: Comma-separated list of allowed frontend origins for CORS
- **Type**: String (comma-separated URLs)
- **Required**: No
- **Default**: `http://localhost:3000,http://localhost:3001`
- **Examples**:
  - Development: `http://localhost:3000,http://localhost:3001`
  - Production: `https://your-app.vercel.app,https://your-app-*.vercel.app`
  - Allow all (not recommended): `*`
- **Note**: Include both your production domain and preview deployment patterns

#### `OPENAI_MODEL`
- **Description**: OpenAI model to use for AI features
- **Type**: String
- **Required**: No
- **Default**: `gpt-4`
- **Options**: 
  - `gpt-4` - Most capable, higher cost
  - `gpt-4-turbo` - Faster, lower cost
  - `gpt-3.5-turbo` - Fastest, lowest cost
- **Example**: `gpt-4`
- **Cost consideration**: Different models have different pricing. Check [OpenAI Pricing](https://openai.com/pricing)

---

## Frontend Environment Variables

### Required Variables

#### `NEXT_PUBLIC_API_URL`
- **Description**: Backend API base URL
- **Type**: String (URL)
- **Required**: Yes
- **Examples**:
  - Development: `http://localhost:8000`
  - Production: `https://your-backend.railway.app`
- **Note**: Must start with `NEXT_PUBLIC_` to be accessible in the browser
- **Important**: Do NOT include a trailing slash

---

## How to Set Environment Variables

### Local Development

#### Backend
1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:
   ```bash
   nano .env  # or use your preferred editor
   ```

3. Never commit `.env` to version control (it's in `.gitignore`)

#### Frontend
1. Copy the example file:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your actual values:
   ```bash
   nano .env.local  # or use your preferred editor
   ```

3. Never commit `.env.local` to version control (it's in `.gitignore`)

### Railway (Backend)

1. Go to your Railway project
2. Select your backend service
3. Navigate to **"Variables"** tab
4. Click **"Add Variable"**
5. Enter variable name and value
6. Click **"Add"**
7. Railway will automatically redeploy with new variables

**Bulk Import:**
1. Click **"Raw Editor"** in the Variables tab
2. Paste all variables in `KEY=VALUE` format
3. Click **"Update Variables"**

### Vercel (Frontend)

1. Go to your Vercel project
2. Navigate to **"Settings"** → **"Environment Variables"**
3. Enter variable name and value
4. Select environments (Production, Preview, Development)
5. Click **"Save"**
6. Redeploy for changes to take effect

**Bulk Import:**
1. Use Vercel CLI:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   ```

---

## Security Best Practices

### ✅ DO

1. **Use strong, random secrets**
   - Generate JWT_SECRET with cryptographically secure random generators
   - Never use default or predictable values

2. **Keep secrets out of version control**
   - Never commit `.env` files
   - Use `.env.example` for documentation only
   - Verify `.gitignore` includes `.env` files

3. **Use different secrets for different environments**
   - Development, staging, and production should have different JWT_SECRET values
   - Use different OpenAI API keys if possible

4. **Rotate secrets regularly**
   - Change JWT_SECRET periodically (will invalidate existing tokens)
   - Rotate API keys if compromised

5. **Restrict CORS origins in production**
   - Use specific domains instead of `*`
   - Include preview deployment patterns for Vercel

6. **Monitor API usage**
   - Check OpenAI usage dashboard regularly
   - Set up billing alerts
   - Monitor MongoDB Atlas metrics

7. **Use environment-specific values**
   - Set `APP_ENV=production` in production
   - Use production database in production only

### ❌ DON'T

1. **Never hardcode secrets in code**
   - Always use environment variables
   - Never commit API keys or passwords

2. **Don't share secrets in plain text**
   - Use secure password managers
   - Don't send secrets via email or chat

3. **Don't use the same secrets across projects**
   - Each project should have unique secrets
   - Compromised secrets affect only one project

4. **Don't expose secrets in logs**
   - Sanitize logs before sharing
   - Don't log environment variables

5. **Don't use weak or predictable secrets**
   - Avoid dictionary words
   - Don't use personal information
   - Don't use sequential or simple patterns

---

## Environment Variables Checklist

### Backend Development
- [ ] `MONGODB_URI` - Set to your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Set to a random string (can use default for dev)
- [ ] `OPENAI_API_KEY` - Set to your OpenAI API key
- [ ] `CORS_ORIGINS` - Set to `http://localhost:3000` (or your frontend port)

### Backend Production (Railway)
- [ ] `APP_ENV` - Set to `production`
- [ ] `MONGODB_URI` - Set to production MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Set to a strong, random string (different from dev)
- [ ] `OPENAI_API_KEY` - Set to your OpenAI API key
- [ ] `CORS_ORIGINS` - Set to your Vercel domain(s)
- [ ] `OPENAI_MODEL` - Set to your preferred model (optional)

### Frontend Development
- [ ] `NEXT_PUBLIC_API_URL` - Set to `http://localhost:8000`

### Frontend Production (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` - Set to your Railway backend URL

---

## Troubleshooting

### "Environment variable not found" error

**Backend:**
- Verify `.env` file exists in the `backend` directory
- Check that variable names match exactly (case-sensitive)
- Restart the backend server after changing `.env`

**Frontend:**
- Verify `.env.local` file exists in the `frontend` directory
- Ensure variable starts with `NEXT_PUBLIC_`
- Restart the development server after changing `.env.local`

### "CORS error" in browser

- Check `CORS_ORIGINS` includes your frontend URL
- Ensure no trailing slash in URLs
- Verify backend is running and accessible
- Redeploy backend after changing CORS settings

### "MongoDB connection failed"

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes your IP or `0.0.0.0/0`
- Ensure database user has correct permissions
- Verify network connectivity

### "OpenAI API error"

- Verify `OPENAI_API_KEY` is correct and active
- Check OpenAI account has available credits
- Verify API key has necessary permissions
- Check OpenAI service status

---

## Quick Reference

### Backend `.env` Template

```env
# Application
APP_ENV=development
PORT=8000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prapp?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=604800

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
```

### Frontend `.env.local` Template

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Additional Resources

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Connection Strings](https://docs.atlas.mongodb.com/driver-connection/)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Last Updated**: 2026-02-13