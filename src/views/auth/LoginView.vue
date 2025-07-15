<!-- src/views/auth/LoginView.vue -->
<template>
  <div class="auth-container">
    <h1>Iniciar sesión</h1>

    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Correo electrónico" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button type="submit" :disabled="auth.loading">Ingresar</button>
      <p class="error" v-if="auth.error">{{ auth.error }}</p>
    </form>

    <p class="alt-link">
      ¿No tenés cuenta?
      <router-link to="/register">Registrate</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  await auth.login(email.value, password.value)

  if (!auth.error) {
    // Si hay un redirect previo en la query, volvemos ahí; si no, vamos a /panel por defecto
    const redirect = router.currentRoute.value.query.redirect
    router.push(typeof redirect === 'string' ? redirect : '/panel')
  }
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
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c4a77;
  animation: fadeInDown 0.8s ease forwards;
}

input {
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #fdf8f3;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
}

input:nth-of-type(2) {
  animation-delay: 0.45s;
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
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
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
  opacity: 0;
  animation: fadeIn 1s ease forwards;
  animation-delay: 0.8s;
  animation-fill-mode: forwards;
}

.alt-link {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0;
  animation: fadeIn 1s ease forwards;
  animation-delay: 0.9s;
  animation-fill-mode: forwards;
}

.alt-link a {
  color: #b98b4e;
  font-weight: bold;
  text-decoration: none;
}

/* Animaciones clave */

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

</style>
