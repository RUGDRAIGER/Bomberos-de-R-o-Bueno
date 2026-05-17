import { useEffect, useState } from 'react'
import {
  fetchCargosOficial,
  fetchCompanias,
  fetchMaterialMayor,
  fetchTiposEmergencia,
} from '../services/catalogos'

export type CatalogBundle = {
  tipos: Awaited<ReturnType<typeof fetchTiposEmergencia>>
  cargos: Awaited<ReturnType<typeof fetchCargosOficial>>
  companias: Awaited<ReturnType<typeof fetchCompanias>>
  materiales: Awaited<ReturnType<typeof fetchMaterialMayor>>
}

export function useCatalogBundle() {
  const [cats, setCats] = useState<CatalogBundle>({
    tipos: [],
    cargos: [],
    companias: [],
    materiales: [],
  })

  useEffect(() => {
    Promise.all([
      fetchTiposEmergencia(),
      fetchCargosOficial(),
      fetchCompanias(),
      fetchMaterialMayor(),
    ]).then(([tipos, cargos, companias, materiales]) =>
      setCats({ tipos, cargos, companias, materiales })
    )
  }, [])

  return cats
}
