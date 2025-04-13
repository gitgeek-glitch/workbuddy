// components/chat/ForwardDialog.jsx
"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FiX, FiSearch, FiSend } from "react-icons/fi"
import { forwardMessage } from "../../store/slices/chatSlice"

const ForwardDialog = ({ message, onClose }) => {
  const dispatch = useDispatch()
  const { projects } = useSelector((state) => state.projects)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [filteredProjects, setFilteredProjects] = useState([])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter((project) => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProjects(filtered)
    }
  }, [searchTerm, projects])

  const handleForward = () => {
    if (selectedProjectId) {
      dispatch(forwardMessage({
        content: message.content,
        originalSender: message.sender.fullName || message.sender.username,
        projectId: selectedProjectId,
      }))
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="w-full max-w-md rounded-lg shadow-lg p-4"
        style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Forward Message</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-opacity-10"
            style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div 
          className="mb-4 p-3 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-primary)', borderLeft: `3px solid var(--color-accent)` }}
        >
          <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Original message from {message.sender.fullName || message.sender.username}:
          </p>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-lg"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)', 
              color: 'var(--color-text-primary)',
              border: `1px solid var(--color-border)` 
            }}
          />
        </div>
        
        <div 
          className="max-h-60 overflow-y-auto mb-4"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-border) var(--color-bg-primary)' 
          }}
        >
          {filteredProjects.length === 0 ? (
            <p className="text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>No projects found</p>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                className={`p-3 rounded-lg mb-2 cursor-pointer`}
                style={{ 
                  backgroundColor: selectedProjectId === project._id 
                    ? 'var(--color-accent)' 
                    : 'var(--color-bg-primary)',
                  color: selectedProjectId === project._id 
                    ? '#fff' 
                    : 'var(--color-text-primary)',
                }}
                onClick={() => setSelectedProjectId(project._id)}
              >
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: selectedProjectId === project._id 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'var(--color-border)' 
                    }}
                  >
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs" style={{ color: selectedProjectId === project._id ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-text-secondary)' }}>
                      {project.members?.length || 0} members
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
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
            onClick={handleForward}
            disabled={!selectedProjectId}
            className="px-4 py-2 rounded-lg flex items-center"
            style={{ 
              backgroundColor: selectedProjectId ? 'var(--color-accent)' : 'var(--color-border)',
              color: selectedProjectId ? '#fff' : 'var(--color-text-secondary)',
              opacity: selectedProjectId ? 1 : 0.7
            }}
          >
            <FiSend className="mr-2" size={16} />
            Forward
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForwardDialog