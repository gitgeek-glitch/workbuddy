"use client"

import { useState, useRef, useEffect } from "react"
import { FiSearch, FiUser, FiPlus, FiX, FiUserPlus } from "react-icons/fi"
import axios from "axios"
import { toast } from "react-toastify"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

const AddCollaboratorsModal = ({ projectId, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const searchRef = useRef(null)
  const modalRef = useRef(null)

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debounce
    if (value.trim()) {
      const timeout = setTimeout(() => {
        searchUsers(value)
      }, 300) // 300ms debounce
      setSearchTimeout(timeout)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  // Search users API call
  const searchUsers = async (query) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      const response = await axios.get(`${API_URL}/api/user/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Filter out users that are already selected
      const filteredResults = response.data.data.filter(
        (user) => !selectedUsers.some((selected) => selected._id === user._id),
      )

      setSearchResults(filteredResults)
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Failed to search users. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Add user to selected list
  const addUser = (user) => {
    // Check if maximum users reached (7 total)
    if (selectedUsers.length >= 7) {
      toast.warning("Maximum of 7 collaborators can be added")
      return
    }

    // Check if user is already selected
    if (selectedUsers.some((selected) => selected._id === user._id)) {
      return
    }

    setSelectedUsers([...selectedUsers, user])
    setSearchResults(searchResults.filter((result) => result._id !== user._id))
    setSearchTerm("")
  }

  // Remove user from selected list
  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user to invite")
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      // Prepare data for API
      const usernames = selectedUsers.map((user) => user.username)

      // Invite members API call
      await axios.post(
        `${API_URL}/api/project/${projectId}/invite`,
        { usernames },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      toast.success(`Successfully invited ${selectedUsers.length} user(s) to the project`)
      onClose()
    } catch (error) {
      console.error("Error inviting users:", error)
      toast.error(error.response?.data?.message || "Failed to invite users. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent-dark p-4 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">Add Collaborators</h2>
          <p className="text-white/80 text-sm mt-1">Invite team members to your project</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Search Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Search Users ({selectedUsers.length}/7)</label>
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-bg-secondary border border-border rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="Search by username or name"
              />
              <FiSearch className="absolute left-3 top-2.5 text-text-secondary" size={18} />

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="p-3 hover:bg-bg-secondary cursor-pointer flex items-center justify-between border-b border-border last:border-0"
                      onClick={() => addUser(user)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                          <FiUser className="text-accent" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.fullName}</p>
                          <p className="text-xs text-text-secondary">@{user.username}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-accent hover:text-accent-dark bg-accent bg-opacity-10 hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          addUser(user)
                        }}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="absolute z-10 mt-1 w-full bg-bg-primary border border-border rounded-md shadow-lg p-4 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent mx-auto"></div>
                  <p className="mt-2 text-sm">Searching users...</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Users */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Selected Users:</h3>
            {selectedUsers.length > 0 ? (
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-bg-secondary border border-border rounded-lg py-2 px-3"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mr-2">
                        <FiUser className="text-accent" size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-text-secondary">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUser(user._id)}
                      className="text-text-secondary hover:text-danger bg-bg-primary hover:bg-danger hover:bg-opacity-10 rounded-full p-1.5 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-bg-secondary border border-border rounded-lg p-4 text-center">
                <p className="text-sm text-text-secondary">No users selected</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isSubmitting || selectedUsers.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Inviting...
                </>
              ) : (
                <>
                  <FiUserPlus className="mr-2" /> Invite Users
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCollaboratorsModal