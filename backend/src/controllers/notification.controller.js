import { Notification } from "../models/notification.model.js"
import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: "notification-logs.log" }),
  ],
})

// Get all notifications for the authenticated user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id

    // Find all notifications for the user, sorted by creation date (newest first)
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("projectId", "name")
      .limit(50) // Limit to 50 most recent notifications

    logger.info(`${new Date().toISOString()} - Success: Retrieved notifications for user ${userId}`)

    return res.status(200).json({
      message: "Notifications retrieved successfully",
      data: notifications,
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error retrieving notifications - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user._id

    // Find the notification
    const notification = await Notification.findById(notificationId)

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        data: [],
        code: 404,
      })
    }

    // Check if the notification belongs to the user
    if (!notification.user.equals(userId)) {
      return res.status(403).json({
        message: "You do not have permission to update this notification",
        data: [],
        code: 403,
      })
    }

    // Update the notification
    notification.read = true
    await notification.save()

    logger.info(`${new Date().toISOString()} - Success: Notification ${notificationId} marked as read`)

    return res.status(200).json({
      message: "Notification marked as read",
      data: [notification],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error marking notification as read - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id

    // Update all unread notifications for the user
    const result = await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } })

    logger.info(`${new Date().toISOString()} - Success: All notifications marked as read for user ${userId}`)

    return res.status(200).json({
      message: "All notifications marked as read",
      data: [{ count: result.modifiedCount }],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error marking all notifications as read - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Create a notification (utility function for internal use)
export const createNotification = async (userId, message, projectId, type) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      projectId,
      type,
    })

    await notification.save()

    // Return the notification for socket emission
    return notification
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error creating notification - ${error.message}`)
    return null
  }
}
