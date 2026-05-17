import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import SignaturePad from 'signature_pad'

export type SigPadHandle = {
  clear: () => void
  toPngBlob: () => Promise<Blob | null>
}

export const SignaturePadField = forwardRef<SigPadHandle>(function SignaturePadField(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)

  useImperativeHandle(ref, () => ({
    clear() {
      padRef.current?.clear()
    },
    async toPngBlob() {
      const pad = padRef.current
      const canvas = canvasRef.current
      if (!pad || !canvas || pad.isEmpty()) return null
      return new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png')
      })
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pad = new SignaturePad(canvas, {
      penColor: '#111111',
      minWidth: 0.5,
      maxWidth: 2.2,
    })
    padRef.current = pad
    return () => {
      pad.off()
      pad.clear()
      padRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={200}
      style={{
        width: '100%',
        maxWidth: '100%',
        height: 160,
        border: '1px solid var(--gris-200)',
        borderRadius: 8,
        touchAction: 'none',
        background: '#fff',
      }}
    />
  )
})
