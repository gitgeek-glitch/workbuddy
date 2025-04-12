"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getProjects } from "../store/slices/projectSlice"
import { FiMessageSquare } from "react-icons/fi"

const Chat = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projects, loading } = useSelector((state) => state.projects)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Ensure projects are loaded
    if (!projects || projects.length === 0) {
      dispatch(getProjects())
    } else {
      setIsLoaded(true)
    }
  }, [projects, dispatch])

  useEffect(() => {
    // Only redirect after we confirm projects are loaded
    if (isLoaded && projects.length > 0) {
      navigate(`/dashboard/chat/${projects[0]._id}`)
    }
  }, [isLoaded, projects, navigate])

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-bg-primary">
      <div className="text-center glassmorphism p-10 rounded-2xl animate-in fade-in duration-500 max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-bg-secondary to-border flex items-center justify-center animate-blob">
          <FiMessageSquare size={36} className="text-accent" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 gradient-text">Project Chat</h2>
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="chat-spinner mb-4"></div>
            <p className="text-text-secondary">Loading your projects...</p>
          </div>
        ) : projects && projects.length === 0 ? (
          <div>
            <p className="text-text-primary mb-6">You don't have any projects yet.</p>
            <button
              onClick={() => navigate("/dashboard/projects")}
              className="px-6 py-3 bg-gradient-to-r from-accent to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-accent to-blue-500 rounded-full mb-4"></div>
            <p className="text-text-secondary">Redirecting to your chats...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
