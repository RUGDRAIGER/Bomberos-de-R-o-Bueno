import type { WizardStepProps } from './stepTypes'

export function Paso8({ data, onChange, materiales = [] }: WizardStepProps) {
  const ids = data.material_ids ?? []

  function toggle(id: number) {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    onChange({ material_ids: next })
  }

  return (
    <>
      <h2 className="section-title">Material mayor concurrente</h2>
      <div className="checkbox-grid">
        {materiales.map((m) => (
          <label key={m.id}>
            <input type="checkbox" checked={ids.includes(m.id)} onChange={() => toggle(m.id)} />
            <span>
              <strong>{m.codigo}</strong> — {m.descripcion}
            </span>
          </label>
        ))}
      </div>
      <div className="field">
        <label>Otro material</label>
        <input
          value={data.material_otro ?? ''}
          onChange={(e) => onChange({ material_otro: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Móviles de otros cuerpos de bomberos</label>
        <textarea
          value={data.moviles_otros_cb ?? ''}
          onChange={(e) => onChange({ moviles_otros_cb: e.target.value })}
        />
      </div>
    </>
  )
}
