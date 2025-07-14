<!-- views/CheckoutView.vue -->
<template>
  <section class="checkout" v-cloak>
    <h1 class="fade-in-down" :style="{ animationDelay: '0.2s' }">Confirmá tu compra</h1>

    <div v-if="showContent" class="resumen fade-in-up" :style="{ animationDelay: '0.4s' }">
      <h2>Resumen del plan</h2>
      <div class="plan-detalle">
        <h3>{{ plan.nombre }}</h3>
        <p>{{ plan.descripcion }}</p>
        <p class="precio">{{ plan.precio }}</p>
      </div>
    </div>

    <div v-if="showContent" class="metodo-pago fade-in-up" :style="{ animationDelay: '0.6s' }">
      <h2>Elegí tu método de pago</h2>
      <select v-model="metodoSeleccionado" aria-label="Seleccionar método de pago">
        <option disabled value="">Seleccionar...</option>
        <option value="mercadopago">Mercado Pago</option>
        <option value="tarjeta">Tarjeta de Crédito/Débito</option>
        <option value="transferencia">Transferencia Bancaria</option>
      </select>
      <p v-if="error" class="error-msg" role="alert">{{ error }}</p>
    </div>

    <button
      v-if="showContent"
      class="confirmar-btn fade-in-up"
      :style="{ animationDelay: '0.8s' }"
      :disabled="!metodoSeleccionado || loading"
      @click="confirmarCompra"
      :aria-busy="loading"
    >
      <span v-if="loading">Procesando...</span>
      <span v-else>Confirmar y pagar</span>
    </button>

    <section v-if="!showContent" class="checkout-empty fade-in-up" :style="{ animationDelay: '0.4s' }" v-cloak>
      <p>No se encontró información del plan a contratar.</p>
      <router-link to="/precios" class="btn">Ver planes disponibles</router-link>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { updateUserPlan } from '@/services/firestoreService'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const metodoSeleccionado = ref('')
const loading = ref(false)
const error = ref('')
const showContent = ref(false)

interface Plan {
  nombre: string
  descripcion: string
  precio: string
}

const plan = ref<Plan>({ nombre: '', descripcion: '', precio: '' })

// Reacciona al query param "plan"
watchEffect(() => {
  const planId = route.query.plan as string | undefined
  if (!planId) {
    showContent.value = false
    return
  }

  if (planId === 'premium') {
    plan.value = {
      nombre: 'Plan Premium',
      descripcion: 'Incluye invitaciones ilimitadas, galerías, trivias y más.',
      precio: '$2500 / mes'
    }
  } else if (planId === 'basico') {
    plan.value = {
      nombre: 'Plan Básico',
      descripcion: 'Funciones limitadas y gratuitas.',
      precio: 'Gratis'
    }
  } else {
    plan.value = { nombre: '', descripcion: '', precio: '' }
  }

  showContent.value = !!plan.value.nombre
  metodoSeleccionado.value = ''
  error.value = ''
})

const confirmarCompra = async () => {
  error.value = ''
  if (!metodoSeleccionado.value) {
    error.value = 'Por favor, seleccioná un método de pago.'
    return
  }
  loading.value = true

  // Simulación de proceso de pago
  setTimeout(async () => {
    try {
      // 1) Persistir el plan en Firestore
      if (auth.user?.uid) {
        // 'premium' o 'gratuito' según el plan
        const planId = (route.query.plan as string) === 'premium' ? 'premium' : 'gratuito'
        await updateUserPlan(auth.user.uid, planId)
      }

      // 2) Notificar al usuario
      alert(`Pago confirmado para ${plan.value.nombre}`)

      // 3) Redirigir al panel de usuario
      router.push('/panel')
    } catch (e) {
      console.error(e)
      error.value = 'Ocurrió un error guardando tu suscripción.'
    } finally {
      loading.value = false
    }
  }, 2000)
}
</script>


<style scoped>
[v-cloak] { display: none; }

.checkout {
  max-width: 600px;
  margin: 3rem auto;
  font-family: 'Poppins', sans-serif;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.fade-in-down {
  animation: fadeInDown 0.8s ease forwards;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

h1 {
  color: #2c4a77;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.resumen, .metodo-pago, .checkout-empty {
  margin-bottom: 2rem;
}

.plan-detalle {
  background: #f9f5ee;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e1d5c4;
}

.plan-detalle h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #b98b4e;
}

.precio {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

select {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.error-msg {
  margin-top: 0.5rem;
  color: #cc3e3e;
  font-weight: 600;
}

.confirmar-btn {
  background-color: #b98b4e;
  color: white;
  border: none;
  padding: 0.8rem 1.4rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
  max-width: 300px;
}

.confirmar-btn[disabled] {
  background-color: #d3b773;
  cursor: not-allowed;
}

.confirmar-btn:hover:not([disabled]) {
  background-color: #a6763e;
}

.checkout-empty .btn {
  background: #2c4a77;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
