import type { WizardStepProps } from './stepTypes'
import { SiNoField } from './SiNoField'

export function Paso6({ data, onChange }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">Otras instituciones</h2>
      <SiNoField label="SAMU (1-2)" value={data.samu ?? undefined} onChange={(v) => onChange({ samu: v })} />
      <SiNoField
        label="Carabineros 1-0"
        value={data.carabineros ?? undefined}
        onChange={(v) => onChange({ carabineros: v })}
      />
      <SiNoField label="CONAF (1-5)" value={data.conaf ?? undefined} onChange={(v) => onChange({ conaf: v })} />
      <SiNoField
        label="Otros cuerpos de bomberos"
        value={data.otros_cb ?? undefined}
        onChange={(v) => onChange({ otros_cb: v, otros_cb_nombre: v === 'NO' ? '' : data.otros_cb_nombre })}
      />
      {data.otros_cb === 'SI' && (
        <div className="field">
          <label>Nombre del otro CB *</label>
          <input
            value={data.otros_cb_nombre ?? ''}
            onChange={(e) => onChange({ otros_cb_nombre: e.target.value })}
          />
        </div>
      )}
      <SiNoField label="SENAPRED" value={data.senapred ?? undefined} onChange={(v) => onChange({ senapred: v })} />
      <div className="field">
        <label>Empresas externas</label>
        <input
          value={data.empresas_externas ?? ''}
          onChange={(e) => onChange({ empresas_externas: e.target.value })}
          placeholder="Nombre de la empresa (opcional)"
        />
      </div>
    </>
  )
}
