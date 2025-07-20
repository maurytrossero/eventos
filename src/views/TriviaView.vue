<template>
  <section class="trivia-view">
    <div class="trivia-wrapper">
      <TriviaComponent :eventoId="eventoId" />
    </div>
  </section>
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow-x: hidden;
}

.trivia-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
