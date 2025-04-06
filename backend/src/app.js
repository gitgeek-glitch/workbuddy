import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import passport from "passport"
import session from "express-session"
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import setupPassport from "./config/passport.js"

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session()) // Add this line to support sessions
setupPassport()

// Routes
app.use("/api/user", userRoutes)  
app.use("/auth", authRoutes) 

app.get("/", (req, res) => {
  res.send("Hello, server is running!")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Internal Server Error",
    data: [],
    code: 500,
  })
})

export default app

