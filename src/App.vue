<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import HeaderLogo from '@/components/portfolio/HeaderLogo.vue';
import IntroductionComponent from '@/components/portfolio/IntroductionComponent.vue';
import ProjectGallery from '@/components/portfolio/ProjectGallery.vue';
import ServicesComponent from '@/components/portfolio/ServicesComponent.vue';
import ContactForm from '@/components/portfolio/ContactForm.vue';
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  padding: 0;
  background-color: #000; /* Fondo negro para el tema oscuro */
}
</style>
