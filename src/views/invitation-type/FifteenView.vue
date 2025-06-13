<template>
  <div class="fifteen-view" ref="container">
    <section ref="section1" class="section">
      <KyaraInvitation />
    </section>
    <section ref="section2" class="section">
      <CarouselComponent />
    </section>
    <section ref="section3" class="section">
      <InformationComponent />
    </section>
    <section ref="section4" class="section">
      <ConfirmComponent />
    </section>

  
    <!-- Botones navegación -->
    <!-- Subir -->
    <button 
    class="nav-btn up"
    @click="scrollToSection(currentSection - 1)"
    :disabled="currentSection === 0"
    aria-label="Subir"
    >
    ▲
    </button>

    <!-- Bajar -->
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

<script setup>
import { ref, onMounted } from 'vue'
import KyaraInvitation from '@/components/fifteen/CountdownComponent.vue'
import CarouselComponent from '@/components/fifteen/CarouselComponent.vue'
import InformationComponent from '@/components/fifteen/InformationComponent.vue'
import ConfirmComponent from '@/components/fifteen/ConfirmAttendance.vue'


const container = ref(null)
const section1 = ref(null)
const section2 = ref(null)
const section3 = ref(null)
const section4 = ref(null)

const currentSection = ref(0)

function scrollToSection(index) {
  if (index >= 0 && index < sections.value.length) {
    currentSection.value = index
    sections.value[index].scrollIntoView({ behavior: 'smooth' })
  }
}


const sections = ref([])
onMounted(() => {
  sections.value = [section1.value, section2.value, section3.value, section4.value]

  container.value.addEventListener('scroll', () => {
    const scrollPos = container.value.scrollTop
    const height = window.innerHeight

    // Estimar cuál sección está más cerca
    const index = Math.round(scrollPos / height)
    currentSection.value = index
  })
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
