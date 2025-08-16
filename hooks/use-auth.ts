"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { UserRole } from "@prisma/client"

export function useAuth(requireAuth = false) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [requireAuth, status, router])

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  }
}

export function useRequireAuth() {
  return useAuth(true)
}

export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, isLoading, isAuthenticated } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router])

  return { user, isLoading, isAuthenticated }
}

export function useRequireStudent() {
  return useRequireRole(["STUDENT"])
}

export function useRequireInstructor() {
  return useRequireRole(["INSTRUCTOR"])
}

export function useRequireCompanyAdmin() {
  return useRequireRole(["COMPANY_ADMIN"])
}
