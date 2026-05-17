import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from './pof-styles'
import { pdfTxt } from './pdfTxt'

export function PdfRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <View style={pdfStyles.row}>
      <Text style={pdfStyles.label}>{label}</Text>
      <Text style={pdfStyles.value}>{pdfTxt(value)}</Text>
    </View>
  )
}
