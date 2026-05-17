import { Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { PdfRow } from './PdfRow'
import { pdfStyles } from './pof-styles'

export function PofPdfInstituciones({ vm }: { vm: ParteInformeVm }) {
  const p = vm.parte
  return (
    <View>
      <Text style={pdfStyles.section}>Otras instituciones</Text>
      <PdfRow label="SAMU (1-2)" value={p.samu} />
      <PdfRow label="Carabineros 1-0" value={p.carabineros} />
      <PdfRow label="CONAF (1-5)" value={p.conaf} />
      <PdfRow label="Otros CB" value={p.otros_cb} />
      <PdfRow label="Nombre otro CB" value={p.otros_cb_nombre} />
      <PdfRow label="SENAPRED" value={p.senapred} />
      <PdfRow label="Empresas externas" value={p.empresas_externas} />
    </View>
  )
}
