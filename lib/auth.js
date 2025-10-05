'use client'

import { supabase } from './supabase'

// Admin auth using Supabase
export const isAdmin = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAdmin') === 'true'
}

export const login = async (email, password) => {
  // Demo credentials for judges and testing
  if (email === 'admin@sfu.ca' && password === '123admin') {
    localStorage.setItem('isAdmin', 'true')
    return { success: true }
  }
  return { success: false, error: 'Invalid email or password' }
}

export const logout = () => {
  localStorage.removeItem('isAdmin')
}

