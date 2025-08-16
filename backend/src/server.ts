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
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/users", userRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`)
})
