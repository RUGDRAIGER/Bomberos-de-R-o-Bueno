import type { ParteFormData } from '../types/database'

export function validatePaso(paso: number, data: ParteFormData): string | null {
  switch (paso) {
    case 1:
      if (!data.bombero_que_realiza_pof?.trim())
        return 'Indique el nombre del bombero que realiza el POF'
      return null
    case 2:
      if (!data.fecha_emergencia) return 'Indique la fecha de la emergencia'
      if (!data.tipo_emergencia_id) return 'Seleccione el tipo de emergencia'
      if (!data.hora_inicio) return 'Indique la hora de inicio (despacho)'
      if (!data.hora_llegada_primera_unidad)
        return 'Indique la hora de llegada de la primera unidad'
      if (!data.hora_termino) return 'Indique la hora de término'
      if (
        data.hora_inicio &&
        data.hora_llegada_primera_unidad &&
        data.hora_termino &&
        data.hora_inicio > data.hora_llegada_primera_unidad
      )
        return 'La hora de llegada debe ser posterior al despacho'
      if (
        data.hora_llegada_primera_unidad &&
        data.hora_termino &&
        data.hora_llegada_primera_unidad > data.hora_termino
      )
        return 'La hora de término debe ser posterior a la llegada'
      if (!data.area_intervencion) return 'Seleccione el área de intervención'
      if (!data.direccion_emergencia?.trim()) return 'Indique la dirección'
      if (!data.origen_emergencia?.trim()) return 'Indique el origen'
      if (!data.causa_emergencia?.trim()) return 'Indique la causa'
      if (!data.descripcion_trabajo?.trim()) return 'Indique la descripción del trabajo'
      return null
    case 3:
      if (!data.tipo_mando) return 'Indique quién estuvo a cargo'
      return null
    case 4:
      if (data.tipo_mando === 'OFICIAL' && !data.oficial_cargo_id)
        return 'Seleccione el oficial a cargo'
      return null
    case 5:
      if (data.tipo_mando === 'BOMBERO') {
        if (!data.bombero_compania_id) return 'Seleccione la compañía'
        if (!data.bombero_nombre_a_cargo?.trim())
          return 'Indique el nombre del bombero a cargo'
      }
      return null
    case 6:
      if (!data.samu) return 'Indique presencia de SAMU'
      if (!data.carabineros) return 'Indique presencia de Carabineros'
      if (!data.conaf) return 'Indique presencia de CONAF'
      if (!data.otros_cb) return 'Indique otros cuerpos de bomberos'
      if (data.otros_cb === 'SI' && !data.otros_cb_nombre?.trim())
        return 'Consigne el nombre del otro cuerpo de bomberos'
      if (!data.senapred) return 'Indique presencia de SENAPRED'
      return null
    case 7:
      if (!data.observaciones?.trim()) return 'Indique observaciones o "sin novedad"'
      return null
    case 8:
      if (!data.material_ids?.length && !data.material_otro?.trim())
        return 'Seleccione al menos un material mayor o indique otro'
      return null
    default:
      return null
  }
}

export function pasoVisible(paso: number, tipoMando?: string | null): boolean {
  if (paso === 4 && tipoMando !== 'OFICIAL') return false
  if (paso === 5 && tipoMando !== 'BOMBERO') return false
  return true
}

export function siguientePaso(actual: number, tipoMando?: string | null): number {
  let next = actual + 1
  while (next <= 8 && !pasoVisible(next, tipoMando)) next++
  return next
}

export function anteriorPaso(actual: number, tipoMando?: string | null): number {
  let prev = actual - 1
  while (prev >= 1 && !pasoVisible(prev, tipoMando)) prev--
  return prev
}
