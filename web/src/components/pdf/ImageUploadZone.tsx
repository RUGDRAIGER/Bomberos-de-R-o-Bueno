import { useId, useRef } from 'react'
import { isPngFile, readFileAsDataUrl } from '../../utils/imageFile'

type Props = {
  label: string
  hint: string
  previewUrl: string | null
  onChange: (dataUrl: string | null) => void
  emptyIcon?: string
}

export function ImageUploadZone({
  label,
  hint,
  previewUrl,
  onChange,
  emptyIcon = '🖼️',
}: Props) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    if (!isPngFile(file)) {
      alert('Seleccione un archivo PNG.')
      return
    }
    try {
      const url = await readFileAsDataUrl(file)
      onChange(url)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo cargar la imagen')
    }
  }

  return (
    <div className="pdf-upload-zone">
      <label className="pdf-upload-label" htmlFor={inputId}>
        {label}
      </label>
      <p className="hint">{hint}</p>
      <div className="pdf-upload-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="pdf-upload-img" />
        ) : (
          <div className="pdf-upload-placeholder">
            <span aria-hidden>{emptyIcon}</span>
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/png"
        className="pdf-upload-input"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <div className="pdf-upload-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => inputRef.current?.click()}
        >
          Subir PNG
        </button>
        {previewUrl ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            Quitar
          </button>
        ) : null}
      </div>
    </div>
  )
}
