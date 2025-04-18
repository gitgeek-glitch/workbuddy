import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get stored token
const getStoredToken = () => localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

// Helper function to set token with axios defaults
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const signupUser = createAsyncThunk("user/signup", async (signupData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/signup`, signupData)
    const { token, user } = response.data.data[0]
    
    // Store token and set axios defaults
    localStorage.setItem("authToken", token)
    setAuthToken(token);
    
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
    }

    return { user: normalizedUser, token };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Signup failed. Please try again.")
  }
})

export const loginUser = createAsyncThunk("user/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/signin`, {
      email: credentials.email,
      password: credentials.password,
    })

    const { token, user } = response.data.data[0]

    // Store token appropriately
    if (credentials.rememberMe) {
      localStorage.setItem("authToken", token)
    } else {
      sessionStorage.setItem("authToken", token)
    }
    
    // Set token for axios requests
    setAuthToken(token);

    // Normalize user data
    const normalizedUser = {
      id: user._id || user.id,
      fullName: user.fullName || user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || user.photoURL || "",
      role: user.role || "User",
      bio: user.bio || "",
      school: user.school || "",
      joinedDate: user.joinedDate || new Date().toLocaleDateString(),
    }

    return { user: normalizedUser, token };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "An error occurred during login. Please try again.")
  }
})

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    // Remove tokens
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken")
    
    // Remove authorization header
    setAuthToken(null);
    
    return null
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const checkAuthState = createAsyncThunk("user/checkAuth", async (_, { rejectWithValue }) => {
  try {
    // Check for token in localStorage or sessionStorage
    const token = getStoredToken();

    if (!token) {
      return null;
    }

    // Set token for axios requests
    setAuthToken(token);

    // Validate token with backend
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return { user: response.data.data, token };
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem("authToken")
      sessionStorage.removeItem("authToken")
      setAuthToken(null);
      return null;
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const oauthLogin = createAsyncThunk("user/oauthLogin", async (userData, { rejectWithValue }) => {
  try {
    // The userData should already be normalized by the OAuthCallback component
    // Just ensure we have all required fields with fallbacks
    const normalizedUser = {
      id: userData.id,
      fullName: userData.name,
      email: userData.email || "",
      avatar: userData.avatar,
      provider: userData.provider || "oauth",
      role: "",
      bio: userData.bio || "",
      school: userData.school || "",
      joinDate: userData.joinDate || new Date().toLocaleDateString(),
    }

    // Handle token
    const token = userData.token || userData.credential || userData.access_token || `oauth-token-${Date.now()}`
    localStorage.setItem("authToken", token)
    setAuthToken(token);

    return { user: normalizedUser, token };
  } catch (error) {
    console.error("OAuth login error:", error)
    return rejectWithValue(error.message)
  }
})

export const updateUserProfile = createAsyncThunk("user/updateProfile", async (profileData, { rejectWithValue, getState }) => {
  try {
    // Get token from state
    const token = getState().user.token;

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    const response = await axios.patch(`${API_URL}/api/user/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { user } = response.data.data[0];

    // Normalize user data
    const normalizedUser = {
      id: user._id || user.id,
      fullName: user.fullName || user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || user.photoURL || "",
      role: user.role || "User",
      bio: user.bio || "",
      school: user.school || "",
      joinedDate: user.joinedDate || new Date().toLocaleDateString(),
    }

    return normalizedUser;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update profile")
  }
})

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: getStoredToken() // Initialize with stored token
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
        state.currentUser = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null
        state.isAuthenticated = false
        state.token = null
      })
      // Check Auth State
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.currentUser = action.payload.user
          state.isAuthenticated = true
          state.token = action.payload.token
        } else {
          state.currentUser = null
          state.isAuthenticated = false
          state.token = null
        }
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.token = null
      })
      // OAuth Login
      .addCase(oauthLogin.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload.user
        state.isAuthenticated = true
        state.token = action.payload.token
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.token = action.payload.token
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