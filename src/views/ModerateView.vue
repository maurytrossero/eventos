<template>
  <ModerateGallery :evento-id="eventoId" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ModerateGallery from '@/components/gallery-live/ModerationGallery.vue'

const route = useRoute()
const eventoId = String(route.params.eventoId)  // Conversión explícita a string
</script>
