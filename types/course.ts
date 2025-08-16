export interface Course {
  id: string
  title: string
  description: string
  instructor: {
    id: string
    name: string
    avatar?: string
    bio?: string
  }
  thumbnail: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  totalLessons: number
  price: number
  rating: number
  studentsCount: number
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  duration: number
  order: number
  isCompleted: boolean
  resources: Resource[]
}

export interface Resource {
  id: string
  title: string
  type: "pdf" | "video" | "link" | "document"
  url: string
}

export interface Assignment {
  id: string
  courseId: string
  lessonId?: string
  title: string
  description: string
  dueDate: Date
  maxPoints: number
  submissionType: "file" | "text" | "link"
  isSubmitted: boolean
  grade?: number
}

export interface Quiz {
  id: string
  courseId: string
  lessonId?: string
  title: string
  description: string
  questions: Question[]
  timeLimit?: number
  attempts: number
  passingScore: number
}

export interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  points: number
}
