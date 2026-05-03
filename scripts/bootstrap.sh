#!/usr/bin/env bash
set -e
echo "Running Prisma generate..."
npx prisma generate

echo "Applying Prisma migrations..."
npx prisma migrate dev --name init

echo "Seeding database..."
npm run seed

echo "Bootstrap complete. Start dev server: npm run dev"