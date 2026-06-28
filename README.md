# 🎮 TicTacToe Arena

> The Chess.com of Tic-Tac-Toe.

> Not Your Regular Tic-Tac-Toe | More of a Puzzle

TicTacToe Arena transforms the classic game into a deep strategic battle where every move has long-term consequences.

Unlike traditional Tic-Tac-Toe, matches never end in draws. When the board fills up, the oldest moves disappear and the game continues. Players must constantly evaluate not only the current board state, but also future board states that emerge as older moves are removed.

A winning move is often decided several turns in advance.

Can you predict which cells will become available?

Can you trap your opponent before your own winning line disappears?

Can you build a future victory while defending the present?

Welcome to **Endless Tic-Tac-Toe**.

---

## Live Demos

🚀 TicTacToe Arena (Current Version)
https://tictactoe-arena-classic.vercel.app

🎮 Classic TicTacToe (Legacy Version)
https://synakr.github.io/EndlessTicTacToe/

📦 Legacy Source Code
See the `classic-version` branch.

---

## ♟️ Why It's Different

Traditional Tic-Tac-Toe is a solved game.

With perfect play, every match ends in a draw.

TicTacToe Arena introduces an **Endless Mode** powered by a unique **Tie Breaker System**.

When the board becomes full:

1. The oldest **N** moves are removed
2. Empty cells reappear
3. The game continues

This creates a constantly evolving board where:

- Old threats disappear
- New opportunities emerge
- Winning positions can collapse
- Future board states matter as much as the current one

The result is a game that feels closer to Chess than Tic-Tac-Toe.

Players must think multiple turns ahead and account for pieces that may disappear before a strategy is completed.

---

## 🎛️ Customizable Rules

Every room can have its own ruleset.

Players can customize:

- Board Size
- Win Condition
- Tie Breaker Value

Examples:

### Classic

```txt
Board Size: 3×3
Win Condition: 3
Tie Breaker: 3
```

### Extended Arena

```txt
Board Size: 5×5
Win Condition: 4
Tie Breaker: 4
```

### Chaos Mode

```txt
Board Size: 7×7
Win Condition: 5
Tie Breaker: 2
```

Every configuration creates a completely different strategic experience.

A larger board rewards long-term planning.

A smaller tie breaker makes the board evolve rapidly.

A larger tie breaker creates slower, more deliberate games.

Instead of a single game, TicTacToe Arena is a platform for experimenting with countless variants of Tic-Tac-Toe.

---

## 🧠 Strategic Depth

Every move exists on a timer.

Suppose:

```txt
Board Size = 3
Tie Breaker = 3
```

Once the board becomes full:

```txt
X O X
O X O
O X O
```

The oldest 3 moves are removed:

```txt
_ _ _
O X O
O X O
```

The game continues.

This means players must constantly consider:

- Which cells will disappear next?
- Which opponent threats will vanish naturally?
- Which of my own winning lines are about to break?
- Should I defend now or prepare for the future board state?

A move that looks bad now may become the winning move three turns later.

A move that looks winning now may disappear before it can be completed.

This transforms Tic-Tac-Toe from a simple reaction game into a battle of planning, prediction, and timing.

---

## ✨ Features

### 🔐 Authentication

- User registration and login using Supabase Auth
- Secure session management
- Persistent player profiles

### 🎲 Multiplayer Rooms

- Create private game rooms
- Join using room codes
- Real-time multiplayer gameplay
- Instant synchronization between players

### ⚡ Real-Time Gameplay

Powered by Supabase Realtime.

- Instant move updates
- Live turn synchronization
- Live restart synchronization
- No page refresh required

### ♾️ Endless & Customizable Gameplay

- Adjustable board sizes
- Adjustable win conditions
- Adjustable tie breaker values
- Multiple play styles
- Endless matches
- No permanent draws

### 🏆 Persistent Score Tracking

- Scores persist across rounds
- Automatic winner detection
- Live scoreboard updates
- Username-based player display

Example:

```txt
*Sayan (X) : 5 | Admin (O) : 3
```

`*` indicates the current player.

### 🔄 Quick Restart

- Instant board reset
- Scores preserved between rounds
- Real-time restart notifications
- X always starts a new round

### 📱 Responsive Design

- Mobile-first experience
- Responsive game board
- Adaptive layouts
- Smooth animations
- Modern landing page

---

## 🎮 Gameplay Rules

### Standard Turn Order

```txt
X → O → X → O ...
```

### Winning

Create a line matching the configured win condition.

Examples:

```txt
Board Size = 3
Win Condition = 3
```

Three in a row wins.

Or:

```txt
Board Size = 5
Win Condition = 4
```

Four in a row wins.

### Endless Mode

When the board fills:

```txt
Oldest N moves removed
```

Where:

```txt
N = Tie Breaker Value
```

The game continues until a winner emerges.

No draws.

No dead boards.

No stalemates.

---

## 🛠️ Tech Stack

### Frontend

- SvelteKit
- TypeScript
- Tailwind CSS

### Backend

- SvelteKit API Routes
- Prisma ORM

### Database

- PostgreSQL
- Supabase Database

### Authentication

- Supabase Auth

### Realtime

- Supabase Realtime Channels

### Deployment

- Vercel (Planned)

---

## 📂 Project Structure

```txt
src/
├── lib/
│   ├── prisma.server.ts
│   ├── supabase.client.ts
│   └── auth/
│
├── routes/
│   ├── api/
│   │   ├── game/
│   │   ├── auth/
│   │   └── room/
│   │
│   ├── dashboard/
│   ├── game/
│   ├── login/
│   ├── signup/
│   └── +page.svelte
│
prisma/
└── schema.prisma
```

---

## 🚀 Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/synakr/TicTacToe-Arena.git
cd TicTacToe-Arena
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
DIRECT_URL=

PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Push Schema

```bash
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

---

## 📸 Screenshots

Add screenshots after deployment.

```md
![Landing Page](screenshots/landing.png)

![Game Room](screenshots/game.png)

![Multiplayer Match](screenshots/multiplayer.png)
```

---

## 🗺️ Roadmap

### Near Future

- [ ] Match History
- [ ] Player Statistics
- [ ] Public Matchmaking
- [ ] Spectator Mode
- [ ] Game Invitations
- [ ] Sound Effects
- [ ] Animated Move History

### Long Term

- [ ] Global Leaderboards
- [ ] Elo Rating System
- [ ] Ranked Seasons
- [ ] Tournament Support
- [ ] AI Opponent
- [ ] Mobile App

---

## 🚀 Vision

TicTacToe Arena aims to become the Chess.com of Tic-Tac-Toe.

Not just another Tic-Tac-Toe clone.

A platform where:

- Every room can have its own rules
- Endless matches replace draws
- Strategy matters more than memorization
- Players can develop unique playstyles
- Competitive communities can emerge around different game variants

A platform where players can:

- Compete endlessly
- Develop advanced strategies
- Track performance
- Climb rankings
- Challenge friends in real time

Simple to learn.

Difficult to master.

Impossible to solve.

---

## 👨‍💻 Author

**Sayan**

Built with ❤️ using SvelteKit, Supabase, Prisma, PostgreSQL, and a lot of late-night debugging.

### GitHub

https://github.com/synakr/EndlessTicTacToe

```
Originally developed as a classic frontend Tic-Tac-Toe game initially,
later this project evolved into TicTacToe Arena:
a multiplayer, customizable, endless strategy version
that rewards long-term planning rather than short-term tactics.
```
