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
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 p-3 border-t border-gray-200 dark:border-gray-700"
    >
      <button
        type="button"
        className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
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
          className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiSmile size={18} />
        </button>
      </div>

      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-2 rounded-full ${
          message.trim()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        } transition-colors`}
      >
        <FiSend size={18} />
      </button>
    </form>
  )
}

export default ChatInput
