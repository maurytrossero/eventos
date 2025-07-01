<template>
  <div class="fifteen-view" ref="container">
    <section ref="section1" class="section">
      <CountdownComponent :key="evento?.fecha" :evento="evento" />
    </section>

    <section ref="section2" class="section">
      <CarouselComponent :evento-id="eventoId" />
    </section>

    <section ref="section3" class="section">
      <InformationComponent
        :evento-id="eventoId"
        :informacion="evento.informacionInvitacion"
      />
    </section>

    <section ref="section4" class="section">
      <ConfirmComponent :evento-id="eventoId" />
    </section>

    <section
      v-if="triviaActiva"
      ref="sectionTrivia"
      class="section"
    >
      <TriviaComponent :evento-id="eventoId" :nombre-jugador="evento.nombreQuinceanera" />
    </section>

    <section
      v-if="triviaActiva"
      ref="sectionResultados"
      class="section"
    >
      <ResultadosTriviaComponent :evento-id="eventoId" />
    </section>

    <section
      v-if="galeriaActiva"
      ref="sectionGaleria"
      class="section galeria-section"
    >
    <GalleryCarousel 
      :evento-id="eventoId"
      :nombre-evento="evento.nombre"
      :titulo-galeria="evento.tituloGaleria ?? ''"
    />
      <UploadForm :evento-id="eventoId" />
    </section>


    <!-- Botones navegación -->
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

import CountdownComponent from '@/components/fifteen/CountdownComponent.vue'
import CarouselComponent from '@/components/fifteen/CarouselComponent.vue'
import InformationComponent from '@/components/fifteen/InformationComponent.vue'
import ConfirmComponent from '@/components/fifteen/ConfirmAttendance.vue'
import TriviaComponent from '@/components/TriviaComponent.vue'
import ResultadosTriviaComponent from '@/views/TriviaResultsView.vue'
import GalleryCarousel from '@/components/gallery-live/GalleryCarousel.vue'
import UploadForm from '@/components/gallery-live/UploadForm.vue'

const route = useRoute()
const eventoId = route.params.eventoId as string

const props = defineProps<{
  evento: {
    fecha: string
    nombre: string
    nombreQuinceanera: string
    tituloGaleria?: string
    carouselConfig?: any
    informacionInvitacion?: any
  }
}>()


const triviaActiva = ref(false)
const galeriaActiva = ref(false)

const container = ref<HTMLElement | null>(null)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)
const sectionTrivia = ref<HTMLElement | null>(null)
const sectionResultados = ref<HTMLElement | null>(null)
const sectionGaleria = ref<HTMLElement | null>(null)

const currentSection = ref(0)
const sections = ref<HTMLElement[]>([])

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
    section1.value,
    section2.value,
    section3.value,
    section4.value,
    ...(triviaActiva.value ? [sectionTrivia.value, sectionResultados.value] : []),
    ...(galeriaActiva.value ? [sectionGaleria.value] : [])
  ].filter(Boolean) as HTMLElement[]
}

onMounted(async () => {
  try {
    const eventoDocRef = doc(db, 'eventos', eventoId)
    const eventoSnap = await getDoc(eventoDocRef)
    if (eventoSnap.exists()) {
      const data = eventoSnap.data()
      triviaActiva.value = data.triviaActiva === true
      galeriaActiva.value = data.galeriaActiva === true
    }
  } catch (e) {
    console.error('Error al obtener configuración:', e)
  }

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
.fifteen-view {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
}
.galeria-section > * {
  margin-bottom: 2rem;
  max-width: 90%;
}


.section {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  flex-direction: column;
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
  bottom: auto;
}

.nav-btn.down {
  bottom: 1rem;
  top: auto;
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