"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { GraduationCap, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginModal } from "@/components/landing/login-modal"
// Removed 'type' keyword as Session is not directly used as a standalone type in this component
// import type { Session } from "next-auth" 

interface NavigationBarProps {
  transparent?: boolean
}

export function NavigationBar({ transparent = false }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const user = session?.user || null;

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleLogin = () => {
    setShowLoginModal(true)
  }

  const handleSignup = () => {
    router.push("/onboarding")
  }

  const handleLoginSuccess = (email: string) => {
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav
        className={`${
          transparent
            ? "bg-transparent border-none"
            : "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        } px-4 py-6`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EduPlatform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/courses-public"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Courses
            </a>
            <a
              href="/free-courses"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Free Courses
            </a>
            <a
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About Us
            </a>
          </div>

          {/* Right side - Theme toggle and user menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
                      <AvatarFallback>
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" onClick={handleLogin}>
                  Log in
                </Button>
                <Button onClick={handleSignup}>Sign up</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2 pt-4">
              <a
                href="/courses-public"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Courses
              </a>
              <a
                href="/free-courses"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Free Courses
              </a>
              <a
                href="/about"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                About Us
              </a>

              {status === "loading" ? (
                <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md px-4 py-2" />
              ) : !user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" onClick={handleLogin} className="justify-start">
                    Log in
                  </Button>
                  <Button onClick={handleSignup} className="justify-start">
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
