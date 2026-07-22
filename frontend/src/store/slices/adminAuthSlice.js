import { createSlice } from '@reduxjs/toolkit'

// Rehydrate the persisted admin/staff user on load; corrupt/missing data just falls back to null
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('admin_user')) || null
  } catch {
    return null
  }
}

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('admin_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  loading: false,
  error: null,
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('admin_user', JSON.stringify(action.payload))
    },
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('admin_token', action.payload)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setUser, setToken, logout, setLoading, setError } = adminAuthSlice.actions
export default adminAuthSlice.reducer
