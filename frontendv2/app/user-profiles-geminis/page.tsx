"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { apiClient, type UserProfileGeminis } from "@/lib/apiClient"
import { useRequireAuth } from "@/lib/auth"
import { ArrowLeft, Trash2, Plus, Eye } from "lucide-react"

const MAX_TEXT_LENGTH = 100

export default function UserProfilesGeminisPage() {
  useRequireAuth()
  const router = useRouter()
  const [profiles, setProfiles] = useState<UserProfileGeminis[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<UserProfileGeminis | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingProfile, setViewingProfile] = useState<UserProfileGeminis | null>(null)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    email: "",
    respuestaGemini: "",
  })
  const [createError, setCreateError] = useState("")

  useEffect(() => {
    loadProfiles()
  }, [pagination.page])

  const loadProfiles = async () => {
    setLoading(true)
    const result = await apiClient.loadUserProfileGeminis({
      page: pagination.page,
      limit: pagination.limit,
    })
    if (result.success && result.profiles) {
      setProfiles(result.profiles)
      if (result.pagination) {
        setPagination(result.pagination)
      }
    }
    setLoading(false)
  }

  const handleDeleteClick = (profile: UserProfileGeminis) => {
    setProfileToDelete(profile)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!profileToDelete?.email) return

    setDeleting(true)
    const result = await apiClient.deleteUserProfileGeminis(profileToDelete.email)
    setDeleting(false)

    if (result.success) {
      setDeleteDialogOpen(false)
      setProfileToDelete(null)
      // Remove from list or reload
      setProfiles(profiles.filter((p) => p.email !== profileToDelete.email))
      // If we're on the last page and it becomes empty, go to previous page
      if (profiles.length === 1 && pagination.page > 1) {
        setPagination((p) => ({ ...p, page: p.page - 1 }))
      } else {
        await loadProfiles()
      }
    } else {
      alert(result.error || "Error al eliminar perfil")
    }
  }

  const handleCreateClick = () => {
    setCreateForm({ email: "", respuestaGemini: "" })
    setCreateError("")
    setCreateDialogOpen(true)
  }

  const handleCreateConfirm = async () => {
    if (!createForm.email.trim()) {
      setCreateError("El email es requerido")
      return
    }

    setCreating(true)
    setCreateError("")
    const result = await apiClient.createUserProfileGeminis({
      email: createForm.email.trim(),
      respuestaGemini: createForm.respuestaGemini.trim() || undefined,
    })
    setCreating(false)

    if (result.success) {
      setCreateDialogOpen(false)
      setCreateForm({ email: "", respuestaGemini: "" })
      setCreateError("")
      await loadProfiles()
    } else {
      setCreateError(result.error || "Error al crear perfil")
    }
  }

  const handleViewClick = (profile: UserProfileGeminis) => {
    setViewingProfile(profile)
    setViewDialogOpen(true)
  }

  const truncateText = (text: string | undefined): string => {
    if (!text) return "Sin respuesta"
    if (text.length <= MAX_TEXT_LENGTH) return text
    return text.substring(0, MAX_TEXT_LENGTH) + "..."
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
              <h1 className="text-3xl font-bold">Perfiles Geminis</h1>
              <p className="text-muted-foreground">Gestión de perfiles de usuarios generados por Gemini</p>
            </div>
          </div>
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Perfil
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perfiles</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando...</div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron perfiles
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Respuesta Gemini</TableHead>
                        <TableHead className="w-[200px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile._id || profile.email}>
                          <TableCell className="font-medium">{profile.email}</TableCell>
                          <TableCell>
                            <div className="max-w-md">
                              <p className="text-sm">{truncateText(profile.respuestaGemini)}</p>
                              {profile.respuestaGemini && profile.respuestaGemini.length > MAX_TEXT_LENGTH && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto mt-1"
                                  onClick={() => handleViewClick(profile)}
                                >
                                  Ver completo
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {profile.respuestaGemini && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewClick(profile)}
                                  title="Ver respuesta completa"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(profile)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar el perfil de Gemini del usuario{" "}
                <span className="font-semibold">{profileToDelete?.email}</span>?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setProfileToDelete(null)
                }}
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

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Perfil Gemini</DialogTitle>
              <DialogDescription>
                Crea un nuevo perfil de Gemini para un usuario. El email debe estar registrado en el sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-email">Email *</Label>
                <Input
                  id="create-email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={createForm.email}
                  onChange={(e) => {
                    setCreateForm((f) => ({ ...f, email: e.target.value }))
                    setCreateError("")
                  }}
                  disabled={creating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-respuesta">Respuesta Gemini (opcional)</Label>
                <textarea
                  id="create-respuesta"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ingresa la respuesta de Gemini..."
                  value={createForm.respuestaGemini}
                  onChange={(e) => {
                    setCreateForm((f) => ({ ...f, respuestaGemini: e.target.value }))
                    setCreateError("")
                  }}
                  disabled={creating}
                />
              </div>
              {createError && (
                <p className="text-sm text-destructive">{createError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false)
                  setCreateForm({ email: "", respuestaGemini: "" })
                  setCreateError("")
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateConfirm}
                disabled={creating || !createForm.email.trim()}
              >
                {creating ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Full Text Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Respuesta Gemini - {viewingProfile?.email}</DialogTitle>
              <DialogDescription>
                Respuesta completa generada por Gemini
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md border p-4 bg-muted/50 max-h-[400px] overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">
                  {viewingProfile?.respuestaGemini || "Sin respuesta"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

