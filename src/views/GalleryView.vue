<template>
  <div :class="containerClass" ref="container">
    <!-- Galería activa -->
    <section
      v-if="galeriaActiva"
      ref="sectionGaleriaUpload"
      class="section galeria-section"
    >
      <UploadForm :evento-id="eventoId" />
    </section>

    <section
      v-if="galeriaActiva"
      ref="sectionGaleriaCarousel"
      class="section galeria-section"
    >
      <GalleryCarousel
        :evento-id="eventoId"
        :nombre-evento="evento?.nombre ?? ''"
        :titulo-galeria="evento?.tituloGaleria ?? ''"
      />
    </section>

    <!-- Botones de navegación -->
    <button
      class="nav-btn up"
      @click="scrollToSection(currentSection - 1)"
      :disabled="currentSection === 0"
      aria-label="Subir"
    >
      ▲
    </button>

    <button
      class="nav-btn down"
      @click="scrollToSection(currentSection + 1)"
      :disabled="currentSection === sections.length - 1"
      aria-label="Bajar"
    >
      ▼
    </button>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

import GalleryCarousel from '@/components/gallery-live/GalleryCarousel.vue'
import UploadForm from '@/components/gallery-live/UploadForm.vue'

// Props
const props = defineProps({
  fondoTransparente: { type: Boolean, default: false }
})

const route = useRoute()
const eventoId = route.params.eventoId as string

const container = ref<HTMLElement | null>(null)
const sectionGaleriaCarousel = ref<HTMLElement | null>(null)
const sectionGaleriaUpload = ref<HTMLElement | null>(null)

const currentSection = ref(0)
const sections = ref<HTMLElement[]>([])

const evento = ref<any>(null)
const galeriaActiva = ref(false)

async function cargarEvento() {
  try {
    const eventoDoc = doc(db, 'eventos', eventoId)
    const eventoSnap = await getDoc(eventoDoc)
    if (eventoSnap.exists()) {
      evento.value = eventoSnap.data()
      galeriaActiva.value = evento.value?.galeriaActiva === true
    } else {
      console.warn('No se encontró el evento')
    }
  } catch (error) {
    console.error('Error al cargar el evento:', error)
  }
}

function scrollToSection(index: number) {
  if (index >= 0 && index < sections.value.length) {
    currentSection.value = index
    sections.value[index].scrollIntoView({ behavior: 'smooth' })
  }
}

function onScroll() {
  if (!container.value) return
  const scrollPos = container.value.scrollTop
  const height = window.innerHeight
  const index = Math.round(scrollPos / height)
  if (index !== currentSection.value) {
    currentSection.value = index
  }
}

async function setupSections() {
  await nextTick()
  sections.value = [
    ...(galeriaActiva.value ? [sectionGaleriaCarousel.value, sectionGaleriaUpload.value] : [])
  ].filter(Boolean) as HTMLElement[]
}

// Clase dinámica para el fondo
const containerClass = computed(() => ({
  'gallery-view': true,
  'fondo-transparente': props.fondoTransparente
}))

onMounted(async () => {
  await cargarEvento()
  await setupSections()

  if (container.value) {
    container.value.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (container.value) {
    container.value.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
.gallery-view {
  min-height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
  background-color: #fffafc; /* o el color fijo que prefieras */
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Fondo transparente si está activo */
.fondo-transparente {
  background: transparent !important;
}

.section {
  width: 100%;
  max-width: 900px; /* MÁS ancho que antes */
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: block;
}

.galeria-section > * {
  margin-bottom: 2rem;
  max-width: 100%;
}

.nav-btn {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(182, 175, 160, 0.6);
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  z-index: 1000;
  user-select: none;
  transition: background-color 0.3s ease;
}

.nav-btn.up {
  top: 1rem;
}

.nav-btn.down {
  bottom: 1rem;
}

.nav-btn:hover:not(:disabled) {
  background-color: rgba(182, 175, 160, 0.9);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

@media (max-width: 600px) {
  .nav-btn {
    font-size: 1.4rem;
    padding: 0.25rem 0.5rem;
  }

  .nav-btn.up {
    top: 0.5rem;
  }

  .nav-btn.down {
    bottom: 0.5rem;
  }
}
</style>
