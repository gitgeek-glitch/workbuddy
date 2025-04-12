"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FiUser, FiMail, FiLock, FiEdit2 } from "react-icons/fi"
import { toast } from "react-toastify"
import { updateUserProfile, checkAuthState } from "../store/slices/userSlice"

const Profile = () => {
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated, loading } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize form data based on currentUser
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    role: "",
    skills: [],
    school: "",
  })

  // Ensure user data is loaded
  useEffect(() => {
    if (!currentUser && isAuthenticated) {
      dispatch(checkAuthState())
    } else if (currentUser && !isInitialized) {
      setIsInitialized(true)
    }
  }, [currentUser, isAuthenticated, dispatch, isInitialized])

  // Update formData when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        bio: currentUser.bio || "",
        role: currentUser.role || "",
        skills: currentUser.skills || [],
        school: currentUser.school || "",
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await dispatch(updateUserProfile(formData)).unwrap()
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if still loading
  if (loading || !isInitialized) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-bg-secondary border border-border rounded-xl p-6 flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-accent"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    )
  }

  // Check if we're authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Not Logged In</h2>
          <p className="text-text-secondary">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary flex items-center"
          disabled={isSubmitting}
        >
          <FiEdit2 className="mr-1" /> {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl mb-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-5">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-bg-primary border-2 border-accent">
              <img
                src={currentUser?.avatar || "/placeholder.svg?height=128&width=128"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-secondary">Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-text-secondary">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-text-secondary">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-text-secondary">School</label>
                <textarea
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          ) : (
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{currentUser?.fullName}</h2>
              <div className="flex items-center text-text-secondary mb-4">
                <FiMail className="mr-1" />
                <span>{currentUser?.email || ""}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">Role</h3>
                  <p>{currentUser?.role || "User"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">Joined</h3>
                  <p>{currentUser?.joinDate || new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-text-secondary mb-1">Bio</h3>
                <p className="bg-bg-primary p-3 rounded-lg">{currentUser?.bio || "No bio provided yet."}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-text-secondary mb-1">School</h3>
                <p className="bg-bg-primary p-3 rounded-lg">
                  {currentUser?.school || "No School details provided yet."}
                </p>
              </div>

              {currentUser?.skills && currentUser.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-bg-primary border border-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl p-5 animate-in fade-in duration-300">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-bg-primary rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center mr-3">
                <FiMail className="text-accent" />
              </div>
              <span>Email</span>
            </div>
            <button className="btn-secondary text-sm">Change Email</button>
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-bg-primary rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center mr-3">
                <FiLock className="text-accent" />
              </div>
              <span>Password</span>
            </div>
            <button className="btn-secondary text-sm">Change Password</button>
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-bg-primary rounded-lg transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center mr-3">
                <FiUser className="text-accent" />
              </div>
              <span>Two-Factor Authentication</span>
            </div>
            <button className="btn-secondary text-sm">Enable</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
