<!-- src/components/ImageCropper.vue -->
<template>
  <div v-if="image" class="cropper-container">
    <div class="aspect-buttons">
      <button @click="setAspect(16 / 9)">🖥️ 1920x1080</button>
      <button @click="setAspect(9 / 16)">📱 1080x1920</button>
    </div>
    <img
      ref="imageRef"
      :src="image"
      alt="Imagen a recortar"
      @load="onImageLoaded"
    />
    <div class="actions">
      <button @click="crop">✅ Recortar</button>
      <button @click="$emit('cancel')">❌ Cancelar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps<{ image: string }>()
const emit = defineEmits<{
  (e: 'cropped', file: File): void
  (e: 'cancel'): void
}>()

const imageRef = ref<HTMLImageElement | null>(null)
let cropper: Cropper | null = null

watch(() => props.image, (newImage) => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
  // No crear cropper aquí; lo hacemos en onImageLoaded
})

const onImageLoaded = () => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
  if (imageRef.value) {
    cropper = new Cropper(imageRef.value, {
      viewMode: 1 as any,
      aspectRatio: 16 / 9,
      autoCropArea: 1,
      responsive: true,
    })
  }
}

onBeforeUnmount(() => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
})

const setAspect = (ratio: number) => {
  cropper?.setAspectRatio(ratio)
}

const crop = () => {
  if (!cropper) return
  const canvas = cropper.getCroppedCanvas()
  console.log('Canvas generado:', canvas)
  canvas.toBlob((blob) => {
    console.log('toBlob ejecutado, blob:', blob)
    if (blob) {
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
      console.log('Emitido cropped')
      emit('cropped', file)
    }
  }, 'image/jpeg')
}
</script>

<style scoped>
.cropper-container {
  max-width: 100%;
}
.aspect-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
img {
  max-width: 100%;
  max-height: 80vh;
}
</style>
