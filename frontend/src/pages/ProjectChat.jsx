"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { fetchProjectMessages, fetchUnreadCounts, markProjectAsRead } from "../store/slices/chatSlice"
import ChatMessage from "../components/chat/ChatMessage"
import ChatInput from "../components/chat/ChatInput"
import ProjectChatList from "../components/chat/ProjectChatList"
import { FiMessageSquare, FiUsers } from "react-icons/fi"
import { joinProjectChat, leaveProjectChat, markMessagesAsRead } from "../services/socketService"

const ProjectChat = () => {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const { projects } = useSelector((state) => state.projects)
  const { activeProjectId, messages, loading, unreadCounts } = useSelector((state) => state.chat)

  const [typingUsers, setTypingUsers] = useState({})
  const messagesEndRef = useRef(null)

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

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Project list sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 h-full">
        <ProjectChatList projects={projects} onProjectSelect={handleProjectSelect} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeProjectId ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="mr-3 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {currentProject?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-medium">{currentProject?.name}</h2>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <FiUsers size={12} className="mr-1" />
                    <span>{currentProject?.members?.length || 0} members</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading && currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <FiMessageSquare size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation by sending a message</p>
                </div>
              ) : (
                <>
                  {currentMessages.map((message) => (
                    <ChatMessage key={message._id} message={message} />
                  ))}

                  {Object.values(typingUsers).map((username) => (
                    <div key={username} className="flex items-center text-xs text-gray-500 dark:text-gray-400 p-2">
                      <div className="flex space-x-1 mr-2">
                        <div
                          className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span>{username} is typing...</span>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <ChatInput projectId={activeProjectId} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <FiMessageSquare size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">Select a project to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectChat
