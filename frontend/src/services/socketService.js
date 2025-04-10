import { io } from "socket.io-client"
import { addNotification, fetchNotifications } from "../store/slices/notificationSlice"

let socket = null

export const initializeSocket = (token, store) => {
  if (socket) {
    socket.disconnect()
  }
  const API_URL = import.meta.env.VITE_API_URL

  socket = io(API_URL, {
    auth: {
      token,
    },
  })

  socket.on("connect", () => {
    console.log("Socket connected")

    // Fetch notifications when socket connects to ensure we have the latest data
    store.dispatch(fetchNotifications())
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message)
  })

  // Listen for notifications
  socket.on("notification", (notification) => {
    console.log("New notification received:", notification)

    // Add the notification to the store
    store.dispatch(addNotification(notification))

    // Immediately fetch all notifications to ensure counts are updated correctly
    store.dispatch(fetchNotifications())

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TeamCollab", {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

// Request notification permissions
export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission()
    }
  }
}
