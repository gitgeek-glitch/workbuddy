"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiGithub } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import { toast } from "react-toastify"
import { loginUser } from "../store/slices/userSlice"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error: reduxError } = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {    
    
    e.preventDefault() // Prevent default form submission
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      // Dispatch login action and get the result
      const resultAction = await dispatch(loginUser(formData))

      // Check if the action was fulfilled or rejected
      console.log("Hi")
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!")
        navigate("/dashboard")
      } else if (loginUser.rejected.match(resultAction)) {
        // Set error from the payload
        console.log(resultAction.payload);
        
        setError(resultAction.payload || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      setError(error?.message || "Login failed. Please check your credentials.")
    }
  }

  const handleOAuthLogin = (provider) => {
    // Store the current URL to redirect back after OAuth
    localStorage.setItem("authRedirect", window.location.pathname)

    // Open OAuth provider authorization in the same window
    window.location.href = `${API_URL}/auth/${provider}`
  }

  // Display either the local error state or the Redux error
  const displayError = error || reduxError

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <div className="flex justify-end p-4">{/* ThemeToggle component would be here */}</div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-text-secondary">Sign in to your account</p>
          </div>

          {displayError && (
            <div className="bg-danger bg-opacity-10 border border-danger text-white px-4 py-3 rounded-md mb-4">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
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

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm">
                Remember me
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
                  Signing in...
                </>
              ) : (
                "Sign in"
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
                onClick={() => handleOAuthLogin("google")}
                disabled={loading}
                type="button"
              >
                <FcGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-bg-secondary"
                onClick={() => handleOAuthLogin("github")}
                disabled={loading}
                type="button"
              >
                <FiGithub className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

