import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"

export const signupUser = createAsyncThunk("user/signup", async (signupData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/signup`, signupData)
    const { token, user } = response.data.data[0]

    // Normalize user data
    const normalizedUser = {
      id: user._id || user.id,
      fullName: user.fullName || user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || user.photoURL || "",
      role: user.role || "User",
      bio: user.bio || "",
      joinedDate: user.joinedDate || new Date().toLocaleDateString(),
      // Include any other fields from user model that you want to use in the frontend
    }

    localStorage.setItem("authToken", token)

    return normalizedUser
  } catch (error) {
    // Return the error message from the server
    return rejectWithValue(error.response?.data?.message || "Signup failed. Please try again.")
  }
})

// Async thunks for user actions
export const loginUser = createAsyncThunk("user/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/signin`, {
      email: credentials.email,
      password: credentials.password,
    })

    const { token, user } = response.data.data[0]

    console.log("Login response user data:", user)

    // Normalize user data
    const normalizedUser = {
      id: user._id || user.id,
      fullName: user.fullName || user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || user.photoURL || "",
      role: user.role || "User",
      bio: user.bio || "",
      joinedDate: user.joinedDate || new Date().toLocaleDateString(),
      // Include any other fields from user model that you want to use in the frontend
    }

    // Store token appropriately
    if (credentials.rememberMe) {
      localStorage.setItem("authToken", token)
    } else {
      sessionStorage.setItem("authToken", token)
    }

    return normalizedUser
  } catch (error) {
    // Return the error message from the server
    return rejectWithValue(error.response?.data?.message || "An error occurred during login. Please try again.")
  }
})

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    // Remove tokens
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken")
    return null
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const checkAuthState = createAsyncThunk("user/checkAuth", async (_, { rejectWithValue }) => {
  try {
    // Check for token in localStorage or sessionStorage
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

    if (!token) {
      return null
    }

    // Validate token with backend
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data.data
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem("authToken")
      sessionStorage.removeItem("authToken")
      return null
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const oauthLogin = createAsyncThunk("user/oauthLogin", async (userData, { rejectWithValue }) => {
  try {
    console.log("OAuth login data received:", userData)

    // The userData should already be normalized by the OAuthCallback component
    // Just ensure we have all required fields with fallbacks
    const normalizedUser = {
      id: userData.id || userData.sub || userData._id || `user-${Date.now()}`,
      name: userData.name || userData.fullName || userData.displayName || userData.given_name || "",
      email: userData.email || "",
      avatar: userData.picture || userData.photoURL || userData.avatar || "",
      provider: userData.provider || "oauth",
      role: userData.role || "User",
      bio: userData.bio || "",
      joinDate: userData.joinDate || new Date().toLocaleDateString(),
    }

    // Handle token
    const token = userData.token || userData.credential || userData.access_token || `oauth-token-${Date.now()}`
    localStorage.setItem("authToken", token)

    console.log("Normalized user data:", normalizedUser)
    return normalizedUser
  } catch (error) {
    console.error("OAuth login error:", error)
    return rejectWithValue(error.message)
  }
})

export const updateUserProfile = createAsyncThunk("user/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    // Get token from storage
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    // Use the API function to update the profile
    const response = await updateProfile(profileData)
    return response
  } catch (error) {
    // If the API call fails, just update the local state
    // This is temporary until your backend is set up
    return profileData

    // Once your API is ready, use this instead:
    // return rejectWithValue(error.response?.data?.message || "Failed to update profile")
  }
})

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Local state update without API call
    updateUserProfileLocal: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null
        state.isAuthenticated = false
      })
      // Check Auth State
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // OAuth Login
      .addCase(oauthLogin.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = { ...state.currentUser, ...action.payload }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { updateUserProfileLocal, clearError } = userSlice.actions

export default userSlice.reducer

