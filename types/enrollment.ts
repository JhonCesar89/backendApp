export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  status: "ACTIVE" | "COMPLETED" | "DROPPED" | "SUSPENDED"
  progress: number
  completedAt?: Date
  enrolledAt: Date
  updatedAt: Date
}

export interface Progress {
  id: string
  studentId: string
  lessonId: string
  completed: boolean
  timeSpent: number
  lastAccessedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface EnrollmentWithCourse extends Enrollment {
  course: {
    id: string
    title: string
    thumbnail?: string
    instructor: {
      firstName: string
      lastName: string
    }
  }
}
