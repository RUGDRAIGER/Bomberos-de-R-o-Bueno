import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalogBundle } from './useCatalogBundle'
import { getParte, getParteMaterial } from '../services/partes'
import {
  persistWizardStep,
  submitWizardParte,
  WIZARD_TOTAL_PASOS,
} from '../services/partePersist'
import type { ParteFormData } from '../types/database'
import { anteriorPaso } from '../utils/validation'

export function useParteWizard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const cats = useCatalogBundle()
  const [parteId, setParteId] = useState<string | null>(id ?? null)
  const [paso, setPaso] = useState(1)
  const [data, setData] = useState<ParteFormData>({})
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id || !user) return
    void getParte(id).then(async (p) => {
      const mats = await getParteMaterial(id)
      setParteId(p.id)
      setPaso(p.paso_actual ?? 1)
      setData({ ...p, material_ids: mats })
    })
  }, [id, user])

  const patch = (p: Partial<ParteFormData>) => setData((d) => ({ ...d, ...p }))

  const fb = { setError, setSaving }

  function guardarPaso() {
    void persistWizardStep(
      paso,
      data,
      parteId,
      user?.id,
      navigate,
      setParteId,
      setPaso,
      fb
    )
  }

  function enviar() {
    void submitWizardParte(data, parteId, user?.id, navigate, setParteId, fb)
  }

  function irAtras() {
    setError(null)
    setPaso(anteriorPaso(paso, data.tipo_mando ?? null))
  }

  const stepProps = {
    data,
    onChange: patch,
    tipos: cats.tipos,
    cargos: cats.cargos,
    companias: cats.companias,
    materiales: cats.materiales,
    userEmail: user?.email,
    parteId,
  }

  return {
    paso,
    error,
    saving,
    stepProps,
    guardarPaso,
    enviar,
    irAtras,
    totalPasos: WIZARD_TOTAL_PASOS,
  }
}
