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
  const isLast = paso >= totalPasos

  return (
    <div className="card">
      <div className="wizard-header">
        <p className="wizard-meta">
          Comandancia Cuerpo de Bomberos de Río Bueno — Edición N°02 Enero 2026
        </p>
        <div className="wizard-progress" role="progressbar" aria-valuenow={paso} aria-valuemax={totalPasos}>
          {Array.from({ length: totalPasos }, (_, i) => (
            <span
              key={i}
              className={i + 1 < paso ? 'done' : i + 1 === paso ? 'active' : ''}
            />
          ))}
        </div>
        <p className="wizard-step-label">Paso {paso} de {totalPasos}</p>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {child}

      <div className="wizard-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onPrev}
          disabled={paso === 1 || saving}
        >
          ← Anterior
        </button>

        {isLast ? (
          <button
            type="button"
            className="btn btn-success"
            onClick={onSubmit}
            disabled={saving}
          >
            {saving ? 'Enviando…' : '✓ Enviar POF'}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNext}
            disabled={saving}
          >
            {saving ? 'Guardando…' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  )
}
