import type { WizardStepProps } from './stepTypes'

export function Paso5({ data, onChange, companias = [] }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">Bombero(a) a cargo</h2>
      <div className="field">
        <label>Compañía *</label>
        <select
          value={data.bombero_compania_id ?? ''}
          onChange={(e) =>
            onChange({
              bombero_compania_id: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">Seleccione...</option>
          {companias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Nombre del bombero/a a cargo *</label>
        <input
          value={data.bombero_nombre_a_cargo ?? ''}
          onChange={(e) => onChange({ bombero_nombre_a_cargo: e.target.value })}
          placeholder="Nombre + dos apellidos"
        />
      </div>
    </>
  )
}
