<!-- components/gallery-live/ModerationGallery.vue -->
<template>
  <div class="moderation-gallery">
    <h1>Moderación de Imágenes</h1>
    <div class="gallery-grid">
      <div class="gallery-item" v-for="item in gallery" :key="item.id">
        <img :src="item.imageUrl" alt="Imagen" />
        <p>{{ item.message }}</p>
        <button @click="eliminar(item.id)">❌ Eliminar</button>
      </div>
    </div>
  </div>
</template><script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { listenToApprovedGallery, deleteGalleryImage } from '@/services/galleryService'
import type { GalleryImage } from '@/services/galleryService'
import type { Timestamp } from 'firebase/firestore'

const props = defineProps<{ eventoId: string }>()

const gallery = ref<GalleryImage[]>([])

let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = listenToApprovedGallery(props.eventoId, (images) => {
    gallery.value = images
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function eliminar(id: string) {
  if (confirm('¿Estás seguro de eliminar esta imagen?')) {
    deleteGalleryImage(props.eventoId, id)
  }
}

</script>


<style scoped>
.moderation-gallery {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fffafc;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #b98b4e;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(185, 139, 78, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.gallery-item img {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.gallery-item p {
  font-size: 1rem;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
}

.gallery-item button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.gallery-item button:hover {
  background-color: #c0392b;
}
</style>
