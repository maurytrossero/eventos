<!-- components/gallery-live/GalleryCarousel.vue -->
<template>
  <div class="carousel-background">
    <!-- Carrusel principal -->
    <swiper
      v-if="gallery.length"
      :key="swiperKey"
      @swiper="onSwiper"
      :modules="[Autoplay, Navigation, Pagination, EffectFade, EffectCube, EffectCoverflow]"
      :loop="gallery.length > 1"
      :autoplay="autoplayEnabled ? { delay: duration * 1000, disableOnInteraction: false } : false"
      :speed="transition * 1000"
      :effect="transitionType"
      :cube-effect="{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
      :coverflow-effect="{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }"
      pagination
      navigation
      class="gallery-swiper"
    >
      <swiper-slide v-for="item in gallery" :key="item.id" class="slide">
        <img :src="item.imageUrl" alt="Imagen" @dblclick="openFullscreen" />
        <p class="message">{{ item.message }}</p>
      </swiper-slide>
    </swiper>

    <!-- Controles -->
    <div class="config-panel">
      <div class="config-group">
        <label for="duration">Duración por imagen (s)</label>
        <input id="duration" type="number" v-model.number="duration" min="1" />
      </div>
      <div class="config-group">
        <label for="transition">Transición (s)</label>
        <input id="transition" type="number" v-model.number="transition" min="0" />
      </div>
      <div class="config-group">
        <label for="transitionType">Tipo de transición</label>
        <select v-model="transitionType" id="transitionType">
          <option value="slide">Deslizar</option>
          <option value="fade">Desvanecer</option>
          <option value="cube">Cubo</option>
          <option value="coverflow">Coverflow</option>
        </select>
      </div>
      <div class="config-group">
        <button @click="toggleAutoplay">
          {{ autoplayEnabled ? '⏸️ Pausar' : '▶️ Reanudar' }}
        </button>
      </div>
    </div>

    <!-- Pantalla completa -->
    <div v-if="fullscreen" class="fullscreen-overlay" ref="fullscreenOverlay" @dblclick="closeFullscreen">
      <swiper
        :key="swiperKey + '-fullscreen'"
        @swiper="onSwiper"
        :modules="[Autoplay, Pagination, Navigation, EffectFade, EffectCube, EffectCoverflow]"
        :loop="gallery.length > 1"
        :autoplay="autoplayEnabled ? { delay: duration * 1000, disableOnInteraction: false } : false"
        :speed="transition * 1000"
        :effect="transitionType"
        :cube-effect="{ shadow: true, slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
        :coverflow-effect="{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }"
        pagination
        navigation
        class="fullscreen-swiper"
      >
        <swiper-slide v-for="item in gallery" :key="item.id" class="fullscreen-slide">
          <img :src="item.imageUrl" alt="Imagen en pantalla completa" />
          <div class="fullscreen-message-container">
            <p class="fullscreen-message">{{ item.message }}</p>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow
} from 'swiper/modules'
import 'swiper/swiper-bundle.css'

import { listenToApprovedGallery } from '@/services/galleryService'
import type { GalleryImage } from '@/services/galleryService'

const gallery = ref<GalleryImage[]>([])
const duration = ref(10)
const transition = ref(1)
const transitionType = ref('slide')
const autoplayEnabled = ref(true)
const fullscreen = ref(false)

const swiperKey = ref(0)
const swiperInstance = ref<any>(null)
const fullscreenOverlay = ref<HTMLElement | null>(null)

// Corrección aquí: no desestructures props para mantener reactividad
const props = defineProps<{ eventoId: string }>()

let unsubscribe: (() => void) | null = null

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeFullscreen()
}

function onSwiper(swiper: any) {
  swiperInstance.value = swiper
}

onMounted(() => {
  unsubscribe = listenToApprovedGallery(props.eventoId, (images: GalleryImage[]) => {
    gallery.value = images
  })

  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  window.removeEventListener('keydown', handleKeydown)
})

watch([duration, transition, transitionType], async () => {
  swiperKey.value++
  await nextTick()
  const swiper = swiperInstance.value
  if (swiper) {
    swiper.params.speed = transition.value * 1000
    swiper.params.effect = transitionType.value
    if (swiper.params.autoplay && typeof swiper.params.autoplay !== 'boolean') {
      swiper.params.autoplay.delay = duration.value * 1000
    }
    swiper.slideTo(swiper.activeIndex)
    swiper.update()
  }
})

async function openFullscreen() {
  fullscreen.value = true
  await nextTick()
  const el = fullscreenOverlay.value
  if (el?.requestFullscreen) {
    try {
      await el.requestFullscreen()
    } catch (e) {
      console.warn('Pantalla completa falló:', e)
    }
  }
}

function closeFullscreen() {
  fullscreen.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

function toggleAutoplay() {
  const swiper = swiperInstance.value
  if (!swiper) return

  autoplayEnabled.value = !autoplayEnabled.value

  if (autoplayEnabled.value) {
    if (swiper.params.autoplay && typeof swiper.params.autoplay !== 'boolean') {
      swiper.params.autoplay.delay = duration.value * 1000
    }
    swiper.autoplay.start()
  } else {
    swiper.autoplay.stop()
  }

  swiper.update()
}
</script>

<style scoped>
.carousel-background {
  min-height: 100vh;
  background-color: #fffafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  font-family: 'Segoe UI', sans-serif;
}

.gallery-swiper {
  width: 100%;
  max-width: 900px;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(185, 139, 78, 0.3);
  background: white;
  padding: 1.5rem;
  box-sizing: border-box;
}

.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.slide img {
  max-width: 100%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.message {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a4a4a;
  text-align: center;
  max-width: 80%;
  user-select: none;
}

.config-panel {
  margin-top: 2rem;
  display: flex;
  gap: 2rem;
  background-color: #fff4e6;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  flex-wrap: wrap;
  justify-content: center;
}

.config-group {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #6a4e31;
  gap: 0.4rem;
}

.config-group label {
  font-weight: bold;
}

.config-group input,
.config-group select,
.config-group button {
  padding: 0.5rem 1rem;
  background-color: #fdf8f3;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.config-group button {
  background-color: #b98b4e;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.config-group button:hover {
  background-color: #9a733b;
}

/* Pantalla completa */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
}

.fullscreen-overlay img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.fullscreen-message-container {
  background-color: rgba(255, 255, 255, 0.85);
  margin-top: 1rem;
  padding: 1rem 2rem;
  border-radius: 10px;
  max-width: 90%;
  text-align: center;
}

.fullscreen-message {
  color: #222;
  font-size: 1.3rem;
  font-weight: 500;
}

.swiper-pagination-bullet {
  background-color: #b98b4e;
  opacity: 0.8;
}

.swiper-pagination-bullet-active {
  background-color: #9a733b;
  opacity: 1;
}

.swiper-button-next,
.swiper-button-prev {
  color: #b98b4e;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  color: #9a733b;
}

.fullscreen-swiper {
  width: 100vw;
  height: 100vh;
}

.fullscreen-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
}

.fullscreen-overlay .swiper-button-next,
.fullscreen-overlay .swiper-button-prev {
  display: none !important;
}

/* Responsive */
@media (max-width: 600px) {
  .gallery-swiper {
    max-width: 95vw;
    padding: 1rem;
  }

  .slide img {
    max-height: 300px;
  }

  .message {
    font-size: 1rem;
  }

  .config-panel {
    flex-direction: column;
    gap: 1rem;
    width: 90%;
  }

  .config-group input,
  .config-group select,
  .config-group button {
    width: 100%;
  }
}
</style>
