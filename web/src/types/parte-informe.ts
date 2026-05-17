import type { Parte } from './database'

export interface PdfBrandingVm {
  comandanciaLogoUrl: string | null
  companiaLogoUrl: string | null
  cmdTop: number
  cmdRight: number
  cmdWidth: number
  ciaBottom: number
  ciaLeft: number
  ciaWidth: number
}

export interface ParteInformeVm {
  parte: Parte
  tipoEmergenciaLabel: string | null
  oficialCargoNombre: string | null
  companiaNombre: string | null
  materialesLabels: string[]
  branding: PdfBrandingVm
  firmaUrl: string | null
}
