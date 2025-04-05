import express from "express"
import { authenticateJWT } from "../middlewares/auth.middleware.js"
import passport from "passport"
import { googleCallback, githubCallback } from "../controllers/user.controller.js"

const router = express.Router()

// Get current user info
router.get("/me", authenticateJWT, (req, res) => {
  // User is available in req.user from the authenticateJWT middleware
  return res.status(200).json({
    message: "User info retrieved successfully",
    data: [
      {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          username: req.user.username,
          email: req.user.email,
        },
      },
    ],
    code: 200,
  })
})

// Add OAuth routes to auth.routes.js
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", googleCallback)

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))
router.get("/github/callback", githubCallback)

export default router

