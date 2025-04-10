"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiGithub, FiArrowLeft } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import { debounce } from "lodash"
import axios from "axios"
import { signupUser } from "../store/slices/userSlice"
import ThemeToggle from "../components/ui/ThemeToggle"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error: reduxError } = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [error, setError] = useState("")
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  // Create a debounced function for checking username availability
  const checkUsernameAvailability = debounce(async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: username ? "Username must be at least 3 characters long" : "",
      })
      return
    }

    setUsernameStatus((prev) => ({ ...prev, checking: true }))

    try {
      const response = await axios.get(`${API_URL}/auth/check-username?username=${encodeURIComponent(username)}`)
      const { available, message } = response.data

      setUsernameStatus({
        checking: false,
        available,
        message,
      })
    } catch (error) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "Error checking username",
      })
    }
  }, 500)

  useEffect(() => {
    if (formData.username) {
      checkUsernameAvailability(formData.username)
    }

    return () => {
      checkUsernameAvailability.cancel()
    }
  }, [formData.username])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    // Username length validation
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return
    }

    // Password length validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    if (usernameStatus.available === false) {
      setError("Please choose a different username")
      return
    }

    try {
      const signupData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }

      // Dispatch signup action
      const resultAction = await dispatch(signupUser(signupData))

      // Check if the action was fulfilled or rejected
      if (signupUser.fulfilled.match(resultAction)) {
        navigate("/dashboard")
      } else if (signupUser.rejected.match(resultAction)) {
        setError(resultAction.payload || "An error occurred during registration")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.response?.data?.message || "An error occurred during registration. Please try again.")
    }
  }

  const handleOAuthSignup = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}`
  }

  // Display either the local error state or the Redux error
  const displayError = error || reduxError

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <div className="flex justify-between p-4">
        <Link to="/" className="flex items-center text-text-secondary hover:text-accent transition-colors">
          <FiArrowLeft className="mr-1" />
          Back to Home
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-text-secondary">Join our team collaboration platform</p>
          </div>

          {displayError && (
            <div className="bg-danger bg-opacity-10 border border-danger text-danger px-4 py-3 rounded-md mb-4">
              {displayError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="input w-full"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`input w-full ${
                  usernameStatus.available === true
                    ? "border-green-500"
                    : usernameStatus.available === false || (formData.username && formData.username.length < 3)
                      ? "border-red-500"
                      : ""
                }`}
                placeholder="Minimum 3 characters"
                disabled={loading}
              />
              {usernameStatus.checking && <p className="text-sm text-text-secondary mt-1">Checking availability...</p>}
              {!usernameStatus.checking && usernameStatus.message && (
                <p className={`text-sm mt-1 ${usernameStatus.available ? "text-green-600" : "text-red-600"}`}>
                  {usernameStatus.message}
                </p>
              )}
              {!usernameStatus.checking &&
                !usernameStatus.message &&
                formData.username &&
                formData.username.length < 3 && (
                  <p className="text-xs text-red-500 mt-1">Username must be at least 3 characters long</p>
                )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input w-full"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input w-full ${formData.password && formData.password.length < 8 ? "border-red-500" : ""}`}
                  placeholder="Minimum 8 characters"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formData.password && formData.password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters long</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input w-full ${
                    formData.confirmPassword && formData.confirmPassword !== formData.password ? "border-red-500" : ""
                  }`}
                  placeholder="Minimum 8 characters"
                  disabled={loading}
                />
              </div>
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                disabled={loading}
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={loading}>
              {loading ? (
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
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-primary text-text-secondary">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-bg-secondary"
                onClick={() => handleOAuthSignup("google")}
                disabled={loading}
                type="button"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-bg-secondary"
                onClick={() => handleOAuthSignup("github")}
                disabled={loading}
                type="button"
              >
                <FiGithub className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup