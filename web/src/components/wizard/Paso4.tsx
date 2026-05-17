import type { WizardStepProps } from './stepTypes'

export function Paso4({ data, onChange, cargos = [] }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">Oficiales</h2>
      <div className="field">
        <label>Oficial a cargo de la emergencia *</label>
        <select
          value={data.oficial_cargo_id ?? ''}
          onChange={(e) =>
            onChange({
              oficial_cargo_id: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">Seleccione...</option>
          {cargos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
