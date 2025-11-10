# Campus Companion

An app that helps international students find micro communities, join events, and get paired with buddies or mentors.

## Tech Stack

- **Language**: TypeScript everywhere
- **Frontend**: Next.js 14 with App Router + React 18
- **Styling**: Tailwind CSS
- **Backend**: NestJS with REST controllers
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT-based authentication with secure password hashing
- **Package Manager**: pnpm
- **Testing**: Jest
- **Linting/Formatting**: ESLint + Prettier

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js frontend
│   └── server/       # NestJS backend
├── packages/
│   └── api-types/    # Shared TypeScript types
└── infra/
    ├── docker/       # Docker configurations
    └── github/       # GitHub Actions workflows
```

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 15+
- Docker and Docker Compose (optional, for containerized development)

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file at the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/campus_companion?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
SERVER_PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed
```

The seed script creates:
- Sample users (student, buddy, staff)
- Sample communities and events
- Sample tips

Default credentials:
- Student: `student@example.com` / `password123`
- Buddy: `buddy@example.com` / `password123`
- Staff: `staff@example.com` / `password123`

### 4. Start Development Servers

```bash
# Start both web and server
pnpm dev

# Or start individually
pnpm dev:web    # http://localhost:3000
pnpm dev:server # http://localhost:3001
```

## Docker Setup

To run everything with Docker:

```bash
docker-compose up
```

This will start:
- PostgreSQL on port 5432
- Server on port 3001
- Web on port 3000

Note: You'll still need to run migrations manually:

```bash
# Inside the server container or locally
pnpm db:migrate
pnpm db:seed
```

## Available Scripts

- `pnpm dev` - Start both web and server in development mode
- `pnpm dev:web` - Start only the web app
- `pnpm dev:server` - Start only the server
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all code
- `pnpm test` - Run all tests
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database

## API Endpoints

### Auth
- `POST /auth/signup` - Create a new account
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (protected)

### Users
- `GET /users/me` - Get current user profile (protected)
- `PUT /users/me` - Update profile (protected)
- `PUT /users/me/interests` - Update interests (protected)
- `PUT /users/me/availability` - Update availability (protected)

### Communities
- `GET /communities?campus=x` - List communities
- `GET /communities/:id` - Get community details
- `POST /communities` - Create community (protected)
- `POST /communities/:id/join` - Join community (protected)
- `POST /communities/:id/leave` - Leave community (protected)

### Events
- `GET /communities/:id/events` - List events for a community
- `GET /events/:id` - Get event details
- `POST /communities/:id/events` - Create event (protected)
- `POST /events/:id/rsvp` - RSVP to event (protected)

### Buddy
- `POST /buddy/optin` - Opt into buddy system (protected)
- `POST /buddy/optout` - Opt out (protected)
- `GET /buddy/match` - Get current match (protected)
- `POST /buddy/match/:id/meeting` - Create meeting (protected)
- `POST /buddy/meeting/:id/status` - Update meeting status (protected)
- `POST /buddy/admin/match?campus=x` - Run matching algorithm (admin)

### Tips
- `GET /tips?campus=x&category=y` - List tips
- `GET /tips/:id` - Get tip details
- `POST /tips` - Create tip (protected)
- `PUT /tips/:id` - Update tip (staff only)

## Testing

Run tests:

```bash
pnpm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

MIT
