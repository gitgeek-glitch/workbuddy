import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import winston from "winston"
import passport from "passport"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: "user-logs.log" }),
  ],
})

// Check if username is available
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        available: false,
        data: [],
        code: 400,
      })
    }

    const existingUser = await User.findOne({ username })

    return res.status(200).json({
      message: existingUser ? "Username is already taken" : "Username is available",
      available: !existingUser,
      data: [],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error checking username - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      available: false,
      data: [],
      code: 500,
    })
  }
}

// User signup with email and password
export const userSignUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body

    // Validate required fields
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        data: [],
        code: 400,
      })
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(409).json({
        message: "Email already in use",
        data: [],
        code: 409,
      })
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already taken",
        data: [],
        code: 409,
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      joinedDate: new Date(),
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

    const successMessage = "User registered successfully"
    logger.info(`${new Date().toISOString()} - Success: ${successMessage}`)

    return res.status(201).json({
      message: successMessage,
      data: [
        {
          token,
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
          },
        },
      ],
      code: 201,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error registering user - ${error.message}`)
    return res.status(500).json({ message: "Internal Server Error", data: [], code: 500 })
  }
}

// User signin with email and password
export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        data: [],
        code: 400,
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        data: [],
        code: 401,
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        data: [],
        code: 401,
      })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

    logger.info(`${new Date().toISOString()} - Success: User logged in successfully`)
    return res.status(200).json({
      message: "Login successful",
      data: [
        {
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
          },
        },
      ],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error logging in - ${error.message}`)
    return res.status(500).json({ message: "Internal Server Error", data: [], code: 500 })
  }
}

// Google OAuth callback
export const googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google OAuth error:", err)
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=oauth`)
    }

    if (!user) {
      console.error("No user returned from Google OAuth")
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=oauth`)
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Redirect to frontend with token and provider info
    return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&provider=google`)
  })(req, res)
}

// GitHub OAuth callback
export const githubCallback = (req, res) => {
  passport.authenticate("github", { session: false }, (err, user, info) => {
    if (err) {
      console.error("GitHub OAuth error:", err)
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=oauth`)
    }

    if (!user) {
      console.error("No user returned from GitHub OAuth")
      return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?error=oauth`)
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Redirect to frontend with token and provider info
    return res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&provider=github`)
  })(req, res)
}

