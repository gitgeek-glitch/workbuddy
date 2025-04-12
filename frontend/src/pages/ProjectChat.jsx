"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchProjectMessages, fetchUnreadCounts, markProjectAsRead } from "../store/slices/chatSlice"
import { getProjects } from "../store/slices/projectSlice"
import ChatMessage from "../components/chat/ChatMessage"
import ChatInput from "../components/chat/ChatInput"
import ProjectChatList from "../components/chat/ProjectChatList"
import TypingIndicator from "../components/chat/TypingIndicator"
import ChatHeader from "../components/chat/ChatHeader"
import { FiMessageSquare } from "react-icons/fi"
import { joinProjectChat, leaveProjectChat, markMessagesAsRead } from "../services/socketService"

const ProjectChat = () => {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects)
  const { activeProjectId, messages, loading: chatLoading, unreadCounts } = useSelector((state) => state.chat)

  const [typingUsers, setTypingUsers] = useState({})
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef(null)

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
    // Leave previous project chat room
    if (activeProjectId) {
      leaveProjectChat(activeProjectId)
    }

    // Join new project chat room
    joinProjectChat(projectId)

    // Mark messages as read
    dispatch(markProjectAsRead(projectId))
    markMessagesAsRead(projectId)

    // Clear typing indicators
    setTypingUsers({})
  }

  // Join project chat room when active project changes
  useEffect(() => {
    if (activeProjectId) {
      joinProjectChat(activeProjectId)

      // Mark messages as read
      dispatch(markProjectAsRead(activeProjectId))
      markMessagesAsRead(activeProjectId)

      return () => {
        leaveProjectChat(activeProjectId)
      }
    }
  }, [activeProjectId, dispatch])

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeProjectId])

  // Get current project
  const currentProject = projects.find((p) => p._id === activeProjectId)
  const currentMessages = activeProjectId ? messages[activeProjectId] || [] : []

  if (projectsLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-bg-primary">
      {/* Project list sidebar */}
      <div className="w-80 border-r border-border h-full bg-bg-secondary">
        <ProjectChatList projects={projects} onProjectSelect={handleProjectSelect} />
      </div>

      {/* Chat area */}
      <div className="chat-area">
        {activeProjectId ? (
          <>
            <ChatHeader project={currentProject} onInfoClick={() => console.log("Info clicked")} />

            <div className="chat-messages">
              {chatLoading && currentMessages.length === 0 ? (
                <div className="chat-loading">
                  <div className="chat-spinner"></div>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="chat-empty">
                  <FiMessageSquare size={48} className="chat-empty-icon" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation by sending a message</p>
                </div>
              ) : (
                <>
                  {currentMessages.map((message) => (
                    <ChatMessage key={message._id} message={message} />
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
            <FiMessageSquare size={64} className="chat-empty-icon" />
            <p className="text-lg">Select a project to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectChat
