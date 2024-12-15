# FlagFeed 📰

A developer-focused learning platform that combines RSS feed curation with gamification, powered by
Supabase and DevCycle feature flags.

## Overview 🎯

FlagFeed helps developers stay updated with tech content through personalized RSS feeds while making
learning engaging through gamification. Using Supabase's real-time capabilities and DevCycle's
feature flag system, we progressively enhance the learning experience.

## Features ✨

### Core Features

- 📚 Curated tech RSS feeds with real-time updates
- 🎮 Learn-and-earn points system
- 🚀 Progressive feature rollouts
- ✅ Real-time quiz competitions
- 🔄 Supabase real-time subscriptions
- 🔐 Row Level Security implementation

### Feature Flags (DevCycle)

- 🔄 Advanced feed filtering
- 🏆 Gamification elements
- 📊 Learning analytics
- 🎯 Personalized content

### Supabase Features

- 🔄 Real-time feed updates
- 👥 User authentication
- 🗃️ PostgreSQL database
- 🔒 Row Level Security
- 🎮 Real-time quiz competitions
- 📊 Analytics tracking

## Tech Stack 💻

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Feature Flags**: [DevCycle](https://devcycle.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project
- DevCycle account

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/sanjaysah101/flag-feed.git
cd flagfeed
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Set up environment variables

```bash
cp .env.example .env.local
```

#### 4. Update `.env.local` with your credentials

```env
MONGODB_URI=your_mongodb_uri
DEVCYCLE_CLIENT_KEY=your_devcycle_client_key
DEVCYCLE_SERVER_KEY=your_devcycle_server_key
```

#### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts 📝

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- DevCycle for the feature flag challenge
- Next.js team for the amazing framework
- All contributors and supporters

---

Built with ❤️ for the [DevCycle Feature Flag Hackathon](https://dev.to/challenges/devcycle)
