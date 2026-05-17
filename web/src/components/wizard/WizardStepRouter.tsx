import { Paso1 } from './Paso1'
import { Paso2 } from './Paso2'
import { Paso3 } from './Paso3'
import { Paso4 } from './Paso4'
import { Paso5 } from './Paso5'
import { Paso6 } from './Paso6'
import { Paso7 } from './Paso7'
import { Paso8 } from './Paso8'
import type { WizardStepProps } from './stepTypes'

export function WizardStepRouter({ paso, props }: { paso: number; props: WizardStepProps }) {
  switch (paso) {
    case 1:
      return <Paso1 {...props} />
    case 2:
      return <Paso2 {...props} />
    case 3:
      return <Paso3 {...props} />
    case 4:
      return <Paso4 {...props} />
    case 5:
      return <Paso5 {...props} />
    case 6:
      return <Paso6 {...props} />
    case 7:
      return <Paso7 {...props} />
    case 8:
      return <Paso8 {...props} />
    default:
      return null
  }
}
