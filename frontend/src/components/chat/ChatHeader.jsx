"use client"

import { FiUsers, FiInfo } from "react-icons/fi"

const ChatHeader = ({ project, onInfoClick }) => {
  if (!project) return null

  return (
    <div className="chat-header bg-bg-secondary border-b border-border">
      <div className="flex items-center">
        <div className="chat-header-avatar">{project.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="font-medium">{project.name}</h2>
          <div className="chat-header-info">
            <FiUsers size={12} className="mr-1" />
            <span>{project.members?.length || 0} members</span>
          </div>
        </div>
      </div>

      <button onClick={onInfoClick} className="chat-input-button" aria-label="Project information">
        <FiInfo size={20} />
      </button>
    </div>
  )
}

export default ChatHeader
