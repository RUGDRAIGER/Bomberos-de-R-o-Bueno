import { Image, Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { pdfStyles } from './pof-styles'

export function PofPdfFirma({ vm }: { vm: ParteInformeVm }) {
  if (!vm.firmaUrl) return null

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={pdfStyles.section}>Firma digital</Text>
      <Image src={vm.firmaUrl} style={{ width: 180, height: 70, marginTop: 4 }} />
      {vm.parte.firmado_at ? (
        <Text style={{ fontSize: 8, color: '#444', marginTop: 2 }}>
          Registrada: {vm.parte.firmado_at}
        </Text>
      ) : null}
    </View>
  )
}
