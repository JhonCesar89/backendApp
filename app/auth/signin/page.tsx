"use client"

import { LoginForm } from "@/components/landing/login-form"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect authenticated users based on their role
      if (session.user.role === "COMPANY_ADMIN") {
        router.push("/dashboard/company")
      } else if (session.user.role === "INSTRUCTOR") {
        router.push("/dashboard/instructor")
      } else {
        router.push("/dashboard/student")
      }
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <LoginForm onBackToRegister={() => router.push("/onboarding")} />
        </CardContent>
      </Card>
    </div>
  )
}
