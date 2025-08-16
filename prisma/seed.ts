import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "programming" },
      update: {},
      create: {
        name: "Programming",
        slug: "programming",
        description: "Learn programming languages and software development",
        icon: "💻",
        color: "#3B82F6",
      },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: {
        name: "Design",
        slug: "design",
        description: "UI/UX Design, Graphic Design, and Creative Skills",
        icon: "🎨",
        color: "#8B5CF6",
      },
    }),
    prisma.category.upsert({
      where: { slug: "business" },
      update: {},
      create: {
        name: "Business",
        slug: "business",
        description: "Business skills, entrepreneurship, and management",
        icon: "📊",
        color: "#10B981",
      },
    }),
  ])

  // Create test organization
  const organization = await prisma.organization.upsert({
    where: { slug: "tech-corp" },
    update: {},
    create: {
      name: "Tech Corp",
      slug: "tech-corp",
      description: "A leading technology company",
      industry: "Technology",
      size: "100-500",
    },
  })

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 12)

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Student",
      role: "STUDENT",
      profileCompleted: true,
      onboardingStep: 3,
    },
  })

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@example.com" },
    update: {},
    create: {
      email: "instructor@example.com",
      password: hashedPassword,
      firstName: "Jane",
      lastName: "Instructor",
      role: "INSTRUCTOR",
      profileCompleted: true,
      onboardingStep: 3,
    },
  })

  // Create instructor profile
  await prisma.instructorProfile.upsert({
    where: { userId: instructor.id },
    update: {},
    create: {
      userId: instructor.id,
      bio: "Experienced software developer and educator",
      expertise: ["JavaScript", "React", "Node.js"],
      isVerified: true,
      rating: 4.8,
      totalStudents: 150,
      totalCourses: 5,
    },
  })

  await prisma.user.upsert({
    where: { email: "admin@techcorp.com" },
    update: {},
    create: {
      email: "admin@techcorp.com",
      password: hashedPassword,
      firstName: "Mike",
      lastName: "Admin",
      role: "COMPANY_ADMIN",
      organizationId: organization.id,
      profileCompleted: true,
      onboardingStep: 3,
    },
  })

  // Create sample course
  const course1 = await prisma.course.create({
    data: {
      title: "Complete React Development Course",
      slug: "complete-react-development",
      description: "Learn React from basics to advanced concepts",
      shortDescription: "Master React development with hands-on projects",
      price: 0,
      isFree: true,
      isPublished: true,
      status: "PUBLISHED",
      level: "Beginner",
      duration: 1200,
      language: "en",
      tags: ["React", "JavaScript", "Frontend"],
      requirements: ["Basic HTML/CSS knowledge", "JavaScript fundamentals"],
      learningOutcomes: ["Build React applications", "Understand component lifecycle", "State management"],
      instructorId: instructor.id,
      categories: {
        create: [{ categoryId: categories[0].id }],
      },
    },
  })

  // Create lessons
  await Promise.all([
    prisma.lesson.create({
      data: {
        title: "Introduction to React",
        slug: "introduction-to-react",
        description: "Learn what React is and why it's popular",
        content: "React is a JavaScript library for building user interfaces...",
        type: "VIDEO",
        duration: 30,
        order: 1,
        isFree: true,
        isPublished: true,
        courseId: course1.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: "Setting up Development Environment",
        slug: "setting-up-development-environment",
        description: "Configure your development environment for React",
        content: "In this lesson, we'll set up Node.js, npm, and create-react-app...",
        type: "VIDEO",
        duration: 45,
        order: 2,
        isFree: true,
        isPublished: true,
        courseId: course1.id,
      },
    }),
  ])

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course1.id,
      progress: 25,
    },
  })

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
