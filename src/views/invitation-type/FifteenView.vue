<!-- invitation-type/FifteenView.vue -->
<template>
  <div class="fifteen-view" ref="container">
    <section ref="section1" class="section">
      <CountdownComponent 
        :key="evento?.fecha" 
        :evento="evento" 
      />
    </section>
    <section ref="section2" class="section">
      <CarouselComponent :evento-id="eventoId" />
    </section>
    <InformationComponent
      :evento-id="eventoId"
      :informacion="evento.informacionInvitacion"
    />
    <section ref="section4" class="section">
      <ConfirmComponent :evento-id="eventoId" />
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
import { ref, onMounted, onUnmounted } from 'vue'
import CountdownComponent from '@/components/fifteen/CountdownComponent.vue'
import CarouselComponent from '@/components/fifteen/CarouselComponent.vue'
import InformationComponent from '@/components/fifteen/InformationComponent.vue'
import ConfirmComponent from '@/components/fifteen/ConfirmAttendance.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const eventoId = route.params.eventoId as string

const props = defineProps<{
  evento: {
    fecha: string
    nombreQuinceanera: string
    carouselConfig?: {
      adornoSuperior?: string
      adornoInferior?: string
      frase?: string
      imagenes?: string[]
    },
    informacionInvitacion?: {
      textoInvitacion: string
      adornoSuperior: string
      adornoInferior: string
      tarjetas: Array<{
        frontImage: string
        frontText: string
        frontIcon: string
        backContent: any
      }>
    }
  }
}>()

const container = ref<HTMLElement | null>(null)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)  // Eliminé section3 porque no existe

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

onMounted(() => {
  sections.value = [section1.value, section2.value, section4.value].filter(Boolean) as HTMLElement[]
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
    width: 100vw;          /* ancho total sin margen */
    margin: 0;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;    /* prevenir scroll horizontal */
    scroll-behavior: smooth;
    position: relative;
    }

    .section {
    min-height: 100vh; /* permite crecer si el contenido lo necesita */
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    flex-direction: column; /* asegura orden vertical */
    }



    /* Botones navegación */
    .nav-btn {
    position: fixed;
    left: 50%;               /* centro horizontal */
    transform: translateX(-50%);  /* centrar exactamente */
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

    /* Botones arriba y abajo */
    .nav-btn.up {
    top: 1rem;
    bottom: auto;
    }

    .nav-btn.down {
    bottom: 1rem;
    top: auto;
    }

    /* Hover y disabled igual */
    .nav-btn:hover:not(:disabled) {
    background-color: rgba(182, 175, 160, 0.9);
    }

    .nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
    }

    /* Responsive */
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
