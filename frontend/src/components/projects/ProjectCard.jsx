"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FiCheckCircle,
  FiClock,
  FiStar,
  FiTrash2,
  FiCheck,
  FiMoreVertical,
  FiUserPlus,
  FiLogOut,
  FiRefreshCw,
} from "react-icons/fi"
import {
  updateProject,
  deleteProjectAsync,
  leaveProjectAsync,
  toggleProjectImportant,
} from "../../store/slices/projectSlice"
import AddCollaboratorsModal from "./AddCollaboratorsModal"
import ConfirmationDialog from "../ui/ConfirmationDialog"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmAction: null,
  })

  // Check if current user is the project leader
  const isLeader = project.members?.some((member) => member.userId._id === currentUser?.id && member.role === "Leader")

  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Handle finishing a project
  const handleFinishProject = async () => {
    if (!isLeader) return

    setConfirmDialog({
      isOpen: true,
      title: "Mark Project as Finished",
      message: `Are you sure you want to mark "${project.name}" as finished? All members will be notified.`,
      confirmAction: async () => {
        setLoading(true)
        try {
          dispatch(
            updateProject({
              id: project._id,
              projectData: { status: "Finished" },
            }),
          )
        } catch (error) {
          console.error("Error finishing project:", error)
        } finally {
          setLoading(false)
          setMenuOpen(false)
        }
      },
    })
  }

  // Handle restoring a finished project to ongoing
  const handleRestoreProject = async () => {
    if (!isLeader) return

    setConfirmDialog({
      isOpen: true,
      title: "Restore Project",
      message: `Are you sure you want to move "${project.name}" back to ongoing projects? All members will be notified.`,
      confirmAction: async () => {
        setLoading(true)
        try {
          dispatch(
            updateProject({
              id: project._id,
              projectData: { status: "Active" },
            }),
          )
        } catch (error) {
          console.error("Error restoring project:", error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  // Handle deleting a project
  const handleDeleteProject = async () => {
    if (!isLeader) return

    setConfirmDialog({
      isOpen: true,
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.name}"? This action cannot be undone and all members will be notified.`,
      confirmAction: async () => {
        setLoading(true)
        try {
          dispatch(deleteProjectAsync(project._id))
        } catch (error) {
          console.error("Error deleting project:", error)
        } finally {
          setLoading(false)
          setMenuOpen(false)
        }
      },
    })
  }

  // Handle leaving a project
  const handleLeaveProject = async () => {
    if (isLeader) {
      return
    }

    setConfirmDialog({
      isOpen: true,
      title: "Leave Project",
      message: `Are you sure you want to leave "${project.name}"?`,
      confirmAction: async () => {
        setLoading(true)
        try {
          dispatch(leaveProjectAsync(project._id))
        } catch (error) {
          console.error("Error leaving project:", error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  // Handle toggling important status
  const handleToggleImportant = () => {
    if (project.status === "Finished") return
    dispatch(toggleProjectImportant(project._id))
  }

  // Handle adding collaborators
  const handleAddCollaborators = () => {
    if (!isLeader) return
    setShowCollaboratorsModal(true)
    setMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest(".project-menu")) {
        setMenuOpen(false)
      }
    }

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
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          {project.status !== "Finished" && (
            <button
              onClick={handleToggleImportant}
              className="ml-1 p-1 hover:bg-bg-primary rounded-full transition-colors"
              title={project.important ? "Remove from important" : "Mark as important"}
            >
              <FiStar
                className={`w-4 h-4 ${project.important ? "text-warning fill-warning" : "text-text-secondary"}`}
              />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {/* Project actions */}
          {isLeader && (
            <div className="relative project-menu">
              {project.status === "Finished" ? (
                <>
                  {/* Restore Project Button */}
                  <button
                    onClick={handleRestoreProject}
                    disabled={loading}
                    className="p-1.5 text-accent hover:bg-accent hover:bg-opacity-10 rounded-full transition-colors"
                    title="Move to Ongoing"
                  >
                    <FiRefreshCw size={16} />
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
                </>
              ) : (
                <>
                  {/* Mark as Finished Button */}
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
                </>
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

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <ConfirmationDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={() => {
            confirmDialog.confirmAction()
            setConfirmDialog({ ...confirmDialog, isOpen: false })
          }}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
      )}
    </div>
  )
}

export default ProjectCard