import type { UserRole } from "@prisma/client"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  organizationId?: string
  profileCompleted: boolean
  onboardingStep: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
  companyName?: string
  organizationId?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
