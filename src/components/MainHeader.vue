<!-- components/MainHeader.vue -->
<template>
  <header class="header">
    <div class="container">
      <router-link to="/" class="logo-link">
        <LogoEventizate />
      </router-link>

      <nav class="nav">
        <!-- Links comunes -->
        <router-link to="/">Inicio</router-link>
        <router-link to="/about">¿Qué es?</router-link>
        <router-link to="/precios">Precios</router-link>

        <!-- No autenticado -->
        <router-link v-if="!auth.user" to="/login">Iniciar sesión</router-link>
        <router-link v-if="!auth.user" to="/register">Registrarse</router-link>

        <!-- Autenticado -->
        <template v-if="auth.user">
          <router-link to="/panel">Panel</router-link>
          <router-link to="/cuenta">Cuenta</router-link>
          <div class="user-info">
            <span class="user-email">{{ auth.user.email }}</span>
            <button @click="handleLogout">Cerrar sesión</button>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import LogoEventizate from '@/components/LogoEventizate.vue'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>



<style scoped>
.header {
  background-color: #f0eae5;
  padding: 0.4rem 0; /* más compacto */
  color: #2c4a77;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo-link svg {
  height: 36px; /* antes era 50px */
  width: auto;
  transition: height 0.3s ease;
}
.logo-link svg {
  height: 50px;
  width: auto;
  transition: height 0.3s ease;
}

@media (min-width: 600px) {
  .logo-link svg {
    height: 42px; /* antes era 60px */
  }
}
.nav {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.nav a {
  color: #2c4a77;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.nav a:hover {
  color: #b98b4e; /* Dorado suave al hover */
}

button {
  background-color: transparent;
  border: 1.5px solid #2c4a77;
  color: #2c4a77;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: #b98b4e;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #2c4a77;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsividad móvil */
@media (max-width: 480px) {
  .container {
    flex-direction: column;
    gap: 0.8rem;
  }

  .nav {
    justify-content: center;
    gap: 0.5rem;
  }

  button,
  .nav a {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>

