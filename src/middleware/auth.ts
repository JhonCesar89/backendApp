import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import type { UserRole } from "@prisma/client"

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: UserRole
      }
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: UserRole }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" })
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    next()
  }
}

export const requireStudent = requireRole(["STUDENT"])
export const requireInstructor = requireRole(["INSTRUCTOR"])
export const requireCompanyAdmin = requireRole(["COMPANY_ADMIN"])
export const requireAdmin = requireRole(["SUPER_ADMIN"])
