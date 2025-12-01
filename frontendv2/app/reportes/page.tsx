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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { apiClient, type Reporte } from "@/lib/apiClient"
import { useRequireAuth } from "@/lib/auth"
import { ArrowLeft, ArrowUpDown, Trash2 } from "lucide-react"

export default function ReportesPage() {
  useRequireAuth()
  const router = useRouter()
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<"fecha" | "email">("fecha")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reporteToDelete, setReporteToDelete] = useState<Reporte | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [adminPwd, setAdminPwd] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    loadReportes()
  }, [search, sortBy, sortOrder, pagination.page])

  const loadReportes = async () => {
    setLoading(true)
    const result = await apiClient.loadReportes({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
      sortBy,
      sortOrder,
    })
    if (result.success && result.reportes) {
      setReportes(result.reportes)
      if (result.pagination) {
        setPagination(result.pagination)
      }
    }
    setLoading(false)
  }

  const handleSort = (field: "fecha" | "email") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setPagination((p) => ({ ...p, page: 1 }))
  }

  const handleDeleteClick = (reporte: Reporte) => {
    setReporteToDelete(reporte)
    setAdminPwd("")
    setPasswordError("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!reporteToDelete?._id) return

    if (!adminPwd.trim()) {
      setPasswordError("Por favor ingresa la contraseña de administrador")
      return
    }

    setPasswordError("")
    setDeleting(true)
    
    const result = await apiClient.deleteReporte(reporteToDelete._id, adminPwd)
    setDeleting(false)

    if (result.success) {
      setDeleteDialogOpen(false)
      setReporteToDelete(null)
      setAdminPwd("")
      setPasswordError("")
      // Reload reportes
      await loadReportes()
    } else {
      setPasswordError(result.error || "Error al eliminar el reporte")
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(false)
      setReporteToDelete(null)
      setAdminPwd("")
      setPasswordError("")
    }
  }

  const formatDate = (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  const renderPackages = (reporte: Reporte) => {
    const packages = []
    for (let i = 1; i <= 5; i++) {
      const packageName = reporte[`packageName${i}` as keyof Reporte] as string
      const tiempo = reporte[`tiempoUso${i}` as keyof Reporte] as number
      if (packageName && tiempo) {
        packages.push(
          <div key={i} className="text-sm py-1 border-b last:border-0">
            <span className="font-medium">{packageName}</span>: {formatTime(tiempo)}
          </div>
        )
      }
    }
    return packages.length > 0 ? (
      <div className="max-w-md">{packages}</div>
    ) : (
      <span className="text-muted-foreground text-sm">Sin aplicaciones</span>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Reportes de Uso</h1>
            <p className="text-muted-foreground">Reportes de uso de aplicaciones</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Reportes</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por email, fecha, mayor consumo..."
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
                  onClick={() => handleSort("fecha")}
                >
                  Fecha <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("email")}
                >
                  Email <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : reportes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron reportes
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mayor Consumo</TableHead>
                        <TableHead>Aplicaciones y Tiempo de Uso</TableHead>
                        <TableHead className="w-[100px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportes.map((reporte) => (
                        <TableRow key={reporte._id || `${reporte.email}-${reporte.fecha}`}>
                          <TableCell>{formatDate(reporte.fecha)}</TableCell>
                          <TableCell>{reporte.email}</TableCell>
                          <TableCell>{reporte.mayorConsumo}</TableCell>
                          <TableCell>{renderPackages(reporte)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(reporte)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      <Dialog open={deleteDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el reporte del usuario{" "}
              <strong>{reporteToDelete?.email}</strong> del{" "}
              <strong>{reporteToDelete ? formatDate(reporteToDelete.fecha) : ""}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-pwd">Contraseña de administrador</Label>
              <Input
                id="admin-pwd"
                type="password"
                placeholder="Ingresa la contraseña de administrador"
                value={adminPwd}
                onChange={(e) => {
                  setAdminPwd(e.target.value)
                  setPasswordError("")
                }}
                disabled={deleting}
                className={passwordError ? "border-destructive" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !deleting && adminPwd.trim()) {
                    handleDeleteConfirm()
                  }
                }}
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting || !adminPwd.trim()}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

