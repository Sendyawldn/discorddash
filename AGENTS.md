# AGENTS.md — DiscordDash

Dokumen ini adalah acuan utama (single source of truth) bagi agent/AI coding assistant yang mengerjakan proyek **DiscordDash**.

**Peran Agent:** Senior Full Stack Developer (Next.js 15 + Discord API Expert).

---

## 1. Ringkasan Proyek

DiscordDash adalah platform dashboard berbasis web untuk memvisualisasikan statistik server Discord secara real-time: aktivitas member, channel paling ramai, pertumbuhan server, dan top user berdasarkan jumlah pesan.

### Peran Pengguna (hanya 2)

| Role | Akses |
|------|-------|
| **Server Owner / Admin** | Menghubungkan server Discord, melihat seluruh statistik, mengelola konfigurasi bot, mengakses laporan lengkap |
| **Viewer (Member dengan akses)** | Melihat statistik publik yang diizinkan Admin (leaderboard, grafik pertumbuhan) |

---

## 2. Struktur Proyek

Monorepo dengan pemisahan concerns yang jelas. Agent harus bekerja di dalam struktur ini, jangan membuat folder root baru tanpa alasan kuat.

```
discorddash/
├── discorddash-bot/      # Discord Bot (Node.js + discord.js) — Data Collector
└── discorddash-web/      # Frontend + Backend (Next.js 15 + Tailwind)
```

---

## 3. Tech Stack (wajib diikuti, jangan ganti versi major tanpa persetujuan)

### Bot / Data Collector (`discorddash-bot/`)
- Runtime: **Node.js 22 LTS**
- Library: **discord.js v14**
- Fungsi: mendengarkan event Discord (pesan, join, leave) dan menyimpan ke database.

### Backend (`discorddash-web/` — API Routes)
- Framework: **Next.js 15 API Routes (App Router)** — backend terintegrasi di frontend
- Database: **PostgreSQL** (via Supabase)
- ORM: **Prisma ORM v6**
- Auth: **NextAuth.js v5** dengan Discord OAuth2 Provider

### Frontend (`discorddash-web/`)
- Framework: **Next.js 15 (App Router)**
- Styling: **Tailwind CSS v4.0**
- UI Components: **Shadcn UI** + **Lucide React**
- Charts: **Recharts**

### Tooling
- Environment: Node.js lokal + `.env` untuk secrets
- Testing API: Postman / Thunder Client
- Deployment: **Vercel** (frontend + API) + **Railway** (bot, 24/7)

---

## 4. Konvensi Kode untuk Agent

- Gunakan App Router Next.js 15 (`app/`), bukan Pages Router.
- Semua akses database melalui **Prisma Client**, jangan raw SQL kecuali tidak ada alternatif.
- Komponen UI baru gunakan pola **Shadcn UI** (composable, di `components/ui/`).
- Jangan menyimpan isi pesan Discord — hanya metadata (lihat bagian Data Privacy).
- Gunakan caching (Prisma/Redis) untuk query statistik berat agar tidak melanggar rate limit Discord API.
- Ikuti skema Prisma yang sudah ditentukan di bagian 6 kecuali ada instruksi eksplisit untuk mengubahnya.

---

## 5. Fitur Utama Dashboard

### 📊 Statistik Member
- Total member server saat ini
- Grafik pertumbuhan member harian & mingguan
- Jumlah member join vs leave per periode

### 💬 Aktivitas Channel
- Ranking channel paling ramai berdasarkan jumlah pesan
- Heatmap aktivitas per jam dalam sehari
- Statistik pesan per hari/minggu/bulan

### 🏆 Leaderboard User
- Top 10 user paling aktif berdasarkan jumlah pesan
- Riwayat aktivitas per user (opsional)

### 📈 Server Overview
- Jumlah channel, role, dan kategori
- Online member real-time (via Discord Presence)
- Ringkasan aktivitas 7 hari terakhir

---

## 6. Database Schema (Core Entities)

