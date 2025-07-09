import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '@/firebase' // ajustá ruta según tu proyecto
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mantener el usuario sincronizado con Firebase Auth
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
  })

  // Login
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Registro
  async function register(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // Guardar info extra en Firestore
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        email,
        creadoEn: new Date(),
        plan: 'gratuito',
        eventosActivos: 0
      })
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Logout
  async function logout() {
    await signOut(auth)
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  }
})
