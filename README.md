<div align="center">
  
  # 🚀 DiscordDash
  **Real-Time Analytics & Insights for your Discord Server**

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord" alt="Discord.js" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </p>

  <br />
  <img src="./docs/image.png" alt="DiscordDash Overview Dashboard" width="800" style="border-radius: 12px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);" />

</div>

---

## 🌟 About DiscordDash

DiscordDash is a modern, privacy-first web dashboard that visualizes your Discord server's activity in real-time. Built with a powerful **Next.js 15 App Router** frontend and a relentless **Node.js 22** background worker bot, DiscordDash turns raw community chatter into beautiful, actionable insights.

> **Privacy First**: DiscordDash strictly collects _metadata_ (who, when, where) and never stores actual message content.

## ✨ Features

- **📊 Member Growth Tracking**: Visualize daily joins and leaves with stunning area charts.
- **💬 Channel Heatmaps**: Instantly discover your server's peak activity hours.
- **🏆 User Leaderboards**: Gamify your community by highlighting the top 10 most active members.
- **🔒 Secure Authentication**: NextAuth v5 integration ensures only Server Admins/Owners can view sensitive analytics via Discord OAuth2.

## 🏗️ Monorepo Architecture

```text
discorddash/
├── discorddash-bot/      # The 24/7 Data Collector (Node.js + discord.js)
└── discorddash-web/      # The Analytics Dashboard (Next.js 15 + Tailwind + Recharts)
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 22+
- PostgreSQL Database (e.g., Supabase, Neon)
- Discord Developer Portal App (Bot Token & OAuth2 Credentials)

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Discord Credentials
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Database
DATABASE_URL=postgresql://user:password@host:port/db

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Initialization

```bash
cd discorddash-web
npx prisma db push
# or npx prisma migrate dev
```

### 4. Running Locally

Run the bot (Data Collector):

```bash
cd discorddash-bot
npm install
npm run dev
```

Run the Web Dashboard:

```bash
cd discorddash-web
npm install
npm run dev
```

Visit `http://localhost:3000/login` to sign in and view your dashboard!

---

<div align="center">
  <i>Built with ❤️ using the Agentic IDE.</i>
</div>
