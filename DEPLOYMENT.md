# Deployment Guide for Vercel

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)

## Step 1: Create Supabase Database (FREE)

1. Go to **[supabase.com](https://supabase.com)** and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `niuarno-portfolio`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait ~2 minutes

5. Once created, go to **Settings** → **Database**
6. Find the **Connection string** section and copy the **URI** format
7. It looks like: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

## Step 2: Push Code to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Niuarno portfolio"

# Create GitHub repo and push
# Option A: Use GitHub CLI
gh repo create niuarno-portfolio --public --source=. --push

# Option B: Manual push
# 1. Create repo on github.com
# 2. Run:
git remote add origin https://github.com/YOUR_USERNAME/niuarno-portfolio.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `niuarno-portfolio` repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`

5. Add **Environment Variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Supabase connection string (change port 6543 to 5432) |
| `DIRECT_DATABASE_URL` | Same as DATABASE_URL |
| `ADMIN_TOKEN` | `niuarno-admin-2024` (or your preferred token) |

**Important**: Replace `[PASSWORD]` in the connection string with your actual Supabase password!

6. Click **"Deploy"** and wait ~2 minutes

## Step 4: Seed the Database

After deployment succeeds:

1. Go to your site URL (e.g., `https://niuarno-portfolio.vercel.app`)
2. Open browser console (F12)
3. Run this:

```javascript
fetch('/api/seed', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer niuarno-admin-2024'
  }
})
.then(r => r.json())
.then(console.log)
```

Or use curl:
```bash
curl -X POST https://your-site.vercel.app/api/seed -H "Authorization: Bearer niuarno-admin-2024"
```

## Step 5: Access Admin Panel

1. Go to: `https://your-site.vercel.app/admin`
2. Enter your admin token: `niuarno-admin-2024`
3. You can now manage:
   - Projects
   - Services
   - Skills
   - Experience
   - Messages
   - Site Settings

## Troubleshooting

### Database Connection Error
- Check that DATABASE_URL is correct
- Make sure password is URL-encoded if it contains special characters
- Try using the transaction pooler (port 6543) for DATABASE_URL and session pooler (port 5432) for DIRECT_DATABASE_URL

### Build Failed
- Check build logs in Vercel dashboard
- Make sure all environment variables are set
- Try redeploying

### Images Not Saving
- Supabase has a limit on row size
- Consider using Supabase Storage for images
- Or use external image hosting like Cloudinary

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

Need help? Contact support or check Vercel documentation.
