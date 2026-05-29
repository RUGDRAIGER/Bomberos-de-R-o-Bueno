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
    const el = canvasRef.current
    if (!el) return

    const pad = new SignaturePad(el, {
      penColor: '#111111',
      minWidth: 0.5,
      maxWidth: 2.2,
    })
    padRef.current = pad

    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent || parent.clientWidth < 1) return
      const w = parent.clientWidth
      const h = 160
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = w * ratio
      canvas.height = h * ratio
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(ratio, ratio)
      }
      pad.clear()
    }

    const ro = new ResizeObserver(() => resize())
    if (el.parentElement) ro.observe(el.parentElement)
    requestAnimationFrame(resize)
    return () => {
      ro.disconnect()
      pad.off()
      pad.clear()
      padRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="signature-canvas"
    />
  )
})
