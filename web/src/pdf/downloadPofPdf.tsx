import { pdf } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'
import { PofPdfDocument } from './PofPdfDocument'

export async function downloadPofPdf(vm: ParteInformeVm) {
  const blob = await pdf(<PofPdfDocument vm={vm} />).toBlob()
  const fecha = (vm.parte.fecha_emergencia ?? 'sin-fecha').replace(/-/g, '')
  const num = vm.parte.numero_oficial
  const file =
    num != null
      ? `POF_N${String(num).padStart(5, '0')}_${fecha}.pdf`
      : `POF_${fecha}_${vm.parte.id.slice(0, 8)}.pdf`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file
  a.click()
  URL.revokeObjectURL(url)
}
