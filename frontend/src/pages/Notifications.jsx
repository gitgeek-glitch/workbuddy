"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FiGitPullRequest, FiStar, FiGitCommit, FiMessageSquare, FiUser, FiCalendar, FiBell } from "react-icons/fi"
import { markAllNotificationsAsRead, markNotificationAsRead } from "../store/slices/uiSlice"

const Notifications = () => {
  const dispatch = useDispatch()
  const { notifications, unreadNotificationsCount } = useSelector((state) => state.ui)
  const [filter, setFilter] = useState("all") // all, unread, read

  // Mock notifications since we don't have real ones yet
  const mockNotifications = [
    {
      id: 1,
      title: "New comment on your pull request",
      message: "John Doe commented on your PR #123",
      time: "5 minutes ago",
      read: false,
      type: "pull-request",
      icon: <FiGitPullRequest />,
    },
    {
      id: 2,
      title: "Your project was starred",
      message: "Alice Williams starred your project",
      time: "1 hour ago",
      read: false,
      type: "star",
      icon: <FiStar />,
    },
    {
      id: 3,
      title: "New pull request",
      message: "Bob Johnson opened PR #124",
      time: "3 hours ago",
      read: true,
      type: "pull-request",
      icon: <FiGitPullRequest />,
    },
    {
      id: 4,
      title: "New commit pushed",
      message: "Emma Davis pushed 3 commits to main branch",
      time: "5 hours ago",
      read: true,
      type: "commit",
      icon: <FiGitCommit />,
    },
    {
      id: 5,
      title: "New message in chat",
      message: "You have a new message from Charlie Brown",
      time: "1 day ago",
      read: true,
      type: "message",
      icon: <FiMessageSquare />,
    },
    {
      id: 6,
      title: "Team member added",
      message: "Grace Taylor was added to your project",
      time: "2 days ago",
      read: true,
      type: "team",
      icon: <FiUser />,
    },
    {
      id: 7,
      title: "Project deadline approaching",
      message: "E-commerce Dashboard project is due in 3 days",
      time: "2 days ago",
      read: false,
      type: "deadline",
      icon: <FiCalendar />,
    },
  ]

  // Use mock notifications until we implement real ones
  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications

  // Filter notifications based on read status
  const filteredNotifications = displayNotifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  // Mark a notification as read
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id))
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-text-secondary">
            {unreadNotificationsCount > 0
              ? `You have ${unreadNotificationsCount} unread notifications`
              : "You're all caught up!"}
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="btn-secondary flex items-center"
          disabled={unreadNotificationsCount === 0}
        >
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
        {filteredNotifications.length === 0 ? (
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
                key={notification.id}
                className={`p-4 hover:bg-bg-primary transition-colors ${notification.read ? "opacity-70" : ""}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.read ? "bg-bg-primary text-text-secondary" : "bg-accent bg-opacity-10 text-accent"
                      }`}
                    >
                      {notification.icon}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${!notification.read ? "text-accent" : ""}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-text-secondary">{notification.time}</p>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                    {!notification.read && (
                      <button
                        className="text-xs text-accent hover:underline mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
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