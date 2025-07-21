// src/services/userService.ts

import { db } from '../firebase'
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore'

export const getUsuarios = async () => {
  const snapshot = await getDocs(collection(db, 'usuarios'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const eliminarUsuario = async (id: string) => {
  await deleteDoc(doc(db, 'usuarios', id))
}

export const actualizarUsuario = async (usuario: { id: string; [key: string]: any }) => {
  const { id, ...resto } = usuario
  await updateDoc(doc(db, 'usuarios', id), resto)
}
