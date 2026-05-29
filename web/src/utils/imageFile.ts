const PNG_TYPES = ['image/png', 'image/x-png']

export function isPngFile(file: File): boolean {
  return PNG_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.png')
}

export function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('No se pudo leer la imagen'))
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}

export async function fileToPngBlob(file: File): Promise<Blob> {
  if (!isPngFile(file)) throw new Error('Use un archivo PNG (fondo transparente recomendado).')
  return file
}
