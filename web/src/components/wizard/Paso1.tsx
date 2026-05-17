import type { WizardStepProps } from './stepTypes'

export function Paso1({ data, onChange, userEmail }: WizardStepProps) {
  return (
    <>
      <h2 className="section-title">Identificación</h2>
      <div className="field">
        <label>Correo (sesión)</label>
        <input type="email" value={userEmail ?? ''} disabled />
      </div>
      <div className="field">
        <label>Bombero que realiza POF *</label>
        <input
          value={data.bombero_que_realiza_pof ?? ''}
          onChange={(e) => onChange({ bombero_que_realiza_pof: e.target.value })}
          placeholder="Indique su nombre"
        />
      </div>
    </>
  )
}
