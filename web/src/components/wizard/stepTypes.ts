import type { ParteFormData } from '../../types/database'

export interface WizardStepProps {
  data: ParteFormData
  onChange: (patch: Partial<ParteFormData>) => void
  tipos?: { id: number; codigo: string; descripcion: string }[]
  cargos?: { id: number; nombre: string }[]
  companias?: { id: number; nombre: string }[]
  materiales?: { id: number; codigo: string; descripcion: string }[]
  userEmail?: string
  parteId?: string | null
}
