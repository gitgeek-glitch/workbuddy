"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const Chat = () => {
  const navigate = useNavigate()
  const { projects } = useSelector((state) => state.projects)

  useEffect(() => {
    // If there are projects, redirect to the first project's chat
    if (projects && projects.length > 0) {
      navigate(`/dashboard/chat/${projects[0]._id}`)
    }
  }, [projects, navigate])

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Chat</h2>
        {projects && projects.length === 0 ? (
          <p className="text-gray-500">You don't have any projects yet. Create a project to start chatting.</p>
        ) : (
          <p className="text-gray-500">Loading chats...</p>
        )}
      </div>
    </div>
  )
}

export default Chat
