<!-- components/gallery-live/GallerySetting.vue -->
<template>
  <div class="gallery-setting">
    <h2>Configuración de la Galería</h2>

    <label class="toggle-gallery">
      <input type="checkbox" v-model="galeriaActiva" />
      Activar galería para este evento
    </label>

    <label class="gallery-title-label" v-if="galeriaActiva">
      Título personalizado para la galería:
      <input 
        type="text" 
        v-model="tituloGaleria" 
        placeholder="Dejar vacío para usar el título del evento" 
        @input="guardarTitulo" 
      />
    </label>

    <p v-if="!galeriaActiva" class="info-text">La galería está desactivada, activa para configurar el título.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { updateEvento, getEventoById } from '@/services/firestoreService'

interface Evento {
  galeriaActiva?: boolean
  tituloGaleria?: string | null
  nombre?: string
}

const props = defineProps<{ eventoId: string }>()
const galeriaActiva = ref(false)
const tituloGaleria = ref('')

async function cargarDatos() {
  try {
    const evento = await getEventoById(props.eventoId) as Evento
    galeriaActiva.value = evento?.galeriaActiva === true
    // Si no tiene tituloGaleria o es null/empty, dejamos ''
    tituloGaleria.value = evento?.tituloGaleria ?? ''
  } catch (e) {
    console.error('Error al obtener estado galería:', e)
  }
}

onMounted(() => {
  cargarDatos()
})

// Actualizamos galeriaActiva cuando cambia
watch(galeriaActiva, async (nuevoValor) => {
  try {
    await updateEvento(props.eventoId, { galeriaActiva: nuevoValor })
    // Si se desactiva, borramos el título personalizado para evitar confusión (opcional)
    if (!nuevoValor) {
      tituloGaleria.value = ''
      await updateEvento(props.eventoId, { tituloGaleria: null })
    }
  } catch (e) {
    console.error('Error actualizando configuración galería:', e)
  }
})

// Guardamos título cada vez que cambie (debounce para evitar muchas llamadas)
let debounceTimeout: number | undefined
function guardarTitulo() {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = window.setTimeout(async () => {
    try {
      // Guardamos null si el input está vacío
      const valorGuardar = tituloGaleria.value.trim() === '' ? null : tituloGaleria.value.trim()
      await updateEvento(props.eventoId, { tituloGaleria: valorGuardar })
    } catch (e) {
      console.error('Error guardando título galería:', e)
    }
  }, 500)
}
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
  margin-bottom: 1rem;
}

.toggle-gallery input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4caf50;
}

.gallery-title-label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #444;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.gallery-title-label input {
  margin-top: 8px;
  padding: 8px 10px;
  border: 1.5px solid #b98b4e;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.gallery-title-label input:focus {
  outline: none;
  border-color: #9a733b;
  box-shadow: 0 0 5px #9a733baa;
}

.info-text {
  font-style: italic;
  color: #777;
  margin-top: 1rem;
}
@media (prefers-color-scheme: dark) {
  .gallery-setting {
    background: #1e1e1e;
    color: #f0f0f0;
  }

  .toggle-gallery {
    color: #f0f0f0;
  }

  .gallery-title-label {
    color: #e0e0e0;
  }

  .gallery-title-label input {
    background-color: #2b2b2b;
    color: #f0f0f0;
    border-color: #6b4f2e;
  }

  .gallery-title-label input:focus {
    border-color: #9a733b;
    box-shadow: 0 0 5px #9a733baa;
  }

  .info-text {
    color: #aaaaaa;
  }

  .toggle-gallery input[type='checkbox'] {
    accent-color: #81c784;
  }
}

</style>
