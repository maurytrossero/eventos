// services/galleryService.ts
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  Timestamp,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '@/firebase'
import imageCompression from 'browser-image-compression'

// Para subir a Firebase Storage (comentado por ahora)
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
// const storage = getStorage()

const CLOUD_NAME = 'dr0n6tfhw'
const UPLOAD_PRESET = 'unsigned_preset'

export async function uploadImageToCloudinary(file: File): Promise<string> {
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
    console.error('Error Cloudinary:', responseBody)
    throw new Error(JSON.parse(responseBody).error?.message || 'Error al subir imagen')
  }

  const data = JSON.parse(responseBody)
  console.log('✅ Imagen subida a Cloudinary:', data.secure_url)
  return data.secure_url
}

// Función para subir a Firebase Storage (comentada por ahora)
/*
async function uploadImageToFirebaseStorage(eventoId: string, file: File): Promise<string> {
  const timestamp = Date.now()
  const fileRef = storageRef(storage, `eventos/${eventoId}/${timestamp}-${file.name}`)
  await uploadBytes(fileRef, file)
  const downloadURL = await getDownloadURL(fileRef)
  console.log('✅ Imagen subida a Firebase Storage:', downloadURL)
  return downloadURL
}
*/

export async function uploadImageWithMessage(eventoId: string, file: File, message: string) {
  let imageUrl = ''
  try {
    imageUrl = await uploadImageToCloudinary(file)
  } catch (cloudErr) {
    console.warn('Fallo subida a Cloudinary:', cloudErr)

    // Aquí podrías activar Firebase Storage como fallback cuando quieras:
    /*
    try {
      imageUrl = await uploadImageToFirebaseStorage(eventoId, file)
    } catch (firebaseErr) {
      console.error('Fallo subida a Firebase Storage:', firebaseErr)
      throw new Error('No se pudo subir la imagen a ningún servicio')
    }
    */
    
    // Por ahora solo tirar error para que sepas que falló
    throw new Error('No se pudo subir la imagen a Cloudinary')
  }

  await addDoc(collection(db, 'eventos', eventoId, 'gallery'), {
    imageUrl,
    message,
    createdAt: serverTimestamp(),
    approved: false
  })
}

export interface GalleryImage {
  id: string
  imageUrl: string
  message: string
  createdAt: Timestamp | null
  approved: boolean
}

export function listenToApprovedGallery(eventoId: string, callback: (images: any[]) => void) {
  const galleryRef = collection(db, 'eventos', eventoId, 'gallery')
  const q = query(galleryRef)
  return onSnapshot(q, (querySnapshot) => {
    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(images)
  })
}

export async function deleteGalleryImage(eventoId: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'eventos', eventoId, 'gallery', id))
    console.log(`🗑 Imagen con ID ${id} eliminada`)
  } catch (error) {
    console.error('❌ Error al eliminar la imagen:', error)
  }
}
