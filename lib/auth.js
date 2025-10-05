'use client'

// Simple admin auth using localStorage
export const isAdmin = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAdmin') === 'true'
}

export const login = (password) => {
  // Simple password check - in production use proper auth
  if (password === 'admin123') {
    localStorage.setItem('isAdmin', 'true')
    return true
  }
  return false
}

export const logout = () => {
  localStorage.removeItem('isAdmin')
}

