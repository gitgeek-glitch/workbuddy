import express from "express"
import {
  userSignUp,
  userSignIn,
  checkUsername,
  googleCallback,
  githubCallback,
} from "../controllers/user.controller.js"
import { rateLimiter } from "../middlewares/rate.middleware.js"
import passport from "passport"

const router = express.Router()

// Check username availability
router.get("/check-username", checkUsername)

// Apply rate limit to registration route
router.post("/signup", rateLimiter, userSignUp)

// Login route
router.post("/signin", userSignIn)

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", googleCallback)

// GitHub OAuth routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))
router.get("/github/callback", githubCallback)

export default router

