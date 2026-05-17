import { useParteWizard } from '../hooks/useParteWizard'
import { WizardShell } from '../components/WizardShell'

export function ParteWizardPage() {
  const w = useParteWizard()

  return (
    <WizardShell
      paso={w.paso}
      totalPasos={w.totalPasos}
      error={w.error}
      saving={w.saving}
      stepProps={w.stepProps}
      onPrev={w.irAtras}
      onNext={w.guardarPaso}
      onSubmit={w.enviar}
    />
  )
}
