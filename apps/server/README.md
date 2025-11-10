# Server (NestJS Backend)

This is the NestJS backend for Campus Companion.

## Setup

1. Install dependencies (from root):
   ```bash
   pnpm install
   ```

2. Set up environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/campus_companion?schema=public"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   ```

3. Generate Prisma Client:
   ```bash
   pnpm db:generate
   ```

4. Run migrations:
   ```bash
   pnpm db:migrate
   ```

5. Seed database (optional):
   ```bash
   pnpm db:seed
   ```

6. Start development server:
   ```bash
   pnpm dev
   ```

The server will run on http://localhost:3001

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── communities/   # Community management
├── events/         # Event management
├── buddy/          # Buddy matching system
├── tips/           # Tips management
└── prisma/         # Prisma service and module
```

## Modules

- **AuthModule**: Handles signup, login, and JWT authentication
- **UsersModule**: User profile management
- **CommunitiesModule**: Community CRUD and membership
- **EventsModule**: Event management and RSVPs
- **BuddyModule**: Buddy matching algorithm and meetings
- **TipsModule**: Tips for international students

## Database

Uses Prisma ORM with PostgreSQL. Schema is defined in `prisma/schema.prisma`.

## Testing

```bash
pnpm test
```

