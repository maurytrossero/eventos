<!-- views/AcountView.vue -->
<template>
  <section class="account" v-cloak>
    <h1 class="fade-in-down">Mi Cuenta</h1>

    <div class="user-info fade-in-up" :style="{ animationDelay: '0.3s' }">
      <h2>Información personal</h2>
      <p><strong>Email:</strong> {{ userEmail }}</p>
      <p><strong>Usuario desde:</strong> {{ fechaRegistro }}</p>
    </div>

    <div class="plan-info fade-in-up" :style="{ animationDelay: '0.6s' }" v-if="plan">
      <h2>Tu plan actual</h2>
      <p><strong>Plan:</strong> {{ plan.nombre }}</p>
      <p>{{ plan.descripcion }}</p>
      <p><strong>Precio:</strong> {{ plan.precio }}</p>

      <router-link
        v-if="plan.nombre === 'Plan Básico'"
        :to="{ path: '/checkout', query: { plan: 'premium' } }"
        class="btn btn-highlight"
      >
        Actualizar a Premium
      </router-link>

      <button v-else disabled class="btn btn-disabled">
        Ya tienes el mejor plan 👍
      </button>
    </div>

    <div class="logout-section fade-in-up" :style="{ animationDelay: '0.9s' }">
      <button @click="handleLogout" class="logout-btn">Cerrar sesión</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'


const auth = useAuthStore()

const userEmail = computed(() => auth.user?.email || 'Usuario')
const fechaRegistro = ref('Desconocida')
const plan = ref<{ nombre: string; descripcion: string; precio: string } | null>(null)

onMounted(async () => {
  const uid = auth.user?.uid
  if (!uid) return

  const userRef = doc(db, 'usuarios', uid)
  const snap = await getDoc(userRef)

  if (snap.exists()) {
    const data = snap.data()
    fechaRegistro.value = new Date(data.creadoEn?.seconds * 1000).toLocaleDateString()

    if (data.plan === 'premium') {
      plan.value = {
        nombre: 'Plan Premium',
        descripcion: 'Incluye invitaciones ilimitadas, galerías, trivias y más.',
        precio: '$2500 / mes'
      }
    } else {
      plan.value = {
        nombre: 'Plan Básico',
        descripcion: 'Funciones limitadas y gratuitas.',
        precio: 'Gratis'
      }
    }
  }
})

const handleLogout = async () => {
  await auth.logout()
  window.location.href = '/login' // o router.push si prefieres usar router
}
</script>

<style scoped>
[v-cloak] { display: none; }

.account {
  max-width: 600px;
  margin: 3rem auto;
  font-family: 'Poppins', sans-serif;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  text-align: center;
  color: #1f2d3d;
}

h1 {
  color: #2c4a77;
  margin-bottom: 1.5rem;
}

/* Animaciones al estilo HomeView */
.fade-in-down {
  animation: fadeInDown 0.8s ease forwards;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

/* Botones y estilos existentes */
.btn {
  display: inline-block;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  color: white;
  background: #2c4a77;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
  cursor: pointer;
}

.btn:hover {
  background: #1b2f50;
}

.btn-highlight {
  background: #b98b4e;
  animation: pulse 3s infinite;
}

.btn-highlight:hover {
  background: #9a733b;
}

.btn-disabled {
  background: #ccc;
  cursor: not-allowed;
}
.plan-info {
  margin-bottom: 2rem;
}

.plan-info .btn,
.plan-info button {
  margin-bottom: 1.5rem;
}

.logout-section {
  margin-top: 3rem;
}


.logout-btn {
  background-color: #b98b4e;
  border: none;
  padding: 0.8rem 1.4rem;
  font-weight: 700;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background-color: #9a733b;
}

/* Animaciones clave */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 6px #b98b4e; }
  50% { box-shadow: 0 0 15px #b98b4e; }
}
</style>
