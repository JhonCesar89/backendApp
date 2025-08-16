# EduPlatform Backend API

Backend API for the EduPlatform educational system built with Express.js, TypeScript, and Prisma.

## 🚀 Features

- **Authentication**: JWT-based auth with role-based access control
- **User Management**: Students, Instructors, Company Admins
- **Course Management**: CRUD operations for courses and lessons
- **Progress Tracking**: Student progress and enrollment management
- **Organization Support**: Multi-tenant architecture for companies
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🔧 Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd eduplatform-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure your `.env` file with your database URL and JWT secret.

5. Generate Prisma client:
\`\`\`bash
npm run db:generate
\`\`\`

6. Run database migrations:
\`\`\`bash
npm run db:migrate
\`\`\`

7. Seed the database:
\`\`\`bash
npm run db:seed
\`\`\`

## 🚀 Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/enrollments` - Get user enrollments
- `GET /api/users/courses/:courseId/progress` - Get course progress
- `POST /api/users/lessons/:lessonId/progress` - Update lesson progress

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:slug` - Get course by slug
- `POST /api/courses/:courseId/enroll` - Enroll in course

### Health Check
- `GET /health` - API health status

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## 🏗️ Project Structure

\`\`\`
src/
├── routes/          # API route handlers
├── middleware/      # Authentication & authorization
├── lib/            # Database connection & utilities
├── types/          # TypeScript type definitions
└── server.ts       # Main application entry point
\`\`\`

## 🚀 Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically deploy on git push

### Manual Deployment

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## 📝 Environment Variables

\`\`\`env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-jwt-secret"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3001
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests (when implemented)
npm test

# Check API health
curl http://localhost:3001/health
\`\`\`

## 📖 Database Schema

The database includes the following main entities:
- Users (Students, Instructors, Admins)
- Organizations
- Courses & Lessons
- Enrollments & Progress
- Categories
- Subscriptions & Payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