```prisma
model Server {
  id         String    @id           // Discord Guild ID
  name       String
  iconUrl    String?
  ownerId    String
  members    Member[]
  messages   Message[]
  createdAt  DateTime  @default(now())
}

model Member {
  id         String    @id           // Discord User ID
  username   String
  joinedAt   DateTime
  leftAt     DateTime?
  serverId   String
  server     Server    @relation(fields: [serverId], references: [id])
  messages   Message[]
}

model Message {
  id          String    @id          // Discord Message ID
  channelId   String
  channelName String
  authorId    String
  serverId    String
  createdAt   DateTime
  server      Server    @relation(fields: [serverId], references: [id])
  author      Member    @relation(fields: [authorId], references: [id])
}
```

---

## 7. Environment Variables

Agent tidak boleh menuliskan nilai rahasia ke kode — hanya menggunakan nama variabel berikut:

```env
# Discord Bot & OAuth
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## 8. Workflow Operasional

**Bot Discord (Data Collector)**
Berjalan 24/7 di Railway, mendengarkan event `messageCreate`, `guildMemberAdd`, `guildMemberRemove`, menyimpan data mentah ke PostgreSQL.

**Dashboard Next.js**
Frontend mengambil data dari API Routes Next.js yang terhubung ke database via Prisma, divisualisasikan dengan Recharts.

**Autentikasi**
Login via akun Discord (OAuth2). Hanya Server Owner/Admin yang dapat mengakses dashboard penuh setelah menginvite bot ke server mereka.

**Real-time Update**
Dashboard auto-refresh setiap 60 detik (polling), opsional WebSocket via Supabase Realtime.

### Alur Penggunaan (User Flow)
```
1. User buka discorddash.vercel.app
2. Klik "Login with Discord" → redirect ke Discord OAuth2
3. Setelah login, user klik "Add Bot to Server"
4. Bot masuk ke server, mulai mengumpulkan data
5. User diarahkan ke dashboard → melihat statistik server mereka
6. Dashboard auto-refresh setiap 60 detik
```

---

## 9. Timeline Pengembangan

| Minggu | Target |
|--------|--------|
| 1 | Setup project, install dependencies, konfigurasi Discord Developer Portal (Bot + OAuth2) |
| 2 | Setup database PostgreSQL (Supabase) + Prisma schema + migrasi |
| 3 | Coding Discord Bot: event listener `messageCreate`, `guildMemberAdd`, `guildMemberRemove` |
| 4 | Coding Auth: NextAuth.js dengan Discord OAuth2, halaman login |
| 5 | Coding API Routes: endpoint statistik member, channel, leaderboard |
| 6 | Coding Frontend: halaman dashboard, integrasi Recharts, komponen Shadcn UI |
| 7 | Testing end-to-end, perbaikan bug, optimasi performa query |
| 8 | Deployment ke Vercel (web) + Railway (bot), dokumentasi final |

---

## 10. Catatan Khusus & Batasan Penting untuk Agent

- **Bot Permission yang dibutuhkan:** `Read Messages`, `Read Message History`, `View Guild Members` (Privileged Intent — harus diaktifkan di Discord Developer Portal).
- **Privileged Intents:** Aktifkan `SERVER MEMBERS INTENT` dan `MESSAGE CONTENT INTENT` di portal Discord Developer.
- **Data Privacy (WAJIB DIPATUHI):** Jangan pernah menyimpan isi pesan (message content) ke database — hanya metadata (siapa, kapan, di channel mana). Agent harus menolak/memperingatkan jika ada instruksi yang bertentangan dengan aturan ini.
- **Rate Limit Discord API:** Gunakan caching di Prisma/Redis untuk menghindari hit rate limit saat query statistik besar.
- **Bot harus selalu online** — gunakan Railway atau Fly.io untuk hosting bot.

---

## 11. Perintah Umum (isi sesuai setup aktual repo)

> Agent: perbarui bagian ini begitu `package.json` / scripts sudah dibuat, agar perintah berikut akurat.

```bash
# discorddash-web/
npm install
npm run dev
npm run build
npx prisma migrate dev
npx prisma studio

# discorddash-bot/
npm install
npm run dev
npm run build
npm run start
```
