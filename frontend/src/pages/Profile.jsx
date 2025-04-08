"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FiUser, FiMail, FiLock, FiEdit2 } from "react-icons/fi"
import { toast } from "react-toastify"

import { updateUserProfile } from "../store/slices/userSlice"

const Profile = () => {
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated, loading } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data based on currentUser
  const [formData, setFormData] = useState({
    name: "",    
    bio: "",
    role: "",
    skills: [],
    school: ""
  })

  // Update formData when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.fullName,        
        bio: currentUser.bio || "",        
        role: currentUser.role || "",
        skills: currentUser.skills || [],        
        school: currentUser.school || ""
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
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-primary"
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
        </div>
      </div>
    )
  }

  // Check if we're authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Not Logged In</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="btn-secondary flex items-center" disabled={isSubmitting}>
          <FiEdit2 className="mr-1" /> {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-5">
          <div className="flex-shrink-0">
            <img
              src={currentUser?.avatar || "/placeholder.svg?height=128&width=128"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover bg-gray-100"
            />
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input w-full"
                    disabled={isSubmitting}
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input w-full"
                    disabled={isSubmitting}
                    readOnly={currentUser.provider === "google"} // Make email read-only for OAuth users
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="input w-full"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">School</label>
                <textarea
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  rows={4}
                  className="input w-full"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleChange}
                  rows={4}
                  className="input w-full"
                  disabled={isSubmitting}
                ></textarea>
              </div> */}

              <button type="submit" className="btn-primary flex items-center justify-center" disabled={isSubmitting}>
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
              <h2 className="text-xl font-semibold mb-1">
                {currentUser?.fullName}
              </h2>
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
                <p>{currentUser?.bio || "No bio provided yet."}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-text-secondary mb-1">School</h3>
                <p>{currentUser?.school || "No School details provided yet."}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-text-secondary mb-1">Skills</h3>
                <p>{currentUser?.skills?.join(", ") || "No skills provided yet."}</p>
              </div>

              {currentUser?.skills && currentUser.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-bg-primary">
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

      {/* <div className="card">
        <h2 className="text-lg font-semibold mb-4">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiLock className="mr-2" />
              <span>Password</span>
            </div>
            <button className="btn-secondary text-sm">Change Password</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiUser className="mr-2" />
              <span>Two-Factor Authentication</span>
            </div>
            <button className="btn-secondary text-sm">Enable</button>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Profile