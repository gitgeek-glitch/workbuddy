// ProjectChat.jsx
"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { fetchProjectMessages, fetchUnreadCounts, markProjectAsRead, setActiveProject } from "../store/slices/chatSlice"
import { getProjects } from "../store/slices/projectSlice"
import ChatMessage from "../components/chat/ChatMessage"
import ChatInput from "../components/chat/ChatInput"
import ProjectChatList from "../components/chat/ProjectChatList"
import TypingIndicator from "../components/chat/TypingIndicator"
import ChatHeader from "../components/chat/ChatHeader"
import { FiMessageSquare } from "react-icons/fi"
import { joinProjectChat, leaveProjectChat, markMessagesAsRead, getSocket } from "../services/socketService"

const ProjectChat = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects)
  const { activeProjectId, messages, loading: chatLoading, unreadCounts } = useSelector((state) => state.chat)
  const { isAuthenticated } = useSelector((state) => state.user)

  const [typingUsers, setTypingUsers] = useState({})
  const [isInitialized, setIsInitialized] = useState(false)
  const [socketReady, setSocketReady] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const messageRefs = useRef({})
  const socketCheckIntervalRef = useRef(null)

  // Check if socket is ready
  useEffect(() => {
    // Initial check
    const checkSocket = () => {
      const socket = getSocket()
      const isReady = socket && socket.connected
      setSocketReady(isReady)
      return isReady
    }

    // Check immediately
    const isReady = checkSocket()

    // If not ready, set up an interval to check periodically
    if (!isReady) {
      socketCheckIntervalRef.current = setInterval(() => {
        if (checkSocket()) {
          // If socket becomes ready, clear the interval
          clearInterval(socketCheckIntervalRef.current)
        }  
      }, 1000)
    }

    return () => {
      if (socketCheckIntervalRef.current) {
        clearInterval(socketCheckIntervalRef.current)
      }
    }
  }, [])

  // Set active project when projectId changes
  useEffect(() => {
    if (projectId && projectId !== activeProjectId) {
      dispatch(setActiveProject(projectId))
    }
  }, [projectId, activeProjectId, dispatch])

  // Ensure projects are loaded
  useEffect(() => {
    if (!projects || projects.length === 0) {
      dispatch(getProjects())
    } else if (!isInitialized) {
      setIsInitialized(true)
    }
  }, [projects, dispatch, isInitialized])

  // Handle project selection
  const handleProjectSelect = (projectId) => {
    navigate(`/dashboard/chat/${projectId}`)
  }

  // Join project chat room when active project changes and socket is ready
  useEffect(() => {
    if (activeProjectId && socketReady) {
      console.log(`Joining project chat room: ${activeProjectId}`)
      joinProjectChat(activeProjectId)

      // Mark messages as read
      dispatch(markProjectAsRead(activeProjectId))
      markMessagesAsRead(activeProjectId)

      return () => {
        console.log(`Leaving project chat room: ${activeProjectId}`)
        leaveProjectChat(activeProjectId)
      }
    }
  }, [activeProjectId, socketReady, dispatch])

  // Fetch messages when active project changes
  useEffect(() => {
    if (activeProjectId) {
      dispatch(fetchProjectMessages({ projectId: activeProjectId }))
    }
  }, [activeProjectId, dispatch])

  // Fetch unread counts on mount
  useEffect(() => {
    dispatch(fetchUnreadCounts())
  }, [dispatch])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeProjectId])

  // Scroll to a specific message
  const scrollToMessage = useCallback((messageId) => {
    const element = document.getElementById(`message-${messageId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })

      // Highlight the message briefly
      element.style.backgroundColor = "var(--color-accent)"
      element.style.opacity = "0.1"

      setTimeout(() => {
        element.style.backgroundColor = "transparent"
        element.style.opacity = "1"
        element.style.transition = "background-color 1s ease, opacity 1s ease"
      }, 100)

      setTimeout(() => {
        element.style.transition = ""
      }, 2000)
    }
  }, [])

  // Group messages by date for WhatsApp-like date separators
  const groupMessagesByDate = (messages) => {
    const groups = {}

    messages.forEach((message) => {
      if (!message.timestamp) return

      const date = new Date(message.timestamp)
      const dateStr = date.toLocaleDateString()

      if (!groups[dateStr]) {
        groups[dateStr] = []
      }

      groups[dateStr].push(message)
    })

    return groups
  }

  // Get current project
  const currentProject = projects.find((p) => p._id === activeProjectId)
  const currentMessages = activeProjectId ? messages[activeProjectId] || [] : []
  const groupedMessages = groupMessagesByDate(currentMessages)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  if (projectsLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-bg-primary">
        <div className="flex flex-col items-center">
          <div className="chat-spinner mb-4"></div>
          <p className="text-text-secondary">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-bg-primary">
      {/* Project list sidebar */}
      <div className="w-80 border-r border-border h-full shadow-md">
        <ProjectChatList projects={projects} activeProjectId={activeProjectId} onProjectSelect={handleProjectSelect} />
      </div>

      {/* Chat area */}
      <div className="chat-area">
        {!socketReady && (
          <div className="socket-status-banner">Connecting to chat server... {/* You can style this as needed */}</div>
        )}

        {activeProjectId ? (
          <>
            <ChatHeader project={currentProject} onInfoClick={() => console.log("Info clicked")} />

            <div className="chat-messages" ref={messagesContainerRef}>
              {chatLoading && currentMessages.length === 0 ? (
                <div className="chat-loading">
                  <div className="chat-spinner"></div>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="chat-empty">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-bg-secondary to-border flex items-center justify-center mb-4 animate-blob">
                    <FiMessageSquare size={28} className="text-accent" />
                  </div>
                  <p className="text-lg font-medium mb-2 text-text-primary">No messages yet</p>
                  <p className="text-sm text-text-secondary">Start the conversation by sending a message</p>
                </div>
              ) : (
                <>
                  {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      <div className="flex justify-center my-3">
                        <div className="px-3 py-1 rounded-full bg-bg-secondary text-text-secondary text-xs shadow-sm">
                          {date}
                        </div>
                      </div>
                      {msgs.map((message) => (
                        <ChatMessage
                          key={message._id}
                          message={message}
                          allMessages={currentMessages}
                          onScrollToMessage={scrollToMessage}
                        />
                      ))}
                    </div>
                  ))}

                  {Object.values(typingUsers).map((username) => (
                    <TypingIndicator key={username} user={username} />
                  ))}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <ChatInput projectId={activeProjectId} />
          </>
        ) : (
          <div className="chat-empty">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bg-secondary to-border flex items-center justify-center mb-6 animate-blob">
              <FiMessageSquare size={36} className="text-accent" />
            </div>
            <p className="text-xl font-medium mb-2 text-text-primary">Select a project to start chatting</p>
            <p className="text-sm text-text-secondary">Choose a project from the sidebar to begin your conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectChat
