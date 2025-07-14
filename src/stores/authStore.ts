import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '@/firebase'
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
  const loadingUser = ref(true)      // Indicador de carga de sesión
  const loading = ref(false)
  const error = ref<string | null>(null)

  const adminEmails = [
    'maurytrossero@gmail.com',
    'mtproduccioneshd@gmail.com',
    'admin@admin.com'
  ]

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.email && adminEmails.includes(user.value.email))

  // Mantener el usuario sincronizado con Firebase Auth
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    loadingUser.value = false        // Ya cargó el estado de usuario
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
    loadingUser,
    loading,
    error,
    login,
    register,
    logout,
    isLoggedIn,
    isAdmin
  }
})