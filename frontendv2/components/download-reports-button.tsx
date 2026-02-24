"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

interface DownloadReportsButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function DownloadReportsButton({ 
  className, 
  variant = "default",
  size = "default"
}: DownloadReportsButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.downloadReportesCSV()
      
      if (!result.success) {
        setError(result.error || "Error al descargar el archivo")
      }
    } catch (err) {
      setError("Error inesperado al descargar el archivo")
      console.error("Error downloading CSV:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleDownload}
        disabled={loading}
        variant={variant}
        size={size}
        className={className}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Descargando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Descargar CSV
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
