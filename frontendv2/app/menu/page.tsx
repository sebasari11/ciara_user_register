"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MenuCards } from "@/components/menu-card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiClient } from "@/lib/apiClient"
import { LogOut } from "lucide-react"

export default function MenuPage() {
  const router = useRouter()

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    apiClient.logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">CIARA</h1>
            <p className="text-muted-foreground">Universidad de Cuenca</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <MenuCards />
      </div>
    </div>
  )
}

