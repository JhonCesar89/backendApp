"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserProfile() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const { user } = session
  const initials = user.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || "U"

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "bg-blue-100 text-blue-800"
      case "INSTRUCTOR":
        return "bg-green-100 text-green-800"
      case "COMPANY_ADMIN":
        return "bg-purple-100 text-purple-800"
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <Badge className={getRoleBadgeColor(user.role)}>
              {user.role.replace("_", " ")}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Profile Completed:</span>
            <span>{user.profileCompleted ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Onboarding Step:</span>
            <span>{user.onboardingStep}/5</span>
          </div>
          {user.organizationId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Organization:</span>
              <span>Connected</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
