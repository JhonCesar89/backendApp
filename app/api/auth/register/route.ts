import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import type { UserRole } from "@prisma/client"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "INSTRUCTOR", "COMPANY_ADMIN"]).default("STUDENT"),
  organizationId: z.string().optional(),
  companyName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
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

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
