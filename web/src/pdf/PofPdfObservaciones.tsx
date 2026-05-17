import { Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { pdfStyles } from './pof-styles'
import { pdfTxt } from './pdfTxt'

export function PofPdfObservaciones({ vm }: { vm: ParteInformeVm }) {
  const p = vm.parte
  return (
    <View>
      <Text style={pdfStyles.section}>Observaciones</Text>
      <Text style={pdfStyles.multiline}>{pdfTxt(p.observaciones)}</Text>
      <Text style={pdfStyles.section}>Emergencia de especialidad</Text>
      <Text style={pdfStyles.multiline}>{pdfTxt(p.emergencia_especialidad)}</Text>
    </View>
  )
}
