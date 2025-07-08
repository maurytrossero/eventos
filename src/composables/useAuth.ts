// src/composables/useAuth.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase' // asegurate que este path sea correcto
import { auth } from '@/firebase' // en lugar de llamar a getAuth() directamente

const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const router = useRouter()

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/panel') // Redirige al dashboard o ruta principal
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

const register = async (email: string, password: string) => {
  loading.value = true
  error.value = null
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)

    // Guardar información extra en Firestore
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      email,
      creadoEn: new Date(),
      plan: 'gratuito',
      eventosActivos: 0
    })

    router.push('/panel')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}


  const logout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  return {
    login,
    register,
    logout,
    loading,
    error
  }
}
