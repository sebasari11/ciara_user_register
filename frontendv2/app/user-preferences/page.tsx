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
import { apiClient, type UserPreferences } from "@/lib/apiClient"
import { useRequireAuth } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"

export default function UserPreferencesPage() {
  useRequireAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<UserPreferences[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  useEffect(() => {
    loadPreferences()
  }, [search, pagination.page])

  const loadPreferences = async () => {
    setLoading(true)
    const result = await apiClient.loadUserPreferences({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
    })
    if (result.success && result.preferences) {
      setPreferences(result.preferences)
      if (result.pagination) {
        setPagination(result.pagination)
      }
    }
    setLoading(false)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPagination((p) => ({ ...p, page: 1 }))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Preferencias de Usuarios</h1>
            <p className="text-muted-foreground">Gestión de preferencias de usuarios</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Preferencias</CardTitle>
              <Input
                placeholder="Buscar por email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : preferences.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron preferencias
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Horario Clases</TableHead>
                        <TableHead>Mascota</TableHead>
                        <TableHead>Responsabilidades en Casa</TableHead>
                        <TableHead>Espacio Ordenado</TableHead>
                        <TableHead>Actividades Aire Libre</TableHead>
                        <TableHead>Actividades en Casa</TableHead>
                        <TableHead>Motivación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preferences.map((pref) => (
                        <TableRow key={pref._id || pref.email}>
                          <TableCell className="font-medium">{pref.email}</TableCell>
                          <TableCell>{pref.periodo}</TableCell>
                          <TableCell>{pref.horarioClases}</TableCell>
                          <TableCell>{pref.mascota}</TableCell>
                          <TableCell>{pref.responsabilidadesEnCasa}</TableCell>
                          <TableCell>{pref.espacioOrdenado}</TableCell>
                          <TableCell>{pref.actividadesAireLibre}</TableCell>
                          <TableCell>{pref.actividadesEnCasa}</TableCell>
                          <TableCell>{pref.motivacion}</TableCell>
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

