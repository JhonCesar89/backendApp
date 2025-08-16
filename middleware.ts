import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isOnboarding = req.nextUrl.pathname.startsWith("/onboarding")

    if (isAuthPage) {
      if (isAuth) {
        // Redirect authenticated users away from auth pages
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (isDashboard && !isAuth) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (isDashboard && isAuth) {
      // Role-based dashboard access
      const userRole = token?.role
      const path = req.nextUrl.pathname

      if (path.startsWith("/dashboard/student") && userRole !== "STUDENT") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      if (path.startsWith("/dashboard/company") && userRole !== "COMPANY_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      if (path.startsWith("/dashboard/instructor") && userRole !== "INSTRUCTOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true
        }
        // For dashboard pages, require token
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        // Allow all other pages
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/onboarding/:path*"],
}
