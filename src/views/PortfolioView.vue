<template>
  <div id="portfolio-view">
    <HeaderLogo />
    <IntroductionComponent />
    <ProjectGallery />
    <ContactForm />   
    <!-- Flechas de navegación -->
    <button class="arrow up" @click="scrollToComponent('up')">▲</button>
    <button class="arrow down" @click="scrollToComponent('down')">▼</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importa onMounted desde 'vue'
import HeaderLogo from '@/components/portfolio/HeaderLogo.vue';
import IntroductionComponent from '@/components/portfolio/IntroductionComponent.vue';
import ProjectGallery from '@/components/portfolio/ProjectGallery.vue';
import ContactForm from '@/components/portfolio/ContactForm.vue';

const components = ref([]);

// Función para desplazar la vista al componente correspondiente
function scrollToComponent(direction) {
  const elements = Array.from(document.querySelectorAll('#portfolio-view > *'));
  const currentIndex = elements.findIndex((el) => el.getBoundingClientRect().top >= 0);

  if (direction === 'up' && currentIndex > 0) {
    elements[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
  } else if (direction === 'down' && currentIndex < elements.length - 1) {
    elements[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
  }
}

// Montar las referencias a los componentes
onMounted(() => {
  // Opcional: Se puede inicializar la lista de componentes si se requiere para otros propósitos
});
</script>

<style scoped>
#portfolio-view {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  padding: 0;
  background-color: #000; /* Fondo negro para el tema oscuro */
}

/* Flechas de navegación */
/* Flechas de navegación */
/* Flechas de navegación */
.arrow {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  border: 2px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.arrow.up {
  bottom: 90px; /* Separa la flecha hacia arriba de la parte inferior */
}

.arrow.down {
  bottom: 20px; /* Mantén la flecha hacia abajo más cerca de la parte inferior */
}

.arrow:hover {
  background-color: #2c3e50;
  color: white;
  border-color: #2c3e50;
}


/* Asegurar que los elementos se adapten bien en dispositivos pequeños */
@media (max-width: 768px) {
  #portfolio-view {
    padding: 0 10px; /* Añadir padding lateral para evitar que el contenido toque los bordes de la pantalla */
  }

  header-logo,
  introduction-component,
  project-gallery,
  contact-form {
    margin-bottom: 20px; /* Añadir espacio entre los componentes */
  }

  h1, h2, h3, p {
    font-size: 90%; /* Reducir tamaño de texto en dispositivos pequeños */
  }

  .arrow {
    font-size: 1.5rem; /* Reducir el tamaño de las flechas en pantallas pequeñas */
  }
}
</style>
