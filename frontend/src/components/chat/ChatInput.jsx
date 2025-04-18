// components/chat/ChatInput.jsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FiSend, FiPaperclip, FiSmile, FiX } from "react-icons/fi"
import { clearReplyToMessage } from "../../store/slices/chatSlice"
import { sendMessage as socketSendMessage, sendTypingStatus } from "../../services/socketService"

const ChatInput = ({ projectId }) => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch()
  const { replyToMessage } = useSelector((state) => state.chat)
  const { currentUser } = useSelector((state) => state.user)
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    // Focus input on mount or when replyToMessage changes
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [projectId, replyToMessage])

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      sendTypingStatus(projectId, true)
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTypingStatus(projectId, false)
    }, 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message.trim() || isSending) return

    setIsSending(true)
    console.log(currentUser);
    
    try {
      // Create message object with all required fields
      const messageData = {
        projectId,
        content: message.trim(),
        sender: {
          _id: currentUser._id,
          username: currentUser.username,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar,
        },
        timestamp: new Date().toISOString(),
        _id: `temp-${Date.now()}`, // Temporary ID until server assigns a real one
      }

      // Add reference if replying to a message
      if (replyToMessage) {
        messageData.referenceId = replyToMessage._id
      }

      console.log("Sending message via socket:", messageData)

      // Send via socket service
      socketSendMessage(messageData)

      // Clear input
      setMessage("")

      // Clear reply if there was one
      if (replyToMessage) {
        dispatch(clearReplyToMessage())
      }
    } catch (error) {
      console.log(error);
      
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setIsTyping(false)
    sendTypingStatus(projectId, false)
  }

  const handleCancelReply = () => {
    dispatch(clearReplyToMessage())
  }

  return (
    <>
      {replyToMessage && (
        <div
          className="reply-container"
          style={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
        >
          <div className="reply-header">
            <div className="reply-to-text">
              <span className="mr-2">Replying to</span>
              <span className="reply-username" style={{ color: "var(--color-accent)" }}>
                {replyToMessage.sender.fullName || replyToMessage.sender.username}
              </span>
            </div>
            <button
              onClick={handleCancelReply}
              className="reply-cancel"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Cancel reply"
            >
              <FiX size={16} />
            </button>
          </div>
          <div className="reply-content" style={{ color: "var(--color-text-secondary)" }}>
            {replyToMessage.content}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input-container">
        <button type="button" className="chat-input-button" aria-label="Attach file">
          <FiPaperclip size={20} />
        </button>

        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder={replyToMessage ? "Type your reply..." : "Type a message..."}
            className="chat-input-field"
          />
          <button type="button" className="chat-input-emoji" aria-label="Insert emoji">
            <FiSmile size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className={`chat-input-send ${message.trim() && !isSending ? "chat-input-send-active" : "chat-input-send-inactive"}`}
          aria-label="Send message"
        >
          <FiSend size={20} />
        </button>
      </form>
    </>
  )
}

export default ChatInput
