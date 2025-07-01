<template>
  <div class="gallery-setting">
    <h2>Configuración de la Galería</h2>
    <label class="toggle-gallery">
      <input type="checkbox" v-model="galeriaActiva" />
      Activar galería para este evento
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { updateEvento, getEventoById } from '@/services/firestoreService'

interface Evento {
  galeriaActiva?: boolean
}

const props = defineProps<{ eventoId: string }>()
const galeriaActiva = ref(false)

onMounted(async () => {
  try {
    const evento = await getEventoById(props.eventoId) as Evento
    galeriaActiva.value = evento?.galeriaActiva === true
  } catch (e) {
    console.error('Error al obtener estado galería:', e)
  }
})

watch(galeriaActiva, async (nuevoValor) => {
  try {
    await updateEvento(props.eventoId, { galeriaActiva: nuevoValor })
  } catch (e) {
    console.error('Error actualizando configuración galería:', e)
  }
})
</script>

<style scoped>
.gallery-setting {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 10px;
  font-family: sans-serif;
}

.toggle-gallery {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  color: #333;
}

.toggle-gallery input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4caf50; /* verde similar a tu trivia */
}
</style>
