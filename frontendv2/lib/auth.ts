"use client"

import { apiClient } from "./apiClient"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth() {
  const router = useRouter()

  const checkAuth = () => {
    if (typeof window === 'undefined') return false
    return apiClient.isAuthenticated()
  }

  const requireAuth = () => {
    if (!checkAuth()) {
      router.push('/')
    }
  }

  return { checkAuth, requireAuth, logout: apiClient.logout.bind(apiClient) }
}

export function useRequireAuth() {
  const { requireAuth } = useAuth()
  
  useEffect(() => {
    requireAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

