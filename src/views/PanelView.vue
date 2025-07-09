<template>
  <div class="panel">
    <h1>¡Hola {{ userEmail }}!</h1>
    <h2>Estos son tus eventos:</h2>

    <div class="eventos">
      <div v-if="eventos.length">
        <div v-for="evento in eventos" :key="evento.id" class="evento">
          <h3>{{ evento.nombre }}</h3>
          <p><strong>Fecha:</strong> {{ evento.fecha }}</p>
          <p><strong>Lugar:</strong> {{ evento.lugar }}</p>
          <div class="acciones">
            <router-link :to="`/eventos/${evento.id}/editar`">Editar</router-link>
            <router-link :to="`/eventos/${evento.id}/moderar`">Moderación</router-link>
            <router-link :to="`/eventos/${evento.id}/trivia`">Trivia</router-link>
            <router-link :to="`/eventos/${evento.id}/galeria`">Galería</router-link>
          </div>
        </div>
      </div>
      <p v-else>No tenés eventos todavía. ¡Creá uno ahora! 🎉</p>
    </div>


    <div class="panel-footer">
      <router-link to="/eventos">➕ Crear nuevo evento</router-link>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { getEventos } from '@/services/firestoreService'

const auth = useAuthStore()

interface Evento {
  id?: string
  nombre: string
  fecha: string
  lugar?: string
  creadoPor?: string
}

const eventos = ref<Evento[]>([])

const userEmail = computed(() => auth.user?.email || 'Usuario')

onMounted(async () => {
  // 1️⃣ Verificamos que exista el email del usuario
  if (!auth.user?.email) return

  // 2️⃣ Guardamos en una constante garantizada no‑null
  const email = auth.user.email

  // 3️⃣ Obtenemos y casteamos los eventos
  const todos = (await getEventos()) as Evento[]

  // 4️⃣ Filtramos usando la constante `email`
  eventos.value = todos.filter(e =>
    !e.creadoPor || e.creadoPor === email
  )
})

const logout = async () => {
  await auth.logout()
}
</script>


<style scoped>
.panel {
  font-family: 'Poppins', sans-serif;
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.eventos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.evento {
  background: #fff7e6;
  border: 1px solid #e0c59a;
  border-radius: 12px;
  padding: 1rem;
  text-align: left;
}

.acciones {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.acciones a {
  background-color: #b98b4e;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.acciones a:hover {
  background-color: #9a733b;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.panel-footer a {
  font-weight: bold;
  color: #406d9e;
  text-decoration: none;
}

.logout-btn {
  background-color: #b98b4e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #9a733b;
}
</style>
