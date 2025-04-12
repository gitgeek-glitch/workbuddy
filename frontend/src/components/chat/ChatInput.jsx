"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi"
import { sendMessage } from "../../store/slices/chatSlice"
import { sendTypingStatus } from "../../services/socketService"

const ChatInput = ({ projectId }) => {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [projectId])

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

    if (!message.trim()) return

    dispatch(sendMessage({ projectId, content: message.trim() }))
    setMessage("")

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    setIsTyping(false)
    sendTypingStatus(projectId, false)
  }

  return (
    <form onSubmit={handleSubmit} className="chat-input-container bg-bg-secondary border-t border-border">
      <button type="button" className="chat-input-button" aria-label="Attach file">
        <FiPaperclip size={18} />
      </button>

      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a message..."
          className="chat-input-field"
        />
        <button type="button" className="chat-input-emoji" aria-label="Insert emoji">
          <FiSmile size={18} />
        </button>
      </div>

      <button
        type="submit"
        disabled={!message.trim()}
        className={`chat-input-send ${message.trim() ? "chat-input-send-active" : "chat-input-send-inactive"}`}
        aria-label="Send message"
      >
        <FiSend size={18} />
      </button>
    </form>
  )
}

export default ChatInput
