"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { Course } from "@/types/course"

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true)
        const data = await apiClient.getCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return { courses, loading, error }
}
