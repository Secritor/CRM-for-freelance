import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  users: { email: string; password: string; name: string }[]
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  users: [
    { email: 'admin@admin', password: '12345', name: 'Admin' },
  ],
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string; password: string }>) {
      const { email, password } = action.payload
      const user = state.users.find(u => u.email === email && u.password === password)
      if (user) {
        state.isAuthenticated = true
        state.user = { email: user.email, name: user.name }
      }
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
    },
    register(state, action: PayloadAction<{ email: string; password: string }>) {
      const { email, password } = action.payload
      const exists = state.users.some(u => u.email === email)
      if (!exists) {
        state.users.push({ email, password, name: email.split('@')[0] })
      }
    },
  },
})

export const { login, logout, register } = authSlice.actions
export default authSlice.reducer
