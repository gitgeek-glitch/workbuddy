import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
        data: [],
        code: 401,
      })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        data: [],
        code: 401,
      })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      data: [],
      code: 401,
    })
  }
}

