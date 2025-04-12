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
      <div className="text-center glassmorphism p-8 rounded-2xl animate-in fade-in duration-500 max-w-md">
        <FiMessageSquare size={64} className="mx-auto mb-6 text-accent animate-float" />
        <h2 className="text-2xl font-semibold mb-4 gradient-text">Project Chat</h2>
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mb-2"></div>
            <p className="text-text-secondary">Loading your projects...</p>
          </div>
        ) : projects && projects.length === 0 ? (
          <div>
            <p className="text-text-secondary mb-4">You don't have any projects yet.</p>
            <button onClick={() => navigate("/dashboard/projects")} className="btn-primary">
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"></div>
            <p className="text-text-secondary">Redirecting to your chats...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
