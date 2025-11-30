"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { apiClient } from "@/lib/apiClient"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    if (apiClient.isAuthenticated()) {
      router.push("/menu")
    }
  }, [router])

  return <AuthForm />
}

