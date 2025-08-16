import type { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      organizationId?: string
      profileCompleted: boolean
      onboardingStep: number
    }
  }

  interface User {
    role: UserRole
    organizationId?: string
    profileCompleted: boolean
    onboardingStep: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    organizationId?: string
    profileCompleted: boolean
    onboardingStep: number
  }
}
