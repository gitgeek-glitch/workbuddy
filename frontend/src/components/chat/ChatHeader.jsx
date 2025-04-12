"use client"

import { FiUsers, FiInfo } from "react-icons/fi"

const ChatHeader = ({ project, onInfoClick }) => {
  if (!project) return null

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="mr-3 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {project.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-medium">{project.name}</h2>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <FiUsers size={12} className="mr-1" />
            <span>{project.members?.length || 0} members</span>
          </div>
        </div>
      </div>

      <button
        onClick={onInfoClick}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
      >
        <FiInfo size={20} />
      </button>
    </div>
  )
}

export default ChatHeader
