# Database Context

## Stack

- Database: PostgreSQL
- Hosting: Supabase
- ORM / Migrations: Prisma
- Application schema: `public`

## Core Tables

### Profile

Stores user information.

- `id` (TEXT, PK)
- `email` (TEXT, UNIQUE, NOT NULL)
- `username` (TEXT, UNIQUE, nullable)
- `createdAt` (TIMESTAMP)

### Game

Stores game sessions.

- `id` (TEXT, PK)
- `roomCode` (TEXT, UNIQUE)
- `mode` (ENUM)
- `boardSize` (INTEGER, default: 3)
- `status` (ENUM, default: waiting)
- `createdAt` (TIMESTAMP)
- `tieBreaker` (INTEGER, default: 3)
- `currentTurn` (ENUM)

### GamePlayer

Maps users to games.

- `id` (TEXT, PK)
- `gameId` (TEXT, FK → Game.id)
- `userId` (TEXT, nullable, FK → Profile.id)
- `joinedAt` (TIMESTAMP)
- `symbol` (ENUM)
- `score` (INTEGER, default: 0)
- Unique constraint: `(gameId, userId)`

### Move

Stores individual game moves.

- `id` (TEXT, PK)
- `gameId` (TEXT, FK → Game.id)
- `userId` (TEXT, nullable, no FK)
- `moveNo` (INTEGER)
- `createdAt` (TIMESTAMP)
- `cell` (INTEGER)
- `symbol` (ENUM, nullable)

## Relationships

- Profile 1:N GamePlayer
- Game 1:N GamePlayer
- Game 1:N Move

## Important Constraints

- Game room codes must be unique.
- Profile emails and usernames must be unique.
- A user can have only one GamePlayer record per game.
- `GamePlayer.userId` and `Move.userId` are nullable.
- `Move.userId` has no foreign-key constraint.

## Security

- RLS is disabled on Profile, Game, GamePlayer, and Move.
- Apply appropriate RLS policies before exposing these tables through Supabase client APIs.
- Never expose the Supabase service-role key to the frontend.

## Development Guidelines

- Preserve existing table and column names.
- Use Prisma migrations for schema changes.
- Maintain foreign-key and unique constraints.
- Validate game membership, turns, and move legality server-side.
- Do not assume columns, tables, enums, or relationships that are not documented here.
- Check the actual database schema before introducing new dependencies or changing existing structures.

## Scope

This schema represents a multiplayer Tic-Tac-Toe application.
It may not represent other projects or Supabase environments.
