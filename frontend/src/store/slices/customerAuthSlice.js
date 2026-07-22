import { createSlice } from '@reduxjs/toolkit'

// Rehydrate the persisted customer user on load; corrupt/missing data just falls back to null
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('customer_user')) || null
  } catch {
    return null
  }
}

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('customer_token'),
  isAuthenticated: !!localStorage.getItem('customer_token'),
  loading: false,
  error: null,
}

const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('customer_user', JSON.stringify(action.payload))
    },
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('customer_token', action.payload)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setUser, setToken, logout, setLoading, setError } = customerAuthSlice.actions
export default customerAuthSlice.reducer
