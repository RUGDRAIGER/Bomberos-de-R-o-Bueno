import type { ParteInformeVm, PdfBrandingVm } from '../types/parte-informe'

export type PdfPrepOverrides = {
  comandanciaLogoUrl?: string | null
  companiaLogoUrl?: string | null
  firmaUrl?: string | null
}

export function applyPdfPrepOverrides(
  vm: ParteInformeVm,
  overrides: PdfPrepOverrides
): ParteInformeVm {
  const branding: PdfBrandingVm = { ...vm.branding }
  if (overrides.comandanciaLogoUrl !== undefined) {
    branding.comandanciaLogoUrl = overrides.comandanciaLogoUrl
  }
  if (overrides.companiaLogoUrl !== undefined) {
    branding.companiaLogoUrl = overrides.companiaLogoUrl
  }
  const firmaUrl =
    overrides.firmaUrl !== undefined ? overrides.firmaUrl : vm.firmaUrl

  return { ...vm, branding, firmaUrl }
}
