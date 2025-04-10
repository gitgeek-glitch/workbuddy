"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FiBell } from "react-icons/fi"
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../store/slices/notificationSlice"
import axios from "axios"

const Notifications = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications)
  const [filter, setFilter] = useState("all") // all, unread, read

  // Fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  // Filter notifications based on read status
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  // Mark a notification as read
  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId))
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead())
  }

  // Handle accept invitation
  const handleAcceptInvitation = async (projectId, notificationId) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      const API_URL = import.meta.env.VITE_API_URL

      // Call the accept invitation endpoint
      //working dude
      await axios.post(
        `${API_URL}/api/project/${projectId._id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      )

      // Mark the notification as read
      dispatch(markNotificationRead(notificationId))

      // Refresh notifications
      dispatch(fetchNotifications())
    } catch (error) {
      console.error("Error accepting invitation:", error)
    }
  }

  // Handle decline invitation
  const handleDeclineInvitation = async (projectId, notificationId) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      const API_URL = import.meta.env.VITE_API_URL

      // Call the decline invitation endpoint
      await axios.post(
        `${API_URL}/api/project/${projectId._id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      )

      // Mark the notification as read
      dispatch(markNotificationRead(notificationId))

      // Refresh notifications
      dispatch(fetchNotifications())
    } catch (error) {
      console.error("Error declining invitation:", error)
    }
  }

  // Format notification time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "just now"
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`

    return date.toLocaleDateString()
  }

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Invitation":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        )
      case "File-Status":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        )
      case "Message":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        )
      case "Role-Change":
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
            <FiBell size={20} />
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-text-secondary">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        <button onClick={handleMarkAllAsRead} className="btn-secondary flex items-center" disabled={unreadCount === 0}>
          <FiBell className="mr-1" /> Mark all as read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 border-b-2 ${
            filter === "all" ? "border-accent text-accent" : "border-transparent hover:text-accent"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 border-b-2 ${
            filter === "unread" ? "border-accent text-accent" : "border-transparent hover:text-accent"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 border-b-2 ${
            filter === "read" ? "border-accent text-accent" : "border-transparent hover:text-accent"
          }`}
        >
          Read
        </button>
      </div>

      {/* Notifications list */}
      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="text-text-secondary" size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-text-secondary">
              {filter === "all"
                ? "You don't have any notifications yet"
                : filter === "unread"
                  ? "You don't have any unread notifications"
                  : "You don't have any read notifications"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-bg-primary transition-colors ${notification.read ? "opacity-70" : ""}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${!notification.read ? "text-accent" : ""}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-text-secondary">{formatTime(notification.createdAt)}</p>
                    </div>
                    {notification.projectId && (
                      <p className="text-sm text-text-secondary mt-1">
                        Project: {notification.projectId.name || notification.projectId}
                      </p>
                    )}

                    {/* Invitation actions */}
                    {notification.type === "Invitation" && notification.projectId && !notification.read && (
                      <div className="mt-3 flex space-x-3">
                        <button
                          className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                          onClick={() => handleAcceptInvitation(notification.projectId, notification._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                          onClick={() => handleDeclineInvitation(notification.projectId, notification._id)}
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Mark as read button (only for non-invitation notifications) */}
                    {!notification.read && notification.type !== "Invitation" && (
                      <button
                        className="text-xs text-accent hover:underline mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification._id)
                        }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
