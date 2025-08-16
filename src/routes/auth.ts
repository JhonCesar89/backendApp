import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import type { UserRole } from "@prisma/client"

const router = Router()

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "INSTRUCTOR", "COMPANY_ADMIN"]).default("STUDENT"),
  organizationId: z.string().optional(),
  companyName: z.string().optional(),
})

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
        instructorProfile: true,
      },
    })

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    )

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        organizationId: user.organizationId,
        profileCompleted: user.profileCompleted,
        onboardingStep: user.onboardingStep,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Register route
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create organization if company registration
    let organizationId = validatedData.organizationId
    if (validatedData.role === "COMPANY_ADMIN" && validatedData.companyName) {
      const organization = await prisma.organization.create({
        data: {
          name: validatedData.companyName,
          slug: validatedData.companyName.toLowerCase().replace(/\s+/g, "-"),
        },
      })
      organizationId = organization.id
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role as UserRole,
        organizationId,
        profileCompleted: true,
        onboardingStep: 5,
      },
    })

    // Create instructor profile if needed
    if (validatedData.role === "INSTRUCTOR") {
      await prisma.instructorProfile.create({
        data: {
          userId: user.id,
        },
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        organizationId: user.organizationId,
        profileCompleted: user.profileCompleted,
        onboardingStep: user.onboardingStep,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Verify token route
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: UserRole }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organization: true,
        instructorProfile: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        organizationId: user.organizationId,
        profileCompleted: user.profileCompleted,
        onboardingStep: user.onboardingStep,
      },
    })
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
})

export { router as authRoutes }
