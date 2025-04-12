"use client"

import { formatDistanceToNow } from "date-fns"
import { useSelector } from "react-redux"
import { useMemo } from "react"

// Function to generate a consistent color based on a string (username)
const generateColor = (str) => {
  // List of vibrant colors that work well on both light and dark backgrounds
  const colors = [
    "#2563eb", // blue-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
    "#ea580c", // orange-600
    "#16a34a", // green-600
    "#ca8a04", // yellow-600
    "#0891b2", // cyan-600
    "#9333ea", // purple-600
    "#e11d48", // rose-600
    "#0284c7", // sky-600
    "#059669", // emerald-600
    "#4f46e5", // indigo-600
  ]

  // Simple hash function to get a consistent index
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const ChatMessage = ({ message }) => {
  const { currentUser } = useSelector((state) => state.user)

  const isCurrentUser = message.sender._id === currentUser._id

  // Format timestamp
  const formattedTime = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : ""

  // Generate a consistent color for the sender
  const senderColor = useMemo(
    () => generateColor(message.sender._id || message.sender.username),
    [message.sender._id, message.sender.username],
  )

  return (
    <div
      className={`chat-message-container ${isCurrentUser ? "chat-message-container-sent" : "chat-message-container-received"}`}
    >
      <div className={`chat-bubble ${isCurrentUser ? "chat-bubble-sent" : "chat-bubble-received"}`}>
        {!isCurrentUser && (
          <div className="chat-sender-name" style={{ color: senderColor }}>
            {message.sender.fullName || message.sender.username}
          </div>
        )}
        <p className="chat-message-text">{message.content}</p>
        <div className={`chat-message-time ${isCurrentUser ? "chat-message-time-sent" : "chat-message-time-received"}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
