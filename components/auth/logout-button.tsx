"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  showIcon?: boolean
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default",
  showIcon = true 
}: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout}>
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      Sign Out
    </Button>
  )
}
