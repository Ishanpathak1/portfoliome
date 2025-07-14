# 🚀 Production Setup Guide

## Portfolio Generator - Scalable Version

Your portfolio generator has been upgraded to be production-ready with user authentication, database storage, and scalable architecture.

## 🏗️ Architecture Overview

- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, GitHub, Email)
- **File Storage**: Ready for AWS S3/Cloudinary
- **Caching**: Redis support for portfolio caching
- **User Management**: One portfolio per user
- **SEO**: Optimized metadata and social sharing

## ⚙️ Environment Setup

### 1. Create `.env` file

Copy the following into your `.env` file:

```env
# OpenAI API Key (keep your existing key)
OPENAI_API_KEY="your-openai-api-key-here"

# Database URL - Choose one option:

# Option A: Local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_generator"

# Option B: Supabase (Recommended for production)
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# Option C: PlanetScale, Railway, or other cloud provider
DATABASE_URL="your-cloud-database-url"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"  # Change to your domain in production
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters-long"

# OAuth Providers (Set up at least one)

# Google OAuth (https://console.developers.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (https://github.com/settings/applications/new)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Optional: AWS S3 for file uploads (future enhancement)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME=""

# Optional: Redis for caching (future enhancement)
REDIS_URL="redis://localhost:6379"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Change to your domain
NODE_ENV="development"  # Change to "production" when deploying
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database: `createdb portfolio_generator`
3. Update `DATABASE_URL` in `.env`

#### Option B: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string to `DATABASE_URL`

#### Option C: Other Cloud Providers

- **PlanetScale**: MySQL-compatible, great for production
- **Railway**: PostgreSQL, easy deployment
- **Neon**: PostgreSQL, serverless

### 3. OAuth Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

#### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/applications/new)
2. Register a new OAuth app
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (development)
   - `https://yourdomain.com/api/auth/callback/github` (production)

## 🎯 Installation & Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Production Deployment

#### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push

#### Railway

1. Connect GitHub repo to Railway
2. Add environment variables
3. Deploy with one click

#### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` to version control
2. **NEXTAUTH_SECRET**: Generate a strong secret (min 32 chars)
3. **Database**: Use SSL in production
4. **Rate Limiting**: Consider implementing API rate limits
5. **CORS**: Configure proper CORS policies

## 📊 Features

### User Authentication
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ One portfolio per user
- ✅ Automatic user session management

### Portfolio Management
- ✅ Database-backed storage
- ✅ AI-powered resume parsing
- ✅ SEO-optimized portfolio URLs
- ✅ View analytics tracking
- ✅ Responsive, modern designs

### Scalability
- ✅ PostgreSQL database
- ✅ Prisma ORM for type safety
- ✅ Built for horizontal scaling
- 🔜 Redis caching
- 🔜 CDN integration
- 🔜 File upload to S3/Cloudinary

## 🚀 Launch Checklist

- [ ] Database setup completed
- [ ] OAuth providers configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Domain configured (production)
- [ ] SSL certificate enabled
- [ ] Analytics setup (optional)
- [ ] Error monitoring (Sentry, etc.)

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db push --accept-data-loss
```

### OAuth Not Working
- Check redirect URIs match exactly
- Verify client ID and secret
- Ensure environment variables are loaded

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📈 Monitoring & Analytics

Consider adding:
- **Error Tracking**: Sentry, Bugsnag
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: Vercel Analytics, New Relic
- **Uptime**: UptimeRobot, Pingdom

## 🎉 You're Ready!

Your portfolio generator is now production-ready with:
- ✅ User authentication
- ✅ Scalable database architecture
- ✅ One portfolio per user
- ✅ SEO optimization
- ✅ Beautiful, responsive designs

Deploy and start helping users create amazing portfolios! 🚀 