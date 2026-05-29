import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { SigPadHandle } from './SignaturePadField'
import { SignaturePadField } from './SignaturePadField'
import { fileToPngBlob, readFileAsDataUrl } from '../../utils/imageFile'

export type FirmaModo = 'dibujar' | 'subir'

export type FirmaPanelHandle = {
  toBlob: () => Promise<Blob | null>
  getPreviewDataUrl: () => string | null
  clear: () => void
}

type Props = {
  initialPreview?: string | null
  onPreviewChange?: (dataUrl: string | null) => void
}

export const FirmaPanel = forwardRef<FirmaPanelHandle, Props>(function FirmaPanel(
  { initialPreview = null, onPreviewChange },
  ref
) {
  const padRef = useRef<SigPadHandle>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [modo, setModo] = useState<FirmaModo>('dibujar')
  const [uploadPreview, setUploadPreview] = useState<string | null>(initialPreview)

  function setPreview(url: string | null) {
    setUploadPreview(url)
    onPreviewChange?.(url)
  }

  useImperativeHandle(ref, () => ({
    async toBlob() {
      if (modo === 'subir' && uploadPreview) {
        const res = await fetch(uploadPreview)
        return res.blob()
      }
      return padRef.current?.toPngBlob() ?? null
    },
    getPreviewDataUrl() {
      if (modo === 'subir') return uploadPreview
      return null
    },
    clear() {
      padRef.current?.clear()
      setPreview(null)
      setFileName(null)
      if (fileRef.current) fileRef.current.value = ''
    },
  }))

  const [fileName, setFileName] = useState<string | null>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    try {
      await fileToPngBlob(file)
      const url = await readFileAsDataUrl(file)
      setPreview(url)
      setFileName(file.name)
      padRef.current?.clear()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Archivo no válido')
    }
  }

  return (
    <div className="firma-panel">
      <div className="firma-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={modo === 'dibujar'}
          className={`firma-tab${modo === 'dibujar' ? ' firma-tab--active' : ''}`}
          onClick={() => setModo('dibujar')}
        >
          ✍️ Dibujar firma
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={modo === 'subir'}
          className={`firma-tab${modo === 'subir' ? ' firma-tab--active' : ''}`}
          onClick={() => setModo('subir')}
        >
          📎 Subir PNG
        </button>
      </div>

      {modo === 'dibujar' ? (
        <>
          <p className="hint">Dibuje con el dedo o el ratón. Se exporta como PNG.</p>
          <SignaturePadField ref={padRef} />
        </>
      ) : (
        <>
          <p className="hint">PNG con fondo transparente (recomendado).</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/png"
            className="pdf-upload-input"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => fileRef.current?.click()}
          >
            Elegir archivo PNG
          </button>
          {fileName ? <p className="hint">Archivo: {fileName}</p> : null}
          {uploadPreview ? (
            <div className="firma-preview-wrap">
              <img src={uploadPreview} alt="Vista previa firma" className="firma-preview-img" />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
})
