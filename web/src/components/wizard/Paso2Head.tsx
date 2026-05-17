import type { WizardStepProps } from './stepTypes'

export function Paso2Head({ data, onChange, tipos = [] }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">Emergencias</h2>
      <div className="field">
        <label>Fecha de la emergencia *</label>
        <input
          type="date"
          value={data.fecha_emergencia ?? ''}
          onChange={(e) => onChange({ fecha_emergencia: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Tipo de emergencia *</label>
        <select
          value={data.tipo_emergencia_id ?? ''}
          onChange={(e) =>
            onChange({ tipo_emergencia_id: e.target.value ? Number(e.target.value) : undefined })
          }
        >
          <option value="">Seleccione...</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.codigo} — {t.descripcion}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Hora de inicio (despacho) *</label>
        <input
          type="time"
          value={data.hora_inicio ?? ''}
          onChange={(e) => onChange({ hora_inicio: e.target.value })}
        />
        <p className="hint">Hora del despacho (AM/PM según dispositivo)</p>
      </div>
      <div className="field">
        <label>Hora llegada primera unidad (6-3) *</label>
        <input
          type="time"
          value={data.hora_llegada_primera_unidad ?? ''}
          onChange={(e) => onChange({ hora_llegada_primera_unidad: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Hora término (6-7) *</label>
        <input
          type="time"
          value={data.hora_termino ?? ''}
          onChange={(e) => onChange({ hora_termino: e.target.value })}
        />
      </div>
    </>
  )
}
