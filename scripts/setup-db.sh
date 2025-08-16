#!/bin/bash

echo "🚀 Setting up EduPlatform Database..."

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo "📊 Pushing schema to database..."
npm run db:push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Database setup complete!"
echo "🎉 You can now access:"
echo "   - Database: postgresql://eduplatform_user:eduplatform_password@localhost:5432/eduplatform"
echo "   - pgAdmin: http://localhost:5050 (admin@eduplatform.com / admin123)"
echo "   - Prisma Studio: npm run db:studio"
