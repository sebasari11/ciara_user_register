"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/apiClient"
import { useRequireAuth } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"

export default function CreateUserPage() {
  useRequireAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    cedula: "",
    edad: "",
    genero: "",
    so: "",
    movilidad: "",
    tiempoDiario: "",
    universidad: "",
    carrera: "",
    telefono: "",
  })
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "email") {
      setEmailError("")
    }
  }

  const checkEmail = async (email: string) => {
    if (!email) return
    setCheckingEmail(true)
    const result = await apiClient.checkEmailExists(email)
    if (result.success && result.exists) {
      setEmailError("Este email ya está registrado")
    } else {
      setEmailError("")
    }
    setCheckingEmail(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (emailError) {
      setError("Por favor, corrige el email antes de continuar")
      return
    }

    setLoading(true)
    try {
      const result = await apiClient.saveUserRegister({
        email: formData.email,
        cedula: formData.cedula,
        edad: parseInt(formData.edad),
        genero: formData.genero,
        so: formData.so,
        movilidad: formData.movilidad,
        tiempoDiario: formData.tiempoDiario,
        universidad: formData.universidad,
        carrera: formData.carrera,
        telefono: formData.telefono,
      })

      if (result.success) {
        router.push("/users")
      } else {
        setError(result.error || "Error al crear usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nuevo Usuario</h1>
            <p className="text-muted-foreground">Registrar un nuevo usuario</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos del Usuario</CardTitle>
            <CardDescription>Complete todos los campos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={(e) => checkEmail(e.target.value)}
                    required
                  />
                  {checkingEmail && <p className="text-xs text-muted-foreground">Verificando...</p>}
                  {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula *</Label>
                  <Input
                    id="cedula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edad">Edad *</Label>
                  <Input
                    id="edad"
                    name="edad"
                    type="number"
                    value={formData.edad}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="so">Sistema Operativo *</Label>
                  <Input
                    id="so"
                    name="so"
                    value={formData.so}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="movilidad">Movilidad *</Label>
                  <Input
                    id="movilidad"
                    name="movilidad"
                    value={formData.movilidad}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempoDiario">Tiempo Diario *</Label>
                  <Input
                    id="tiempoDiario"
                    name="tiempoDiario"
                    value={formData.tiempoDiario}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universidad">Universidad *</Label>
                  <Input
                    id="universidad"
                    name="universidad"
                    value={formData.universidad}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrera">Carrera *</Label>
                  <Input
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/users")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !!emailError}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

