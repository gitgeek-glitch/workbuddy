import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GitHubStrategy } from "passport-github2"
import { User } from "../models/user.model.js"
import bcrypt from "bcrypt"

const setupPassport = () => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
        scope: ["profile", "email"],
        proxy: true, // Add this for secure production environments
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract profile information
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null

          if (!email) {
            return done(new Error("No email provided from Google"), null)
          }

          const fullName =
            profile.displayName || `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim()

          // Check if user exists
          const user = await User.findOne({ email })

          if (user) {
            // User exists, return user
            return done(null, user)
          } else {
            // Create new user
            // Generate a username based on name and random numbers
            const baseUsername = fullName.replace(/\s+/g, "").toLowerCase() || "user"
            const randomSuffix = Math.floor(100000 + Math.random() * 900000)
            const username = `${baseUsername}_${randomSuffix}`

            // Generate a random password
            const randomPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await bcrypt.hash(randomPassword, 10)

            const newUser = new User({
              fullName,
              username,
              email,
              password: hashedPassword,
              joinedDate: new Date(),
            })

            await newUser.save()
            return done(null, newUser)
          }
        } catch (error) {
          console.error("Google OAuth error:", error)
          return done(error, null)
        }
      },
    ),
  )

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/auth/github/callback`,
        scope: ["user:email"],
        proxy: true, // Add this for secure production environments
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub may not provide email directly, try to get it from emails array
          let email = null

          if (profile.emails && profile.emails.length > 0) {
            // Find the primary email or use the first one
            const primaryEmail = profile.emails.find((e) => e.primary)
            email = primaryEmail ? primaryEmail.value : profile.emails[0].value
          }

          // If still no email, use GitHub username as fallback
          if (!email) {
            email = `${profile.username}@github.com`
          }

          const fullName = profile.displayName || profile.username || "GitHub User"

          // Check if user exists
          const user = await User.findOne({ email })

          if (user) {
            // User exists, return user
            return done(null, user)
          } else {
            // Create new user
            // Generate a username based on GitHub username
            const baseUsername = profile.username || "github_user"
            const randomSuffix = Math.floor(100000 + Math.random() * 900000)
            const username = `${baseUsername}_${randomSuffix}`

            // Generate a random password
            const randomPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await bcrypt.hash(randomPassword, 10)

            const newUser = new User({
              fullName,
              username,
              email,
              password: hashedPassword,
              joinedDate: new Date(),
            })

            await newUser.save()
            return done(null, newUser)
          }
        } catch (error) {
          console.error("GitHub OAuth error:", error)
          return done(error, null)
        }
      },
    ),
  )

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}

export default setupPassport

