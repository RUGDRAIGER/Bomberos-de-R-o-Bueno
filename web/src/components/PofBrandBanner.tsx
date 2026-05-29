type Props = {
  compact?: boolean
  className?: string
}

const logoUrl = `${import.meta.env.BASE_URL}pof-logo.svg`

export function PofBrandBanner({ compact, className = '' }: Props) {
  return (
    <div className={`pof-brand${compact ? ' pof-brand--compact' : ''}${className ? ` ${className}` : ''}`}>
      <img src={logoUrl} alt="" className="pof-brand-logo" width={compact ? 40 : 52} height={compact ? 40 : 52} />
      <div className="pof-brand-text">
        <h1 className="pof-brand-title">Parte de Operaciones Finales 2026</h1>
        {!compact ? (
          <p className="pof-brand-subtitle">Cuerpo de Bomberos de Río Bueno — Comandancia</p>
        ) : null}
      </div>
    </div>
  )
}
