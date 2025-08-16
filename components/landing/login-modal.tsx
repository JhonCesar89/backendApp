"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "./login-form" // Updated import

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (email: string) => void // Simplified callback
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const handleLoginSuccessInternal = (email: string) => {
    onLoginSuccess(email)
    onClose() // Close modal on successful login
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <LoginForm onClose={onClose} onLoginSuccess={handleLoginSuccessInternal} />
      </DialogContent>
    </Dialog>
  )
}
