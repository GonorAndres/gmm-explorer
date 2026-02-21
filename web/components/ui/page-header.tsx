import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  titulo: string
  subtitulo: string
  icono?: LucideIcon
}

/**
 * Encabezado de página con gradiente corporativo
 * Reemplaza los 5 headers duplicados en cada página
 */
export function PageHeader({ titulo, subtitulo, icono: Icono }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {Icono && (
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Icono className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
          <p className="text-slate-500 mt-0.5 text-sm">{subtitulo}</p>
        </div>
      </div>
    </div>
  )
}
