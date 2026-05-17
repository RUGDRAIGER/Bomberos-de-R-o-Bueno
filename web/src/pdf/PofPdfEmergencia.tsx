import { Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { PdfRow } from './PdfRow'
import { pdfStyles } from './pof-styles'
import { pdfTxt } from './pdfTxt'

export function PofPdfEmergencia({ vm }: { vm: ParteInformeVm }) {
  const p = vm.parte
  return (
    <View>
      <Text style={pdfStyles.section}>Emergencia</Text>
      <PdfRow label="Fecha" value={p.fecha_emergencia} />
      <PdfRow label="Tipo" value={vm.tipoEmergenciaLabel} />
      <PdfRow label="Hora despacho" value={p.hora_inicio} />
      <PdfRow label="Primer 6-3" value={p.hora_llegada_primera_unidad} />
      <PdfRow label="6-7 término" value={p.hora_termino} />
      <PdfRow label="Área" value={p.area_intervencion} />
      <PdfRow label="Dirección" value={p.direccion_emergencia} />
      <Text style={pdfStyles.section}>Origen / causa / trabajo</Text>
      <Text style={pdfStyles.multiline}>{pdfTxt(p.origen_emergencia)}</Text>
      <Text style={[pdfStyles.multiline, { marginTop: 4 }]}>{pdfTxt(p.causa_emergencia)}</Text>
      <Text style={[pdfStyles.multiline, { marginTop: 4 }]}>{pdfTxt(p.descripcion_trabajo)}</Text>
    </View>
  )
}
