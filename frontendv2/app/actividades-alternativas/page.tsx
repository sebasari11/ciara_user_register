"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient, type ActividadAlternativa } from "@/lib/apiClient"
import { useRequireAuth } from "@/lib/auth"
import { ArrowLeft, ArrowUpDown } from "lucide-react"

export default function ActividadesAlternativasPage() {
  useRequireAuth()
  const router = useRouter()
  const [actividades, setActividades] = useState<ActividadAlternativa[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<string>("horaActual")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  useEffect(() => {
    loadActividades()
  }, [search, sortBy, sortOrder, pagination.page])

  const loadActividades = async () => {
    setLoading(true)
    const result = await apiClient.loadActividadesAlternativas({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
      sortBy,
      sortOrder,
    })
    if (result.success && result.actividades) {
      setActividades(result.actividades)
      if (result.pagination) {
        setPagination(result.pagination)
      }
    }
    setLoading(false)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const formatDate = (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Actividades Alternativas</h1>
            <p className="text-muted-foreground">Consultas y respuestas de Gemini</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Actividades</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPagination((p) => ({ ...p, page: 1 }))
                  }}
                  className="max-w-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("horaActual")}
                >
                  Hora <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("emailUser")}
                >
                  Email <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : actividades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron actividades alternativas
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email Usuario</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Prompt</TableHead>
                        <TableHead>Respuesta Gemini</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actividades.map((actividad) => (
                        <TableRow key={actividad._id}>
                          <TableCell className="font-medium">{actividad.emailUser}</TableCell>
                          <TableCell>{formatDate(actividad.horaActual)}</TableCell>
                          <TableCell className="max-w-md">
                            <div className="text-sm">
                              {truncateText(actividad.promptConsultaGemini, 150)}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="text-sm">
                              {truncateText(actividad.respuestaConsultaGemini, 150)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {((pagination.page - 1) * pagination.limit) + 1}-
                      {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

