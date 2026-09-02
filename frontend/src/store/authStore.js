import { create } from 'zustand'

const TOKEN_KEY = 'pokemanager_token'
const USERNAME_KEY = 'pokemanager_username'

const useAuthStore = create((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  username: localStorage.getItem(USERNAME_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),

  login: (token, username) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USERNAME_KEY, username)
    set({ token, username, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
    set({ token: null, username: null, isAuthenticated: false })
  },
}))

export default useAuthStore