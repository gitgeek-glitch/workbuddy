"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FiSearch } from "react-icons/fi"
import { setActiveProject } from "../../store/slices/chatSlice"

const ProjectChatList = ({ projects, onProjectSelect }) => {
  const dispatch = useDispatch()
  const { activeProjectId, unreadCounts } = useSelector((state) => state.chat)

  useEffect(() => {
    // Set first project as active if none is selected
    if (projects.length > 0 && !activeProjectId) {
      dispatch(setActiveProject(projects[0]._id))
      onProjectSelect(projects[0]._id)
    }
  }, [projects, activeProjectId, dispatch, onProjectSelect])

  const handleProjectClick = (projectId) => {
    dispatch(setActiveProject(projectId))
    onProjectSelect(projectId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
          <FiSearch className="absolute left-3 top-2 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">No projects found</div>
        ) : (
          <div className="space-y-1">
            {projects.map((project) => {
              const unreadCount = unreadCounts[project._id]?.unreadCount || 0

              return (
                <button
                  key={project._id}
                  onClick={() => handleProjectClick(project._id)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    activeProjectId === project._id
                      ? "bg-blue-50 dark:bg-blue-900 dark:bg-blue-800/50"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{project.name}</div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.members.length} members</div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectChatList
