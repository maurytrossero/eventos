<!-- PanelView.vue -->
<template>
  <div class="panel animate-fade">
    <h1 class="animate-down">¡Hola {{ userEmail }}!</h1>
    <h2 class="animate-down">Estos son tus eventos:</h2>

    <div class="eventos">
      <div v-if="eventos.length">
        <div
          v-for="evento in eventos"
          :key="evento.id"
          class="evento animate-up"
        >
          <h3>{{ evento.nombre }}</h3>
          <p><strong>Fecha:</strong> {{ evento.fecha }}</p>
          <p><strong>Lugar:</strong> {{ evento.lugar }}</p>
          <div class="acciones">
            <router-link :to="`/evento/${evento.id}/editar`">Editar</router-link>
            <router-link :to="`/evento/${evento.id}/moderar`">Moderación</router-link>
            <router-link :to="`/evento/${evento.id}/trivia`">Trivia</router-link>
            <router-link :to="`/evento/${evento.id}/galeria`">Galería</router-link>
          </div>
        </div>
      </div>
      <p v-else class="no-eventos animate-up">
        No tenés eventos todavía. ¡Creá uno ahora! 🎉
      </p>
    </div>

    <div class="panel-footer animate-up">
      <router-link to="/eventos">➕ Crear nuevo evento</router-link>
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

const userId = computed(() => auth.user?.uid || '')
const userEmail = computed(() => auth.user?.email || 'Usuario')

onMounted(async () => {
  if (!userId.value) return
  const todos = (await getEventos()) as Evento[]
  eventos.value = todos.filter(e => e.creadoPor === userId.value)
})

const logout = async () => {
  await auth.logout()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

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
  transition: transform 0.3s, box-shadow 0.3s;
}

.evento:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
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

.no-eventos {
  font-size: 1.1rem;
  color: #555;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade {
  animation: fadeIn 0.8s ease;
}

.animate-up {
  animation: fadeInUp 0.8s ease;
}

.animate-down {
  animation: fadeInDown 0.8s ease;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .panel {
    color: #eee;
  }

  .evento {
    background-color: #2e3b4e;
    border-color: #b98b4e;
  }

  .acciones a {
    background-color: #b98b4e;
  }

  .acciones a:hover {
    background-color: #9a733b;
  }

  .panel-footer a {
    color: #90caf9;
  }

  .panel-footer a:hover {
    color: #64b5f6;
  }
}
</style>
