"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiGithub } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import axios from "axios"
import { debounce } from "lodash"
import { signupUser } from "../store/slices/userSlice"
import ThemeToggle from "../components/ui/ThemeToggle"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.user)

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

  // Create a debounced function for checking username availability
  const checkUsernameAvailability = debounce(async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "",
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
      // Create signup data
      const signupData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }

      // Dispatch signup action
      await dispatch(signupUser(signupData)).unwrap()

      // Redirect to dashboard
      navigate("/")
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.response?.data?.message || "An error occurred during registration. Please try again.")
    }
  }

  const handleOAuthSignup = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary pb-12 pt-12">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-text-secondary">Join our team collaboration platform</p>
          </div>

          {error && (
            <div className="bg-danger bg-opacity-10 border border-danger text-danger px-4 py-3 rounded-md mb-4">
              {error}
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
                    : usernameStatus.available === false
                      ? "border-red-500"
                      : ""
                }`}
                placeholder="johndoe"
                disabled={loading}
              />
              {usernameStatus.checking && <p className="text-sm text-text-secondary mt-1">Checking availability...</p>}
              {!usernameStatus.checking && usernameStatus.message && (
                <p className={`text-sm mt-1 ${usernameStatus.available ? "text-green-600" : "text-red-600"}`}>
                  {usernameStatus.message}
                </p>
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
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input w-full"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input w-full"
                placeholder="••••••••"
                disabled={loading}
              />
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
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-bg-secondary"
                onClick={() => handleOAuthSignup("github")}
                disabled={loading}
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