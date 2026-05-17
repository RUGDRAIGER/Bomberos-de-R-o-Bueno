import { Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { PdfRow } from './PdfRow'
import { pdfStyles } from './pof-styles'

export function PofPdfPersonalMaterial({ vm }: { vm: ParteInformeVm }) {
  const p = vm.parte

  return (
    <View>
      <Text style={pdfStyles.section}>Bomberos en acto (por compañía)</Text>
      <PdfRow label="1ª CIA" value={p.bomberos_1ra} />
      <PdfRow label="2ª CIA" value={p.bomberos_2da} />
      <PdfRow label="3ª CIA" value={p.bomberos_3ra} />
      <PdfRow label="4ª CIA" value={p.bomberos_4ta} />
      <PdfRow label="5ª CIA" value={p.bomberos_5ta} />
      <PdfRow label="6ª CIA" value={p.bomberos_6ta} />
      <Text style={pdfStyles.section}>Material mayor</Text>
      {vm.materialesLabels.length > 0 ? (
        <Text style={pdfStyles.multiline}>{vm.materialesLabels.join('; ')}</Text>
      ) : null}
      {p.material_otro ? (
        <Text style={[pdfStyles.multiline, { marginTop: 4 }]}>{p.material_otro}</Text>
      ) : vm.materialesLabels.length === 0 ? (
        <Text style={pdfStyles.multiline}>—</Text>
      ) : null}
      <PdfRow label="Móviles otros CB" value={p.moviles_otros_cb} />
    </View>
  )
}
