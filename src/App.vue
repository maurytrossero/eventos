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


<style>
body,
#app {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f0f2f5;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  body,
  #app {
    background-color: #1e1e2f;
    color: #f5f5f5;
  }
}
</style>
