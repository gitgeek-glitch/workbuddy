import express from "express"
import { getUserNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js"
import { authenticateJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Apply authentication middleware to all notification routes
router.use(authenticateJWT)

// Get all notifications for the authenticated user
router.get("/", getUserNotifications)

// Mark a notification as read
router.patch("/:notificationId/read", markAsRead)

// Mark all notifications as read
router.patch("/read-all", markAllAsRead)

export default router
