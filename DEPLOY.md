# Deploying Datum to Cloudflare Pages

## Prerequisites

1. A Cloudflare account (free tier works)
2. Your code pushed to GitHub (at https://github.com/emircansac/datum.git)

## Step-by-Step Deployment

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com
   - Log in to your account

2. **Create a Pages Project**
   - Click "Workers & Pages" in the sidebar
   - Click "Create application"
   - Select "Pages" → "Connect to Git"

3. **Connect Your Repository**
   - Authorize Cloudflare to access your GitHub account
   - Select the repository: `emircansac/datum`
   - Click "Begin setup"

4. **Configure Build Settings**
   - **Project name**: `datum` (or your preferred name)
   - **Production branch**: `main`
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (leave as default)

5. **Set Environment Variables**
   Click "Environment variables" and add:
   - `ADMIN_PASSWORD` = `your-secure-password-here`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project-name.pages.dev` (you'll get this after first deploy)

6. **Deploy**
   - Click "Save and Deploy"
   - Wait for the build to complete (5-10 minutes first time)
   - Your site will be live at `https://your-project-name.pages.dev`

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build and Deploy**:
   ```bash
   cd /Users/zeyne/Documents/GitHub/datum
   npm install
   npm run pages:build
   wrangler pages deploy .vercel/output/static --project-name=datum
   ```

## Post-Deployment

1. **Update Site URL**
   - After first deployment, note your site URL
   - Go to Cloudflare Pages → Your Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_SITE_URL` to your actual URL

2. **Test Your Site**
   - Visit your site URL
   - Test public pages
   - Test admin login at `/admin/login`
   - Test embed functionality

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18+ in Cloudflare settings
- Check build logs in Cloudflare dashboard

### API Routes Not Working
- Ensure you're using `@cloudflare/next-on-pages` (already configured)
- Check that middleware is properly set up
- Verify environment variables are set

### Admin Login Not Working
- Verify `ADMIN_PASSWORD` environment variable is set correctly
- Check that cookies are enabled in your browser
- Ensure `NEXT_PUBLIC_SITE_URL` matches your actual domain

## Custom Domain (Optional)

1. Go to Cloudflare Pages → Your Project → Custom domains
2. Click "Set up a custom domain"
3. Follow the instructions to add your domain
4. Update DNS records as instructed

## Continuous Deployment

Once connected to GitHub, Cloudflare Pages will automatically deploy:
- Every push to `main` branch → Production
- Every push to other branches → Preview deployments

No additional configuration needed!
