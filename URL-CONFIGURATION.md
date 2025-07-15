# Portfolio URL Configuration

## Problem
Portfolio links show as `localhost:3000/portfolio-slug` instead of your actual domain like `unifieddata.app/portfolio-slug`.

## Solution
Configure the `NEXT_PUBLIC_APP_URL` environment variable to use your domain.

## Setup Steps

### 1. Create Environment File
Create a `.env.local` file in your project root (same level as `package.json`):

```env
NEXT_PUBLIC_APP_URL="https://unifieddata.app"
```

**Replace `unifieddata.app` with your actual domain!**

### 2. Environment Variable Examples

For different environments:

```env
# Development
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Production
NEXT_PUBLIC_APP_URL="https://unifieddata.app"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://portfolio.yoursite.com"
```

### 3. Deployment Platforms

#### Vercel
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add: `NEXT_PUBLIC_APP_URL` = `https://unifieddata.app`

#### Netlify
1. Go to Site Settings → Environment Variables
2. Add: `NEXT_PUBLIC_APP_URL` = `https://unifieddata.app`

#### Other Platforms
Set the environment variable in your deployment platform's settings.

## Verification

After setting the environment variable:

1. Restart your development server: `npm run dev`
2. Go to Dashboard → Portfolio URL section
3. The URL should now show: `https://unifieddata.app/your-slug`
4. Copy the portfolio link - it should use your domain

## Important Notes

- ✅ Always use `https://` for production URLs
- ✅ Don't include trailing slashes: `https://unifieddata.app` (not `https://unifieddata.app/`)
- ✅ Restart your application after changing environment variables
- ⚠️ This affects all portfolio links throughout the application

## Troubleshooting

**Still seeing localhost?**
1. Check if `.env.local` file exists and has the correct variable
2. Restart your development server
3. Clear browser cache
4. Verify the environment variable is set in your deployment platform

**Links not working?**
1. Make sure your domain is accessible
2. Check that your domain has proper SSL certificate
3. Verify DNS settings are correct 