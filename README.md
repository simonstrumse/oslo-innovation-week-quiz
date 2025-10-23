# Oslo Innovation Week Quiz 🎮

A live multiplayer quiz game built with Next.js and Supabase, inspired by Kahoot. Features real-time synchronization, mobile-optimized player experience, and projector-friendly host interface.

## Features

- 🎯 **Real-time Multiplayer**: Instant sync across all devices using Supabase Realtime
- 📱 **Mobile Optimized**: Perfect on phones for players, desktop for hosts
- 🏆 **Live Leaderboard**: Rankings update after each question with speed bonuses
- ⚡ **Speed Scoring**: 1000 base points + up to 500 bonus for fast answers
- 🎨 **Kahoot-style UI**: Colored answer buttons (red, blue, yellow, green)
- 🔄 **Reconnection Handling**: Players can reconnect without losing progress
- 🎪 **No Authentication**: Simple PIN-based access for quick games

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (WebSocket)
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How to Play

### For Hosts:
1. Go to `/host` or click "Host Game"
2. Share the PIN displayed on screen
3. Wait for players to join
4. Click "Start Game" when ready
5. Watch the leaderboard update in real-time!

### For Players:
1. Go to `/play` or click "Join Game" on mobile
2. Enter the PIN and your name
3. Answer questions as fast as you can
4. See your score and ranking after each question

## Project Structure

```
quiz-app/
├── app/
│   ├── host/
│   │   ├── page.tsx           # Host lobby (PIN generation)
│   │   └── [pin]/page.tsx     # Host game screen
│   ├── play/
│   │   ├── page.tsx           # Player join screen
│   │   └── [pin]/page.tsx     # Player game screen
│   └── page.tsx               # Homepage
├── components/
│   ├── AnswerButton.tsx       # Colored answer options
│   ├── Leaderboard.tsx        # Animated rankings
│   ├── PlayerList.tsx         # Lobby player grid
│   ├── QuestionCard.tsx       # Question display
│   └── Timer.tsx              # Countdown timer
├── lib/
│   ├── questions.ts           # Quiz questions (hardcoded)
│   └── supabase.ts            # Supabase client setup
└── DEPLOYMENT.md              # Deployment instructions
```

## Database Schema

The app uses three main tables:

- **game_sessions**: Stores game state and PIN
- **players**: Tracks participants and scores
- **answers**: Records all player responses

See `DEPLOYMENT.md` for database setup details.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:
- Vercel setup with GitHub auto-deploy
- Environment variable configuration
- Supabase Realtime setup
- Production checklist

## Development

Built for Oslo Innovation Week 2025 with 10 questions about the event program.

**Question Topics**:
- Event schedule and locations
- Programme tags and themes
- Organizers and partners
- Specific session details

## License

MIT
