"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiCheckCircle, FiClock, FiStar, FiTrash2, FiCheck, FiMoreVertical, FiUserPlus, FiLogOut } from "react-icons/fi"
import axios from "axios"
import { toast } from "react-toastify"
import { updateProject, deleteProjectAsync, leaveProjectAsync } from "../../store/slices/projectSlice"
import AddCollaboratorsModal from "./AddCollaboratorsModal"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)

  // Check if current user is the project leader
  const isLeader = project.members?.some((member) => member.userId._id === currentUser?.id && member.role === "Leader")
  console.log(isLeader);
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Handle finishing a project
  const handleFinishProject = async () => {
    if (!isLeader) return

    setLoading(true)
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      await axios.patch(
        `${API_URL}/api/project/${project._id}`,
        { status: "Finished" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update project in Redux store
      dispatch(
        updateProject({
          id: project._id,
          projectData: { status: "Finished" },
        }),
      )

      toast.success("Project marked as finished")
    } catch (error) {
      console.error("Error finishing project:", error)
      toast.error(error.response?.data?.message || "Failed to finish project")
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  // Handle deleting a project
  const handleDeleteProject = async () => {
    if (!isLeader) return

    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      dispatch(deleteProjectAsync(project._id))
      toast.success("Project deleted successfully")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error(error.response?.data?.message || "Failed to delete project")
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  // Handle leaving a project
  const handleLeaveProject = async () => {
    if (isLeader) {
      toast.error("Project leaders cannot leave the project. Transfer leadership first or delete the project.")
      return
    }

    if (!window.confirm("Are you sure you want to leave this project?")) {
      return
    }

    setLoading(true)
    try {
      dispatch(leaveProjectAsync(project._id))
      toast.success("You have left the project")
    } catch (error) {
      console.error("Error leaving project:", error)
      toast.error(error.response?.data?.message || "Failed to leave project")
    } finally {
      setLoading(false)
    }
  }

  // Handle adding collaborators
  const handleAddCollaborators = () => {
    if (!isLeader) return
    setShowCollaboratorsModal(true)
  }

  // Close menu when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(".project-menu") && menuOpen) {
      setMenuOpen(false)
    }
  }

  // Add event listener when menu is open
  useState(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen])

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <div className="flex items-center space-x-1">
          {project.important && <FiStar className="text-warning" />}

          {/* Project actions - only visible to leader */}
          {isLeader && (
            <div className="relative project-menu">
              {/* Finish Project Button */}
              <button
                onClick={handleFinishProject}
                disabled={loading}
                className="p-1.5 text-success hover:bg-success hover:bg-opacity-10 rounded-full transition-colors"
                title="Mark as Finished"
              >
                <FiCheck size={16} />
              </button>

              {/* Delete Project Button */}
              <button
                onClick={handleDeleteProject}
                disabled={loading}
                className="p-1.5 text-danger hover:bg-danger hover:bg-opacity-10 rounded-full transition-colors"
                title="Delete Project"
              >
                <FiTrash2 size={16} />
              </button>

              {/* More Options Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-text-secondary hover:bg-bg-primary rounded-full transition-colors"
                title="More Options"
              >
                <FiMoreVertical size={16} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-bg-primary border border-border rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={handleFinishProject}
                      disabled={loading}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-bg-secondary"
                    >
                      <FiCheck className="mr-2 text-success" />
                      Mark as Finished
                    </button>
                    <button
                      onClick={handleAddCollaborators}
                      disabled={loading}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-bg-secondary"
                    >
                      <FiUserPlus className="mr-2 text-accent" />
                      Add Collaborators
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      disabled={loading}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-bg-secondary text-danger"
                    >
                      <FiTrash2 className="mr-2" />
                      Delete Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leave Project Button - only visible to non-leaders */}
          {!isLeader && project.status !== "Finished" && (
            <button
              onClick={handleLeaveProject}
              disabled={loading}
              className="p-1.5 text-text-secondary hover:bg-bg-primary rounded-full transition-colors"
              title="Leave Project"
            >
              <FiLogOut size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{project.description}</p>

      {project.deadline && (
        <div className="flex items-center text-xs text-text-secondary mb-2">
          <FiClock className="mr-1" />
          <span>Deadline: {formatDate(project.deadline)}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        {project.status === "Finished" ? (
          <div className="flex items-center text-xs text-green-500">
            <FiCheckCircle className="mr-1" />
            <span>Finished</span>
          </div>
        ) : (
          <button onClick={() => navigate(`/projects/${project._id}`)} className="btn-primary btn-sm">
            View Project
          </button>
        )}

        <div className="text-xs text-text-secondary">
          {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Add Collaborators Modal */}
      {showCollaboratorsModal && (
        <AddCollaboratorsModal projectId={project._id} onClose={() => setShowCollaboratorsModal(false)} />
      )}
    </div>
  )
}

export default ProjectCard