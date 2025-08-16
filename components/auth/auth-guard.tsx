"use client"

import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from 'lucide-react'
import type { UserRole } from "@prisma/client"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: UserRole[]
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  allowedRoles,
  fallback 
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth(requireAuth)

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null // Will redirect via useAuth hook
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
