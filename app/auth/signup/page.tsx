"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to onboarding for registration
    router.push("/onboarding")
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <p>Redirecting to registration...</p>
      </div>
    </div>
  )
}
