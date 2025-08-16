import type { User, RegisterData, LoginData, AuthResponse } from "@/types/user"
import type { Course } from "@/types/course"
import type { Enrollment, EnrollmentWithCourse } from "@/types/enrollment"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: RegisterData) {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async verifyToken() {
    return this.request<{ user: User }>("/auth/verify")
  }

  // Course methods
  async getCourses() {
    return this.request<Course[]>("/courses")
  }

  async getCourse(slug: string) {
    return this.request<Course>(`/courses/${slug}`)
  }

  async enrollInCourse(courseId: string) {
    return this.request<Enrollment>(`/courses/${courseId}/enroll`, {
      method: "POST",
    })
  }

  // User methods
  async getUserProfile() {
    return this.request<User>("/users/profile")
  }

  async updateUserProfile(data: Partial<User>) {
    return this.request<User>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getUserEnrollments() {
    return this.request<EnrollmentWithCourse[]>("/users/enrollments")
  }

  async getCourseProgress(courseId: string) {
    return this.request<{
      enrollment: Enrollment
      progress: any[]
    }>(`/users/courses/${courseId}/progress`)
  }

  async updateLessonProgress(lessonId: string, data: { completed: boolean; timeSpent?: number }) {
    return this.request<any>(`/users/lessons/${lessonId}/progress`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
