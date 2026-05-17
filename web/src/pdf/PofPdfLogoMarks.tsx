import { Image } from '@react-pdf/renderer'
import type { ParteInformeVm } from '../types/parte-informe'

export function PofPdfLogoMarks({ vm, page }: { vm: ParteInformeVm; page: 1 | 2 }) {
  const b = vm.branding

  const comandancia =
    b.comandanciaLogoUrl != null ? (
      <Image
        src={b.comandanciaLogoUrl}
        style={{
          position: 'absolute',
          top: b.cmdTop,
          right: b.cmdRight,
          width: b.cmdWidth,
        }}
      />
    ) : null

  const compania =
    page === 2 && b.companiaLogoUrl != null ? (
      <Image
        src={b.companiaLogoUrl}
        style={{
          position: 'absolute',
          bottom: b.ciaBottom,
          left: b.ciaLeft,
          width: b.ciaWidth,
        }}
      />
    ) : null

  return (
    <>
      {comandancia}
      {compania}
    </>
  )
}
