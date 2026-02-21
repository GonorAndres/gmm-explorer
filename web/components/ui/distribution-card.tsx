interface DistributionItem {
  nombre: string
  color: string
  valor: number
  pct: number
}

interface DistributionCardProps {
  etiqueta: string
  items: DistributionItem[]
}

/**
 * Tarjeta de distribución con lista de items coloreados
 * Usada para distribución por nivel y por sexo
 */
export function DistributionCard({ etiqueta, items }: DistributionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <p className="text-sm text-slate-500 mb-3">{etiqueta}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.nombre} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-600 flex-1">{item.nombre}</span>
            <span className="text-xs font-medium text-slate-900">
              {item.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
