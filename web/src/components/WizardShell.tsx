import type { ReactNode } from 'react'
import { WizardStepRouter } from './wizard'
import type { WizardStepProps } from './wizard/stepTypes'

export function WizardShell({
  paso,
  totalPasos,
  error,
  saving,
  stepProps,
  onPrev,
  onNext,
  onSubmit,
}: {
  paso: number
  totalPasos: number
  error: string | null
  saving: boolean
  stepProps: WizardStepProps
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}) {
  const child: ReactNode = <WizardStepRouter paso={paso} props={stepProps} />

  return (
    <div className="card">
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>
        Comandancia Cuerpo de Bomberos de Río Bueno — Edición N°02 Enero 2026
      </p>
      <div className="wizard-progress">
        {Array.from({ length: totalPasos }, (_, i) => (
          <span
            key={i}
            className={i + 1 < paso ? 'done' : i + 1 === paso ? 'active' : ''}
          />
        ))}
      </div>
      <p style={{ margin: '0 0 1rem' }}>
        Paso {paso} de {totalPasos}
      </p>
      {error && <div className="alert alert-error">{error}</div>}
      {child}
      <div className="wizard-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrev}
          disabled={paso === 1 || saving}
        >
          Anterior
        </button>
        {paso < totalPasos ? (
          <button type="button" className="btn btn-primary" onClick={onNext} disabled={saving}>
            {saving ? 'Guardando...' : 'Siguiente'}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={saving}>
            {saving ? 'Enviando...' : 'Enviar POF'}
          </button>
        )}
      </div>
    </div>
  )
}
