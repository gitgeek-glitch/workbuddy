"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import axios from "axios"
import { getProjects } from "../store/slices/projectSlice"
import ConfirmationDialog from "../components/ui/ConfirmationDialog"
import { 
  FiArrowLeft, 
  FiMoreHorizontal, 
  FiCalendar, 
  FiClock, 
  FiCheck, 
  FiUsers, 
  FiStar,
  FiArrowUp,
  FiArrowDown,
  FiUserX
} from "react-icons/fi"

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

  // Check user roles
  const isLeader = project?.members?.some(
    (member) => member.userId._id === currentUser?.id && member.role === "Leader"
  )
  const isCoLeader = project?.members?.some(
    (member) => member.userId._id === currentUser?.id && member.role === "Co-Leader"
  )

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
    if (!isLeader && !isCoLeader) return

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

  // Handle demoting co-leader to member (only Leader can do this)
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

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Finished":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "In Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "Planning":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
    }
  }

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Leader":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
      case "Co-Leader":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700"
    }
  }

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  // Get random color for avatar based on string
  const getAvatarColor = (string) => {
    const colors = [
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    ];
    
    const stringValue = string ? string.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[stringValue % colors.length];
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 my-4 shadow-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        Error: {error}
      </div>
    )
  }

  if (!project) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center shadow-sm">
        <h3 className="text-lg font-medium mb-2">Project not found</h3>
        <button 
          className="mt-4 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors"
          onClick={() => navigate("/team")}
        >
          Back to Team
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/team")}
          className="mr-4 p-2 rounded-full hover:bg-bg-primary transition-colors flex items-center justify-center bg-bg-secondary border border-border"
          aria-label="Back to team"
        >
          <FiArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold">{project.name}</h1>
      </div>

      {/* Project info card */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6 mb-8 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex-1">
            <div className="flex items-center mb-2">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                {project.important && <FiStar className="ml-2 text-yellow-500" size={18} />}
            </div>
            <p className="text-text-secondary mb-4 max-w-3xl">{project.description}</p>
            </div>
            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-start lg:items-end">
            {/* Status badge moved here - to extreme right */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                {project.status === "Finished" ? (
                <span className="flex items-center">
                    <FiCheck className="mr-1" size={12} />
                    {project.status}
                </span>
                ) : (
                <span className="flex items-center">
                    <FiClock className="mr-1" size={12} />
                    {project.status}
                </span>
                )}
            </span>
            
            {/* Deadline info below status badge for ongoing projects */}
            {project.deadline && project.status !== "Finished" && (
                <div className="flex items-center text-sm text-text-secondary mt-2">
                <FiCalendar className="mr-2" />
                <span>Deadline: {formatDate(project.deadline)}</span>
                </div>
            )}
            
            {/* Team members count below other info */}
            <div className="flex items-center text-sm text-text-secondary mt-2">
                <FiUsers className="mr-2" />
                <span>{members.length} team member{members.length !== 1 ? "s" : ""}</span>
            </div>
            </div>
        </div>
        </div>

      {/* Team members */}
      <div className="bg-bg-secondary border border-border rounded-xl shadow-sm transition-all hover:shadow-md">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="text-sm text-text-secondary bg-bg-primary px-3 py-1 rounded-full">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="p-6">
          {members.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <FiUsers size={48} className="mx-auto mb-4 text-text-secondary" />
              <p>No team members found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {members.map((member) => (
                <div 
                  key={member.userId._id} 
                  className="bg-bg-primary border border-border rounded-xl p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold ${getAvatarColor(member.userId.fullName)}`}>
                        {getInitials(member.userId.fullName)}
                      </div>
                      <div>
                        <div className="font-medium">{member.userId.fullName}</div>
                        <div className="text-sm text-text-secondary">@{member.userId.username}</div>
                      </div>
                    </div>
                    
                    {(isLeader || isCoLeader) && member.userId._id !== currentUser?.id && (
                      <div className="relative" ref={activeMenu === member.userId._id ? menuRef : null}>
                        <button
                          onClick={() => setActiveMenu(activeMenu === member.userId._id ? null : member.userId._id)}
                          className="p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary rounded-lg transition-colors"
                          aria-label="Member options"
                        >
                          <FiMoreHorizontal size={16} />
                        </button>

                        {activeMenu === member.userId._id && (
                          <div className="absolute right-0 mt-1 w-48 bg-bg-secondary border border-border rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              {/* Only show promote option if member is not already a Leader */}
                              {member.role === "Member" && (isLeader || isCoLeader) && (
                                <button
                                  onClick={() => handlePromoteToColeader(member.userId._id, member.userId.fullName)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-bg-primary text-text-primary flex items-center"
                                >
                                  <FiArrowUp className="mr-2 text-green-500" size={14} />
                                  Promote to Co-Leader
                                </button>
                              )}
                              {/* Only Leader can demote Co-Leader */}
                              {member.role === "Co-Leader" && isLeader && (
                                <button
                                  onClick={() => handleDemoteToMember(member.userId._id, member.userId.fullName)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-bg-primary text-text-primary flex items-center"
                                >
                                  <FiArrowDown className="mr-2 text-orange-500" size={14} />
                                  Demote to Member
                                </button>
                              )}
                              {/* Only Leader can remove members */}
                              {isLeader && (
                                <button
                                  onClick={() => handleRemoveMember(member.userId._id, member.userId.fullName)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-bg-primary text-danger flex items-center"
                                >
                                  <FiUserX className="mr-2" size={14} />
                                  Remove from Project
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeClass(member.role)}`}>
                      {member.role}
                    </span>
                    <div className="text-xs text-text-secondary">
                      Joined {formatDate(member.userId.joinedDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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