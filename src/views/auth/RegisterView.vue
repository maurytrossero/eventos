<!-- src/views/auth/RegisterView.vue -->
<template>
  <div class="auth-container">
    <h1>Crear cuenta</h1>

    <form @submit.prevent="handleRegister">
      <input type="email" v-model="email" placeholder="Correo electrónico" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button type="submit" :disabled="loading">Registrarse</button>
      <p class="error" v-if="error">{{ error }}</p>
    </form>

    <p class="alt-link">
      ¿Ya tenés cuenta?
      <router-link to="/login">Iniciar sesión</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const { register, loading, error } = useAuth()

const handleRegister = () => {
  register(email.value, password.value)
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fffafc;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(185, 139, 78, 0.15);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

input {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #fdf8f3;
}

button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background-color: #b98b4e;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #9a733b;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.alt-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.alt-link a {
  color: #b98b4e;
  font-weight: bold;
  text-decoration: none;
}
</style>
