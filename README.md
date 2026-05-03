# StudentApply

StudentApply is a Next.js app that demonstrates a hybrid PostgreSQL (Prisma) + MongoDB (Mongoose) architecture for dynamic program application forms.

## Quick overview

- Frontend: Next.js (App Router)
- Relational DB: PostgreSQL via Prisma
- Document DB: MongoDB via Mongoose

## Prerequisites

- Node.js 18+ (recommended)
- PostgreSQL (local or remote)
- MongoDB (local or remote)
- Git (to clone the repo)

## Install

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd student-apply
npm install
```

2. Create a local environment file: copy `.env.example` or create `.env.local` in the project root with these variables (example values below):

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/studentapply_postgres"
MONGODB_URI="mongodb://localhost:27017/studentapply_mongo"
NEXT_PUBLIC_APP_URL="http://localhost:5000"
```

Note: there is no `.env.example` in the repository — create `.env.local` using the example above.

## Database setup

PostgreSQL (Prisma):

1. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

2. Seed the database (project contains a seed script):

```bash
npm run seed
```

MongoDB (Mongoose):

- Ensure a MongoDB server is running and `MONGODB_URI` is set in `.env.local`. No migrations are required for MongoDB; collections are created on first use.

## Available scripts

- `npm run dev` — start development server (the project is configured to run on port 5000)
- `npm run build` — create production build
- `npm run start` — start built app (also configured to use port 5000)
- `npm run seed` — run the seed script (`prisma/seed.ts`)
- `npm run lint` — run ESLint

Example local dev run:

```bash
npm run dev
# open http://localhost:5000
```

## Notes about port and deployment

- The dev and start scripts currently pass `-p 5000` to Next.js, so the app runs on port 5000 locally.
- On many hosting platforms (Vercel, Render) you should not hardcode the port; either remove `-p 5000` for production or set the port from `process.env.PORT`. When deploying to Vercel, set the environment variables in the project settings.

## Troubleshooting

- If Prisma complains about engines or binary files on Windows, ensure your Node.js version matches supported Prisma versions and that `prisma generate` completed successfully.
- If the app cannot connect to PostgreSQL or MongoDB, verify the connection strings in `.env.local` and confirm the DB servers are running and accessible.
- If `npm run seed` fails, check `prisma/seed.ts` for required env values and run `npx prisma migrate dev` first.

## Useful files

- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Seed script: [prisma/seed.ts](prisma/seed.ts)
- API routes: [app/api](app/api)

## Contributing

If you'd like to contribute, open an issue or pull request. For local changes, follow the steps above to set up databases and run `npm run dev`.

---

If you want, I can also add a `.env.example` file and a short `make`/`ps1` script to bootstrap DBs and run the seed automatically — would you like that?
