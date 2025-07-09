<template>
  <div id="app">
    <MainHeader />
    <router-view />
  </div>
</template>

<script setup>
import MainHeader from '@/components/MainHeader.vue'

// Los otros imports que tenías para portfolio parecen no usarse acá
// Si los usás dentro de páginas o vistas, dejalos ahí
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
