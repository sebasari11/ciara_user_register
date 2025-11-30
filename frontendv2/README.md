# CIARA Frontend - Next.js

Frontend moderno para el sistema CIARA de la Universidad de Cuenca, construido con Next.js 15, React, TypeScript, Tailwind CSS y shadcn/ui.

## Características

- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes UI basados en Radix
- **Dark/Light theme** con toggle
- **Paleta de colores UC**: Primary #002856, accent lacre (brick red)
- **Autenticación JWT** integrada con el backend existente
- **Rutas protegidas** con verificación de autenticación

## Estructura del Proyecto

```
frontendv2/
├── app/                    # App Router pages
│   ├── layout.tsx         # Layout principal con ThemeProvider
│   ├── page.tsx           # Página de autenticación (/)
│   ├── menu/              # Menú principal
│   ├── users/             # Gestión de usuarios
│   │   └── create/        # Crear usuario
│   └── reportes/          # Reportes de uso
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── auth-form.tsx      # Formulario de autenticación
│   ├── menu-card.tsx      # Tarjetas del menú
│   ├── theme-provider.tsx # Provider de temas
│   └── theme-toggle.tsx   # Toggle de tema
├── lib/
│   ├── apiClient.ts       # Cliente API centralizado
│   ├── auth.ts            # Helpers de autenticación
│   └── utils.ts           # Utilidades (cn function)
└── Dockerfile             # Docker para producción
```

## Instalación

```bash
cd frontendv2
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

## Build para Producción

```bash
npm run build
npm start
```

## Docker

### Build

```bash
docker build -t ciara-frontend .
```

### Run

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE=http://your-backend:4000/api \
  ciara-frontend
```

## Nginx

### Configuración para `/ciara` path

El frontend está configurado para funcionar bajo el path `/ciara` mediante nginx.

**Opción 1: Location block (recomendado)**

Agrega el contenido de `nginx-ciara-location.conf` a tu bloque `server` principal en nginx:

```nginx
server {
    # ... tu configuración existente ...
    
    # Incluir la configuración de CIARA
    include /path/to/nginx-ciara-location.conf;
    
    # O copiar directamente el contenido de nginx-ciara-location.conf aquí
}
```

**Opción 2: Server block independiente**

Usa `nginx.conf` como un server block completo (ajusta `server_name` según tu dominio).

**Importante:**
- Nginx hace un `rewrite` para remover el prefijo `/ciara` antes de enviar la petición a Next.js
- Next.js NO necesita configuración de `basePath` porque nginx maneja el prefijo
- Los assets estáticos (`/_next/static`) se manejan automáticamente
- Asegúrate de que el backend también esté configurado bajo `/ciara` si es necesario

## Rutas

- `/` - Autenticación (Login/Register)
- `/menu` - Menú principal (protegida)
- `/users` - Lista de usuarios (protegida)
- `/users/create` - Crear usuario (protegida)
- `/reportes` - Reportes de uso (protegida)

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- next-themes
- lucide-react

## Colores UC

- **Primary**: #002856 (Azul oscuro UC)
- **Accent/Destructive**: #B71C1C (Lacre/brick red)
- **Background**: Variantes oscuras basadas en #002856
- **Foreground**: Blanco

## Notas

- Todas las rutas excepto `/` requieren autenticación
- El JWT se almacena en `localStorage`
- El backend debe estar corriendo en el puerto configurado en `NEXT_PUBLIC_API_BASE`

