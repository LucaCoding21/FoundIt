'use client'

import { supabase } from './supabase'

// Admin auth using Supabase
export const isAdmin = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAdmin') === 'true'
}

export const login = async (email, password) => {
  // For now, only allow admin@sfu.ca with password admin123
  if (email === 'admin@sfu.ca' && password === 'admin123') {
    localStorage.setItem('isAdmin', 'true')
    return { success: true }
  }
  return { success: false, error: 'Invalid email or password' }
}

export const logout = () => {
  localStorage.removeItem('isAdmin')
}

