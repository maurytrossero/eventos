<template>
  <div class="trivia-view">
    <TriviaComponent :eventoId="eventoId" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import TriviaComponent from '@/components/TriviaComponent.vue'

const route = useRoute()
const eventoId = route.params.eventoId as string
</script>

<style scoped>
.trivia-view {
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 1rem;
}
</style>
