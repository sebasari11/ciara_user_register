import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText } from "lucide-react"

interface MenuCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export function MenuCard({ title, description, href, icon }: MenuCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

export function MenuCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      <MenuCard
        title="Gestión de Usuarios"
        description="Administrar usuarios registrados"
        href="/users"
        icon={<Users className="h-6 w-6" />}
      />
      <MenuCard
        title="Reportes de Uso"
        description="Ver reportes de uso de aplicaciones"
        href="/reportes"
        icon={<FileText className="h-6 w-6" />}
      />
    </div>
  )
}

