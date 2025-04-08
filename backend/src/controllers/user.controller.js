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

export const userSignUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Validate required fields
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        data: [],
        code: 400,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        data: [],
        code: 400,
      });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, underscores, and dots",
        data: [],
        code: 400,
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        message: "Email already in use",
        data: [],
        code: 409,
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already taken",
        data: [],
        code: 409,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      joinedDate: new Date(),
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const successMessage = "User registered successfully";
    logger.info(`${new Date().toISOString()} - Success: ${successMessage}`);

    // Get user document without the password
    const userWithoutPassword = await User.findById(newUser._id).select('-password');

    return res.status(201).json({
      message: successMessage,
      data: [
        {
          token,
          user: userWithoutPassword
        },
      ],
      code: 201,
    });
  } catch (error) {
    logger.error(
      `${new Date().toISOString()} - Error: Error registering user - ${error.message}`
    );
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    });
  }
};

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

    // Get user document without the password
    const userWithoutPassword = await User.findById(user._id).select('-password');

    logger.info(`${new Date().toISOString()} - Success: User logged in successfully`)
    return res.status(200).json({
      message: "Login successful",
      data: [
        {
          token,
          user: userWithoutPassword
        },
      ],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error logging in - ${error.message}`)
    return res.status(500).json({ message: "Internal Server Error", data: [], code: 500 })
  }
}

export const userProfileUpdate = async (req, res) => {
  try {
    const userId = req.userId || req.params.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        data: [],
        code: 400,
      });
    }

    // Extract only the allowed fields
    const {
      fullName,      
      school,
      role,
      bio,
      skills,
    } = req.body;

    const updateFields = {};

    if (fullName) updateFields.fullName = fullName;    
    if (school) updateFields.school = school;
    if (role) updateFields.role = role;
    if (bio) updateFields.bio = bio;
    if (skills) updateFields.skills = skills;

    // Attempt to update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) {
      logger.warn(`${new Date().toISOString()} - Warning: User not found for update`);
      return res.status(404).json({
        message: "User not found",
        data: [],
        code: 404,
      });
    }

    logger.info(`${new Date().toISOString()} - Success: User profile updated for userId: ${userId}`);
    return res.status(200).json({
      message: "Profile updated successfully",
      data: [updatedUser],
      code: 200,
    });
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error updating profile - ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    });
  }
};


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

