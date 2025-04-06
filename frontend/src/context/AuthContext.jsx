import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      if (token) {
        try {          
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setUser(response.data.data[0].user)
        } catch (error) {
          console.error("Auth initialization error:", error)          
          localStorage.removeItem("authToken")
          sessionStorage.removeItem("authToken")
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    // Clear token from storage
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken")    
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

