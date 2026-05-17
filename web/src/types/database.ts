export type AppRole = 'bombero' | 'admin' | 'consulta'
export type ParteEstado = 'borrador' | 'enviado'
export type TipoMando = 'OFICIAL' | 'BOMBERO'
export type SiNo = 'SI' | 'NO'

export interface Profile {
  id: string
  email: string | null
  nombre_completo: string | null
  rol: AppRole
  activo: boolean
}

export interface Parte {
  id: string
  estado: ParteEstado
  paso_actual: number
  bombero_que_realiza_pof: string | null
  fecha_emergencia: string | null
  tipo_emergencia_id: number | null
  hora_inicio: string | null
  hora_llegada_primera_unidad: string | null
  hora_termino: string | null
  area_intervencion: string | null
  direccion_emergencia: string | null
  origen_emergencia: string | null
  causa_emergencia: string | null
  descripcion_trabajo: string | null
  tipo_mando: TipoMando | null
  oficial_cargo_id: number | null
  bombero_compania_id: number | null
  bombero_nombre_a_cargo: string | null
  samu: SiNo | null
  carabineros: SiNo | null
  conaf: SiNo | null
  otros_cb: SiNo | null
  otros_cb_nombre: string | null
  senapred: SiNo | null
  empresas_externas: string | null
  observaciones: string | null
  emergencia_especialidad: string | null
  bomberos_1ra: number | null
  bomberos_2da: number | null
  bomberos_3ra: number | null
  bomberos_4ta: number | null
  bomberos_5ta: number | null
  bomberos_6ta: number | null
  material_otro: string | null
  moviles_otros_cb: string | null
  firma_path: string | null
  firmado_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  enviado_at: string | null
}

export interface ParteFormData extends Partial<Parte> {
  material_ids?: number[]
}
