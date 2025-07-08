<template>
  <div class="panel-container">
    <h1>¡Bienvenido a tu panel!</h1>
    <p>Desde aquí podrás crear y administrar tus eventos 🎉</p>
    <button @click="logout">Cerrar sesión</button>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
</script>

<style scoped>
.panel-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

button {
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #b98b4e;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
