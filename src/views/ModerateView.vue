<template>
  <ModerateGallery :evento-id="eventoId" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ModerateGallery from '@/components/gallery-live/ModerationGallery.vue'

const route = useRoute()
const eventoId = String(route.params.eventoId)  // Conversión explícita a string
</script>

<style scoped>
.moderate-gallery {
  background-color: #ffffff;
  color: #1f2d3d;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Poppins', sans-serif;
  max-width: 900px;
  margin: 2rem auto;
}

/* Ejemplo de títulos dentro de la galería */
.moderate-gallery h2 {
  font-size: 2rem;
  color: #2c4a77;
  margin-bottom: 1rem;
}

/* Texto */
.moderate-gallery p,
.moderate-gallery span {
  font-size: 1.1rem;
  line-height: 1.5;
  color: #34495e;
}

/* Botones */
.moderate-gallery button {
  background-color: #b98b4e;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.moderate-gallery button:hover {
  background-color: #8a6239;
}

/* Galería de imágenes o elementos moderados (ejemplo) */
.moderate-gallery .gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 1.5rem;
}

.moderate-gallery .gallery-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(31, 45, 61, 0.12);
  transition: transform 0.3s ease;
}

.moderate-gallery .gallery-item:hover {
  transform: scale(1.05);
}

/* Modo oscuro usando clase global .dark-mode */
::v-deep(.dark-mode) .moderate-gallery {
  background-color: #2e3b4e;
  color: #f5f5f5;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

::v-deep(.dark-mode) .moderate-gallery h2 {
  color: #b98b4e;
}

::v-deep(.dark-mode) .moderate-gallery p,
::v-deep(.dark-mode) .moderate-gallery span {
  color: #d6caa5;
}

::v-deep(.dark-mode) .moderate-gallery button {
  background-color: #9a733b;
  color: #f0e6d2;
}

::v-deep(.dark-mode) .moderate-gallery button:hover {
  background-color: #b98b4e;
  color: #f0e6d2;
}

::v-deep(.dark-mode) .moderate-gallery .gallery-item {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.8);
}

/* Soporte para preferencia del sistema: modo oscuro */
@media (prefers-color-scheme: dark) {
  .moderate-gallery {
    background-color: #2e3b4e;
    color: #f5f5f5;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  .moderate-gallery h2 {
    color: #b98b4e;
  }

  .moderate-gallery p,
  .moderate-gallery span {
    color: #d6caa5;
  }

  .moderate-gallery button {
    background-color: #9a733b;
    color: #f0e6d2;
  }

  .moderate-gallery button:hover {
    background-color: #b98b4e;
    color: #f0e6d2;
  }

  .moderate-gallery .gallery-item {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.8);
  }
}
</style>

