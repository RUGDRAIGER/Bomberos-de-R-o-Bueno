import type { WizardStepProps } from './stepTypes'

export function Paso3({ data, onChange }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">OBAC — Mando</h2>
      <p className="hint">Oficial o Bombero(a) a cargo del servicio</p>
      <div className="field">
        <label>¿Quién estuvo a cargo de la emergencia? *</label>
        <div className="radio-row">
          {(['OFICIAL', 'BOMBERO'] as const).map((t) => (
            <label key={t}>
              <input
                type="radio"
                name="tipo_mando"
                checked={data.tipo_mando === t}
                onChange={() =>
                  onChange({
                    tipo_mando: t,
                    oficial_cargo_id: undefined,
                    bombero_compania_id: undefined,
                    bombero_nombre_a_cargo: undefined,
                  })
                }
              />
              {t === 'BOMBERO' ? 'BOMBERO(A)' : 'OFICIAL'}
            </label>
          ))}
        </div>
      </div>
    </>
  )
}
