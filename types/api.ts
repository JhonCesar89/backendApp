export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CourseFilters {
  category?: string
  level?: string
  price?: "free" | "paid"
  search?: string
  instructor?: string
}
