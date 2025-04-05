"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { oauthLogin } from "../store/slices/userSlice"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const OAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get token from URL query params
      const searchParams = new URLSearchParams(location.search)
      const token = searchParams.get("token")
      const errorParam = searchParams.get("error")

      if (errorParam) {
        setError("Authentication failed. Please try again.")
        setIsLoading(false)
        return
      }

      if (!token) {
        console.error("No token found in callback URL")
        setError("No authentication token received")
        setIsLoading(false)
        return
      }

      try {
        // Store token in localStorage
        localStorage.setItem("authToken", token)

        // Get user info using the token
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Get user data
        const user = response.data.data[0].user

        // Login user with Redux
        await dispatch(oauthLogin({ token, user })).unwrap()

        // Show success message
        navigate("/", {
          state: {
            successMessage: "Successfully logged in with " + (searchParams.get("provider") || "social account"),
          },
        })
      } catch (error) {
        console.error("Error in OAuth callback:", error)
        setError("Failed to authenticate. Please try again.")
        setIsLoading(false)
      }
    }

    handleOAuthCallback()
  }, [location, dispatch, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing your login...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
      </div>
    </div>
  )
}

export default OAuthCallback