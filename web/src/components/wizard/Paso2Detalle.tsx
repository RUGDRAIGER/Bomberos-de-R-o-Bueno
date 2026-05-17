import type { WizardStepProps } from './stepTypes'

export function Paso2Detalle({ data, onChange }: WizardStepProps) {
  return (
    <>
      <div className="field">
        <label>Área de intervención *</label>
        <div className="radio-row">
          {(['URBANO', 'RURAL', 'Otra Comuna'] as const).map((a) => (
            <label key={a}>
              <input
                type="radio"
                name="area"
                checked={data.area_intervencion === a}
                onChange={() => onChange({ area_intervencion: a })}
              />
              {a}
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Dirección de la emergencia *</label>
        <input
          value={data.direccion_emergencia ?? ''}
          onChange={(e) => onChange({ direccion_emergencia: e.target.value })}
          placeholder="Dirección exacta del servicio"
        />
      </div>
      <div className="field">
        <label>Origen de la emergencia *</label>
        <textarea
          value={data.origen_emergencia ?? ''}
          onChange={(e) => onChange({ origen_emergencia: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Causa de la emergencia *</label>
        <textarea
          value={data.causa_emergencia ?? ''}
          onChange={(e) => onChange({ causa_emergencia: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Breve descripción del trabajo realizado *</label>
        <textarea
          value={data.descripcion_trabajo ?? ''}
          onChange={(e) => onChange({ descripcion_trabajo: e.target.value })}
        />
      </div>
    </>
  )
}
