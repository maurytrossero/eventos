// services/invitacionService.ts
import imageCompression from 'browser-image-compression'

const CLOUD_NAME = 'dr0n6tfhw'
const UPLOAD_PRESET = 'unsigned_preset'

export async function uploadInvitacionBackground(file: File): Promise<string> {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  })

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`
  const formData = new FormData()
  formData.append('file', compressedFile)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(url, { method: 'POST', body: formData })
  const responseBody = await res.text()

  if (!res.ok) {
    console.error('❌ Error al subir imagen a Cloudinary:', responseBody)
    throw new Error(JSON.parse(responseBody).error?.message || 'Error al subir imagen')
  }

  const data = JSON.parse(responseBody)
  console.log('✅ Fondo de invitación subido a Cloudinary:', data.secure_url)
  return data.secure_url
}
