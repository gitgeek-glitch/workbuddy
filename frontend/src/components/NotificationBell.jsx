"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FiBell } from "react-icons/fi"
import { Link } from "react-router-dom"
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../store/slices/notificationSlice"

const NotificationBell = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state) => state.notifications)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle mark as read
  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation()
    dispatch(markNotificationRead(notificationId))
  }

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead())
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
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
            <FiBell size={16} />
          </div>
        )
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-blue-500 hover:underline" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    notification.read ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium ${!notification.read ? "text-blue-500" : ""}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                      {!notification.read && (
                        <button
                          className="text-xs text-blue-500 hover:underline mt-1"
                          onClick={(e) => handleMarkAsRead(e, notification._id)}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/dashboard/notifications"
              className="text-sm text-blue-500 hover:underline block text-center"
              onClick={() => setDropdownOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
