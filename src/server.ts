import express from "express"
import cors from "cors"
import helmet from "helmet"
import { authRoutes } from "./routes/auth"
import { courseRoutes } from "./routes/courses"
import { userRoutes } from "./routes/users"

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/users", userRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`🚀 EduPlatform Backend API running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})
