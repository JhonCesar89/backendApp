import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"
import type { UserRole } from "@prisma/client"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/signin")
  }
  return session
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }
  return session
}

export async function requireStudent() {
  return await requireRole(["STUDENT"])
}

export async function requireInstructor() {
  return await requireRole(["INSTRUCTOR"])
}

export async function requireCompanyAdmin() {
  return await requireRole(["COMPANY_ADMIN"])
}

export async function requireAdmin() {
  return await requireRole(["SUPER_ADMIN"])
}
