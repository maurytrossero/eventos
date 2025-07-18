<template>
  <div id="app">
    <MainHeader v-if="mostrarHeader" />
    <router-view />
  </div>
</template>

<script setup>
import MainHeader from '@/components/MainHeader.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const mostrarHeader = computed(() => {
  // Ocultar header en ruta invitación pública o galería pública con slug
  return !(route.name === 'invitacion-slug' || route.name === 'galeria-slug')
})
</script>


<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
}
</style>
