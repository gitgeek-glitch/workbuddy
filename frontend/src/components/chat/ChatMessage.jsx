// components/chat/ChatMessage.jsx
"use client"

import { formatDistanceToNow } from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import { useMemo, useState, useRef, useCallback } from "react"
import { FiAlertCircle } from "react-icons/fi"
import { setReplyToMessage, deleteMessage } from "../../store/slices/chatSlice"
import ContextMenu from "./ContextMenu"
import ForwardDialog from "./ForwardDialog"

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
  console.log(str);
  
  // Simple hash function to get a consistent index
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const ChatMessage = ({ message, allMessages, onScrollToMessage }) => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
  const [showForwardDialog, setShowForwardDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const messageRef = useRef(null)

  const isCurrentUser = message.sender._id === currentUser._id

  // Format timestamp
  const formattedTime = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : ""

  // Generate a consistent color for the sender
  const senderColor = useMemo(
    () => {
      console.log(message)
      return generateColor(message.sender._id || message.sender.username)
    },
    [message.sender._id, message.sender.username],
  )

  // Find referenced message if exists
  const referencedMessage = useMemo(() => {
    if (!message.referenceId) return null
    return allMessages.find((msg) => msg._id === message.referenceId)
  }, [message.referenceId, allMessages])

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    setShowContextMenu(true)
    setContextMenuPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setShowContextMenu(false)
  }, [])

  const handleContextMenuAction = useCallback(
    (action) => {
      switch (action) {
        case "reply":
          dispatch(setReplyToMessage(message))
          break
        case "copy":
          navigator.clipboard.writeText(message.content)
          break
        case "delete":
          setShowDeleteConfirm(true)
          break
        case "forward":
          setShowForwardDialog(true)
          break
        default:
          break
      }
    },
    [message, dispatch],
  )

  const handleReferenceClick = useCallback(() => {
    if (referencedMessage && onScrollToMessage) {
      onScrollToMessage(referencedMessage._id)
    }
  }, [referencedMessage, onScrollToMessage])

  const handleDeleteMessage = useCallback(() => {
    dispatch(deleteMessage(message._id))
    setShowDeleteConfirm(false)
  }, [message._id, dispatch])

  return (
    <>
      <div
        ref={messageRef}
        id={`message-${message._id}`}
        className={`chat-message-container ${isCurrentUser ? "chat-message-container-sent" : "chat-message-container-received"}`}
        onContextMenu={handleContextMenu}
      >
        <div className={`chat-bubble ${isCurrentUser ? "chat-bubble-sent" : "chat-bubble-received"}`}>
          {!isCurrentUser && (
            <div className="chat-sender-name" style={{ color: senderColor }}>
              {message.sender.fullName || message.sender.username}
            </div>
          )}

          {referencedMessage && (
            <div
              className="chat-reference-preview"
              onClick={handleReferenceClick}
            >
              <div 
                className="chat-reference-sender" 
                style={{ color: generateColor(referencedMessage.sender._id) }}
              >
                {referencedMessage.sender.fullName || referencedMessage.sender.username}
              </div>
              <div className="chat-reference-content">
                {referencedMessage.content}
              </div>
            </div>
          )}

          <p className="chat-message-text">{message.content}</p>
          <div className={`chat-message-time ${isCurrentUser ? "chat-message-time-sent" : "chat-message-time-received"}`}>
            {formattedTime}
          </div>
        </div>

        {showContextMenu && (
          <ContextMenu
            x={contextMenuPos.x}
            y={contextMenuPos.y}
            onClose={handleCloseContextMenu}
            onSelect={handleContextMenuAction}
            options={[
              { action: "reply", label: "Reply" },
              { action: "forward", label: "Forward" },
              { action: "copy", label: "Copy" },
              { action: "delete", label: "Delete" },
            ]}
          />
        )}
      </div>

      {showForwardDialog && (
        <ForwardDialog 
          message={message} 
          onClose={() => setShowForwardDialog(false)} 
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="w-full max-w-sm rounded-lg shadow-lg p-4"
            style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
          >
            <div className="flex items-center mb-4">
              <FiAlertCircle size={24} className="mr-3" style={{ color: 'var(--color-danger)' }} />
              <h3 className="text-lg font-semibold">Delete Message</h3>
            </div>
            <p className="mb-4">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg mr-2"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)', 
                  color: 'var(--color-text-primary)',
                  border: `1px solid var(--color-border)` 
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMessage}
                className="px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--color-danger)',
                  color: '#fff',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatMessage