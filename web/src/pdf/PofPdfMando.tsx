import { Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { PdfRow } from './PdfRow'
import { pdfStyles } from './pof-styles'

export function PofPdfMando({ vm }: { vm: ParteInformeVm }) {
  const p = vm.parte
  return (
    <View>
      <Text style={pdfStyles.section}>Mando (OBAC)</Text>
      <PdfRow label="Tipo mando" value={p.tipo_mando} />
      <PdfRow label="Oficial a cargo" value={vm.oficialCargoNombre} />
      <PdfRow label="Compañía bombero" value={vm.companiaNombre} />
      <PdfRow label="Nombre bombero a cargo" value={p.bombero_nombre_a_cargo} />
    </View>
  )
}
