import { Router, Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { authenticateToken } from "../middleware/auth"
import type { UserRole } from "@prisma/client" // Correct import for UserRole

const router = Router()

// Get current user profile
router.get("/profile", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        organization: true,
        instructorProfile: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                instructor: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      profileCompleted: user.profileCompleted,
      onboardingStep: user.onboardingStep,
      organization: user.organization,
      instructorProfile: user.instructorProfile,
      enrollments: user.enrollments,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update user profile
router.put("/profile", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, avatar } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        avatar,
        updatedAt: new Date(),
      },
    })

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user's enrolled courses
router.get("/enrollments", authenticateToken, async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.user!.id },
      include: {
        course: {
          include: {
            instructor: {
              select: { firstName: true, lastName: true, avatar: true },
            },
            categories: {
              include: { category: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    })

    res.json(enrollments)
  } catch (error) {
    console.error("Get enrollments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user's progress for a specific course
router.get("/courses/:courseId/progress", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.user!.id,
          courseId,
        },
      },
    })

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" })
    }

    const progress = await prisma.progress.findMany({
      where: {
        studentId: req.user!.id,
        lesson: { courseId },
      },
      include: {
        lesson: {
          select: { id: true, title: true, order: true },
        },
      },
      orderBy: { lesson: { order: "asc" } },
    })

    res.json({
      enrollment,
      progress: progress, // Explicitly type progress as an array of Progress objects
    })
  } catch (error) {
    console.error("Get course progress error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update lesson progress
router.post("/lessons/:lessonId/progress", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params
    const { completed, timeSpent } = req.body as { completed: boolean; timeSpent?: number } // Type assertion for req.body

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { courseId: true },
    })

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" })
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.user!.id,
          courseId: lesson.courseId,
        },
      },
    })

    if (!enrollment) {
      return res.status(403).json({ error: "Not enrolled in this course" })
    }

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        studentId_lessonId: {
          studentId: req.user!.id,
          lessonId,
        },
      },
      update: {
        completed,
        timeSpent: { increment: timeSpent || 0 },
        lastAccessedAt: new Date(),
        completedAt: completed ? new Date() : null,
      },
      create: {
        studentId: req.user!.id,
        lessonId,
        completed,
        timeSpent: timeSpent || 0,
        completedAt: completed ? new Date() : null,
      },
    })

    res.json(progress)
  } catch (error) {
    console.error("Update progress error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export { router as userRoutes }
