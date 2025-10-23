# Deployment Instructions

## Prerequisites

- Supabase project (already configured with database schema)
- Vercel account
- GitHub repository

## Environment Variables

The app requires two environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://jpglqbgrnymqounqhbcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZ2xxYmdybnltcW91bnFoYmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTgzMjksImV4cCI6MjA3Njc5NDMyOX0.dsvjsO-TGL-zTQks_J8cVRLCUpwL1hWN9NLNagi6UOk
```

## Deploy to Vercel

### Option 1: Auto-deploy from GitHub (Recommended)

1. Push this repository to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your GitHub repository
4. Add the environment variables:
   - Go to **Project Settings** → **Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL` with the value above
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the value above
   - Make sure to add them for **Production**, **Preview**, and **Development**
5. Deploy!

### Option 2: Deploy via CLI

```bash
# From project root
npx vercel --prod \
  -e NEXT_PUBLIC_SUPABASE_URL="https://jpglqbgrnymqounqhbcq.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZ2xxYmdybnltcW91bnFoYmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTgzMjksImV4cCI6MjA3Njc5NDMyOX0.dsvjsO-TGL-zTQks_J8cVRLCUpwL1hWN9NLNagi6UOk"
```

## Database Setup

The database schema has already been applied to your Supabase project:

- `game_sessions` table with PIN-based access
- `players` table for participant tracking
- `answers` table for storing responses
- Row Level Security (RLS) policies configured for public access
- Indexes optimized for real-time queries

## Supabase Realtime

Make sure **Realtime** is enabled in your Supabase project:

1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for: `game_sessions`, `players`, `answers`

## Testing After Deployment

1. **Host Flow**: Visit `/host` to create a game and get a PIN
2. **Player Flow**: Visit `/play` and enter the PIN on a mobile device
3. Test with multiple players to verify real-time sync works

## URLs

- **Homepage**: Shows both Host and Play buttons
- **Host Game**: `/host` → Creates game → `/host/[PIN]`
- **Join Game**: `/play` → Enter PIN → `/play/[PIN]`

## Troubleshooting

### "supabaseUrl is required" error
- Ensure environment variables are set in Vercel dashboard
- Redeploy after adding environment variables

### Players not appearing in lobby
- Check Supabase Realtime is enabled
- Verify RLS policies are set correctly
- Check browser console for connection errors

### Database connection errors
- Verify the Supabase URL and anon key are correct
- Check Supabase project is not paused (free tier)

## Production Checklist

- [ ] Environment variables added to Vercel
- [ ] Supabase Realtime enabled
- [ ] Test game flow with 2+ players
- [ ] Test on mobile devices
- [ ] Verify scoring calculations
- [ ] Test reconnection handling
