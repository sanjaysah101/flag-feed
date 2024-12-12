# Deployment Guide

## Prerequisites

- Vercel account
- Supabase project
- DevCycle account
- pnpm installed

## Environment Variables

```env
# Supabase
SUPABASE_DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
SUPABASE_DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON="your-anon-key"

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# DevCycle
NEXT_PUBLIC_DEVCYCLE_SERVER_SDK_KEY=your-server-key
NEXT_PUBLIC_DEVCYCLE_CLIENT_SDK_KEY=your-client-key
```

## Build & Deploy

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Build application
pnpm build

# Start production server
pnpm start
```

## Deployment Steps

1. **Prepare Supabase**

   - Set up database schema
   - Configure Row Level Security
   - Enable required extensions

2. **Configure Vercel**

   - Connect GitHub repository
   - Set environment variables
   - Configure build settings:

     ```json
     {
       "buildCommand": "prisma generate && pnpm run build",
       "installCommand": "pnpm install",
       "framework": "nextjs"
     }
     ```

3. **Deploy Application**

   - Push changes to main branch
   - Monitor build process
   - Verify deployment

4. **Post-Deployment**
   - Verify feature flags
   - Check database connections
   - Test authentication flows
   - Validate real-time features

## Monitoring

- Vercel Analytics for performance metrics
- Supabase Dashboard for database monitoring
- DevCycle dashboard for feature flag analytics
- Error tracking with Vercel's error monitoring

## Troubleshooting

- Check Vercel build logs
- Verify environment variables
- Monitor Supabase connection status
- Review DevCycle flag evaluations
