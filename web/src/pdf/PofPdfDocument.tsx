import { Document, Page, Text, View } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { PdfRow } from './PdfRow'
import { PofPdfEmergencia } from './PofPdfEmergencia'
import { PofPdfFirma } from './PofPdfFirma'
import { PofPdfInstituciones } from './PofPdfInstituciones'
import { PofPdfLogoMarks } from './PofPdfLogoMarks'
import { PofPdfMando } from './PofPdfMando'
import { PofPdfObservaciones } from './PofPdfObservaciones'
import { PofPdfPersonalMaterial } from './PofPdfPersonalMaterial'
import { pdfStyles } from './pof-styles'
import { pdfTxt } from './pdfTxt'

export function PofPdfDocument({ vm }: { vm: ParteInformeVm }) {
  const p = vm.parte
  const meta = `N° ${p.numero_oficial ?? '—'} · ID ${p.id.slice(0, 8)}… · Estado ${pdfTxt(p.estado)} · Generado ${new Date().toISOString().slice(0, 16)}`
  const topPad = vm.branding.comandanciaLogoUrl ? 52 : 0

  return (
    <Document title={`POF ${p.id}`} author="Cuerpo de Bomberos Rio Bueno">
      <Page size="A4" style={pdfStyles.page}>
        <PofPdfLogoMarks vm={vm} page={1} />
        <View style={{ paddingTop: topPad }}>
          <Text style={pdfStyles.title}>Parte de Operaciones Finales 2026</Text>
          <Text style={pdfStyles.subtitle}>
            Comandancia Cuerpo de Bomberos de Río Bueno — Edición N°02 Enero 2026
          </Text>
          {p.numero_oficial != null ? (
            <PdfRow label="N° registro oficial" value={String(p.numero_oficial)} />
          ) : null}
          <PdfRow label="Bombero que realiza POF" value={p.bombero_que_realiza_pof} />
          <PofPdfEmergencia vm={vm} />
          <PofPdfMando vm={vm} />
        </View>
      </Page>
      <Page size="A4" style={pdfStyles.page}>
        <PofPdfLogoMarks vm={vm} page={2} />
        <PofPdfInstituciones vm={vm} />
        <PofPdfObservaciones vm={vm} />
        <PofPdfPersonalMaterial vm={vm} />
        <PofPdfFirma vm={vm} />
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontSize: 8, color: '#666' }}>{meta}</Text>
          {p.enviado_at ? (
            <Text style={{ fontSize: 8, color: '#666', marginTop: 2 }}>
              Enviado: {pdfTxt(p.enviado_at)}
            </Text>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}
