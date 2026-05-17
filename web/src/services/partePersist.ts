import type { NavigateFunction } from 'react-router-dom'
import { createParte, enviarParte, updateParte } from './partes'
import type { ParteFormData } from '../types/database'
import { siguientePaso, validatePaso } from '../utils/validation'

export const WIZARD_TOTAL_PASOS = 8

type Feedback = {
  setError: (msg: string | null) => void
  setSaving: (v: boolean) => void
}

export async function ensureParteId(
  parteId: string | null,
  userId: string | undefined,
  navigate: NavigateFunction,
  setParteId: (id: string) => void
): Promise<string | null> {
  if (parteId) return parteId
  if (!userId) return null
  const p = await createParte(userId)
  setParteId(p.id)
  navigate(`/parte/${p.id}`, { replace: true })
  return p.id
}

export async function persistWizardStep(
  paso: number,
  data: ParteFormData,
  parteId: string | null,
  userId: string | undefined,
  navigate: NavigateFunction,
  setParteId: (id: string) => void,
  setPaso: (n: number) => void,
  fb: Feedback
): Promise<void> {
  const err = validatePaso(paso, data)
  if (err) {
    fb.setError(err)
    return
  }
  fb.setError(null)
  fb.setSaving(true)
  try {
    const pid = await ensureParteId(parteId, userId, navigate, setParteId)
    if (!pid || !userId) return
    const next =
      paso < WIZARD_TOTAL_PASOS ? siguientePaso(paso, data.tipo_mando ?? null) : paso
    await updateParte(pid, { ...data, paso_actual: next }, userId)
    if (paso < WIZARD_TOTAL_PASOS) setPaso(next)
  } catch (e) {
    fb.setError(e instanceof Error ? e.message : 'Error al guardar')
  } finally {
    fb.setSaving(false)
  }
}

export async function submitWizardParte(
  data: ParteFormData,
  parteId: string | null,
  userId: string | undefined,
  navigate: NavigateFunction,
  setParteId: (id: string) => void,
  fb: Feedback
): Promise<void> {
  const err = validatePaso(WIZARD_TOTAL_PASOS, data)
  if (err) {
    fb.setError(err)
    return
  }
  fb.setSaving(true)
  try {
    const pid = await ensureParteId(parteId, userId, navigate, setParteId)
    if (!pid || !userId) return
    await updateParte(pid, { ...data, paso_actual: WIZARD_TOTAL_PASOS }, userId)
    await enviarParte(pid, userId)
    navigate('/')
  } catch (e) {
    fb.setError(e instanceof Error ? e.message : 'Error al enviar')
  } finally {
    fb.setSaving(false)
  }
}
