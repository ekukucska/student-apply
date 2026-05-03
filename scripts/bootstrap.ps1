Write-Host "Running Prisma generate..."
npx prisma generate

Write-Host "Applying Prisma migrations (interactive)..."
npx prisma migrate dev

Write-Host "Seeding database..."
npm run seed

Write-Host "Bootstrap complete. Start dev server: npm run dev"