import type { WizardStepProps } from './stepTypes'
import { Paso2Detalle } from './Paso2Detalle'
import { Paso2Head } from './Paso2Head'

export function Paso2(props: WizardStepProps) {
  return (
    <>
      <Paso2Head {...props} />
      <Paso2Detalle {...props} />
    </>
  )
}
