import type { WizardStepProps } from './stepTypes'

type BomberosKey =
  | 'bomberos_1ra'
  | 'bomberos_2da'
  | 'bomberos_3ra'
  | 'bomberos_4ta'
  | 'bomberos_5ta'
  | 'bomberos_6ta'

const COMPANIAS: readonly [BomberosKey, string][] = [
  ['bomberos_1ra', '1ra Compañía'],
  ['bomberos_2da', '2da Compañía'],
  ['bomberos_3ra', '3ra Compañía'],
  ['bomberos_4ta', '4ta Compañía'],
  ['bomberos_5ta', '5ta Compañía'],
  ['bomberos_6ta', '6ta Compañía'],
]

export function Paso7({ data, onChange }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">Observaciones y personal</h2>
      <div className="field">
        <label>Observaciones de la emergencia *</label>
        <textarea
          value={data.observaciones ?? ''}
          onChange={(e) => onChange({ observaciones: e.target.value })}
          placeholder="Novedades relevantes o sin novedad"
        />
      </div>
      <div className="field">
        <label>Emergencia de especialidad</label>
        <textarea
          value={data.emergencia_especialidad ?? ''}
          onChange={(e) => onChange({ emergencia_especialidad: e.target.value })}
        />
      </div>
      <h3 className="section-title">Bomberos en acto de servicio</h3>
      {COMPANIAS.map(([key, label]) => {
        const raw = data[key]
        const display = raw === null || raw === undefined ? '' : raw

        return (
          <div className="field" key={key}>
            <label>{label}</label>
            <input
              type="number"
              min={0}
              max={99}
              value={display}
              onChange={(e) =>
                onChange({
                  [key]: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>
        )
      })}
    </>
  )
}
