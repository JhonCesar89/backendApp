import { Router, Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Get all courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        instructor: {
          select: { firstName: true, lastName: true, avatar: true },
        },
        categories: {
          include: { category: true },
        },
      },
    })
    res.json(courses)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" })
  }
})

// Get course by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        instructor: {
          select: { firstName: true, lastName: true, avatar: true, instructorProfile: true },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
        },
        categories: {
          include: { category: true },
        },
      },
    })

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    res.json(course)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" })
  }
})

// Enroll in course (protected route)
router.post("/:courseId/enroll", authenticateToken, async (req: Request, res: Response) => {
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.user!.id,
        courseId: req.params.courseId,
      },
    })
    res.json(enrollment)
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll in course" })
  }
})

export { router as courseRoutes }
