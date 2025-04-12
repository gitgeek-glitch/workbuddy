"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FiPlus, FiFilter, FiSearch, FiClock, FiCheck } from "react-icons/fi"
import axios from "axios"
import { toast } from "react-toastify"
import { FiArrowLeft, FiMoreVertical, FiCalendar } from "react-icons/fi"
import { getProjects } from "../store/slices/projectSlice"
import ConfirmationDialog from "../components/ui/ConfirmationDialog"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

const TeamDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [members, setMembers] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmAction: null,
  })
  const menuRef = useRef(null)

  // Check if current user is a leader
  const isLeader = project?.members?.some((member) => member.userId._id === currentUser?.id && member.role === "Leader")

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
        const response = await axios.get(`${API_URL}/api/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setProject(response.data.data[0])
        setMembers(response.data.data[0].members)
      } catch (error) {
        console.error("Error fetching project details:", error)
        setError(error.response?.data?.message || "Failed to fetch project details")
        toast.error("Failed to fetch project details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProjectDetails()
    }
  }, [id])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle promoting member to co-leader
  const handlePromoteToColeader = (memberId, memberName) => {
    if (!isLeader) return

    setConfirmDialog({
      isOpen: true,
      title: "Promote to Co-Leader",
      message: `Are you sure you want to promote ${memberName} to Co-Leader? They will have additional permissions in the project.`,
      confirmAction: async () => {
        try {
          const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
          await axios.patch(
            `${API_URL}/api/project/${id}/members/${memberId}/role`,
            { role: "Co-Leader" },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          // Update local state
          setMembers((prevMembers) =>
            prevMembers.map((member) => (member.userId._id === memberId ? { ...member, role: "Co-Leader" } : member)),
          )

          toast.success(`${memberName} has been promoted to Co-Leader`)
          dispatch(getProjects())
        } catch (error) {
          console.error("Error promoting member:", error)
          toast.error(error.response?.data?.message || "Failed to promote member")
        }
      },
    })
  }

  // Handle demoting co-leader to member
  const handleDemoteToMember = (memberId, memberName) => {
    if (!isLeader) return

    setConfirmDialog({
      isOpen: true,
      title: "Demote to Member",
      message: `Are you sure you want to demote ${memberName} to Member? They will lose Co-Leader permissions.`,
      confirmAction: async () => {
        try {
          const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
          await axios.patch(
            `${API_URL}/api/project/${id}/members/${memberId}/role`,
            { role: "Member" },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          // Update local state
          setMembers((prevMembers) =>
            prevMembers.map((member) => (member.userId._id === memberId ? { ...member, role: "Member" } : member)),
          )

          toast.success(`${memberName} has been demoted to Member`)
          dispatch(getProjects())
        } catch (error) {
          console.error("Error demoting member:", error)
          toast.error(error.response?.data?.message || "Failed to demote member")
        }
      },
    })
  }

  // Handle removing a member
  const handleRemoveMember = (memberId, memberName) => {
    if (!isLeader) return

    setConfirmDialog({
      isOpen: true,
      title: "Remove Member",
      message: `Are you sure you want to remove ${memberName} from the project? This action cannot be undone.`,
      confirmAction: async () => {
        try {
          const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
          await axios.delete(`${API_URL}/api/project/${id}/members/${memberId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          // Update local state
          setMembers((prevMembers) => prevMembers.filter((member) => member.userId._id !== memberId))

          toast.success(`${memberName} has been removed from the project`)
          dispatch(getProjects())
        } catch (error) {
          console.error("Error removing member:", error)
          toast.error(error.response?.data?.message || "Failed to remove member")
        }
      },
    })
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Leader":
        return "text-green-500"
      case "Co-Leader":
        return "text-orange-500"
      default:
        return "text-black"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 my-4">Error: {error}</div>
  }

  if (!project) {
    return (
      <div className="bg-bg-secondary border border-border rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Project not found</h3>
        <button className="btn-primary mt-4" onClick={() => navigate("/team")}>
          Back to Team
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/team")}
          className="mr-4 p-2 rounded-full hover:bg-bg-primary transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{project.name} - Team</h1>
      </div>

      {/* Project info card */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6 mb-8 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-text-secondary mb-4">{project.description}</p>
            {project.deadline && project.status !== "Finished" && (
              <div className="flex items-center text-sm text-text-secondary">
                <FiCalendar className="mr-2" />
                <span>Deadline: {formatDate(project.deadline)}</span>
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-sm font-medium">Project Status</div>
            <div
              className={`mt-1 px-3 py-1 rounded-full inline-block text-sm flex items-center ${
                project.status === "Finished"
                  ? "text-green-500"
                  : "text-blue-500"
              }`}
            >
              {project.status === "Finished" ? (
                <FiCheck className="mr-1" />
              ) : (
                <FiClock className="mr-1" />
              )}
              {project.status}
            </div>
          </div>
        </div>
      </div>

      {/* Team members */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <div className="text-sm text-text-secondary">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-primary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Username</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Joined Date</th>
                {isLeader && <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.userId._id} className="hover:bg-bg-primary transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium">{member.userId.fullName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-text-secondary">@{member.userId.username}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                    {formatDate(member.userId.joinedDate)}
                  </td>
                  {isLeader && (
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {member.userId._id !== currentUser?.id && (
                        <div className="relative" ref={activeMenu === member.userId._id ? menuRef : null}>
                          <button
                            onClick={() => setActiveMenu(activeMenu === member.userId._id ? null : member.userId._id)}
                            className="p-2 text-text-secondary hover:bg-bg-primary rounded-lg transition-colors"
                          >
                            <FiMoreVertical size={16} />
                          </button>

                          {activeMenu === member.userId._id && (
                            <div className="absolute right-0 mt-1 w-48 bg-bg-secondary border border-border rounded-lg shadow-lg z-10">
                              <div className="py-1">
                                {member.role === "Member" && (
                                  <button
                                    onClick={() => handlePromoteToColeader(member.userId._id, member.userId.fullName)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-bg-primary"
                                  >
                                    Promote to Co-Leader
                                  </button>
                                )}
                                {member.role === "Co-Leader" && (
                                  <button
                                    onClick={() => handleDemoteToMember(member.userId._id, member.userId.fullName)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-bg-primary"
                                  >
                                    Demote to Member
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveMember(member.userId._id, member.userId.fullName)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-bg-primary text-danger"
                                >
                                  Remove from Project
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {members.length === 0 && <div className="text-center py-8 text-text-secondary">No team members found</div>}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <ConfirmationDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={() => {
            confirmDialog.confirmAction()
            setConfirmDialog({ isOpen: false, title: "", message: "", confirmAction: null })
          }}
          onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", confirmAction: null })}
        />
      )}
    </div>
  )
}

export default TeamDetails