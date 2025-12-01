"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiClient, type UserRegister } from "@/lib/apiClient"
import { useRequireAuth } from "@/lib/auth"
import { Plus, ArrowLeft, Trash2 } from "lucide-react"

export default function UsersPage() {
  useRequireAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserRegister[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserRegister | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [search, pagination.page])

  const loadUsers = async () => {
    setLoading(true)
    const result = await apiClient.loadUserRegisters({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
    })
    if (result.success && result.registers) {
      setUsers(result.registers)
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

  const handleDeleteClick = (user: UserRegister) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete?.email) return

    setDeleting(true)
    const result = await apiClient.deleteUserRegister(userToDelete.email)
    
    if (result.success) {
      // Remove the user from the list
      setUsers(users.filter((u) => u._id !== userToDelete._id))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      
      // If we're on the last page and it becomes empty, go to previous page
      if (users.length === 1 && pagination.page > 1) {
        setPagination((p) => ({ ...p, page: p.page - 1 }))
      } else {
        // Reload to refresh pagination info
        loadUsers()
      }
    } else {
      alert(result.error || "Error al eliminar usuario")
    }
    setDeleting(false)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
              <p className="text-muted-foreground">Administrar usuarios registrados</p>
            </div>
          </div>
          <Link href="/users/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Usuarios</CardTitle>
              <Input
                placeholder="Buscar por email, cédula, universidad..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron usuarios
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Género</TableHead>
                      <TableHead>Universidad</TableHead>
                      <TableHead>Carrera</TableHead>
                      <TableHead>SO</TableHead>
                      <TableHead>Tiempo Diario</TableHead>
                      <TableHead>Movilidad</TableHead>
                      <TableHead className="w-[100px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.cedula}</TableCell>
                        <TableCell>{user.edad}</TableCell>
                        <TableCell>{user.genero}</TableCell>
                        <TableCell>{user.universidad}</TableCell>
                        <TableCell>{user.carrera}</TableCell>
                        <TableCell>{user.so}</TableCell>
                        <TableCell>{user.tiempoDiario}</TableCell>
                        <TableCell>{user.movilidad}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Está seguro de que desea eliminar el usuario{" "}
                <span className="font-semibold">{userToDelete?.email}</span>?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

