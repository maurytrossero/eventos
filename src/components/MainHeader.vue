<!-- components/MainHeader.vue -->
<template>
  <header class="header">
    <div class="container">
      <!-- Logo -->
      <router-link to="/" class="logo-link">
        <LogoEventizate />
      </router-link>

      <!-- Botón hamburguesa solo en mobile -->
      <button class="menu-toggle" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Menú -->
      <nav :class="['nav', { open: isMenuOpen }]">
        <router-link to="/">Inicio</router-link>
        <router-link to="/about">¿Qué es?</router-link>
        <router-link to="/precios">Precios</router-link>
        <router-link v-if="auth.user" to="/ayuda">Ayuda</router-link>
        <router-link v-if="!auth.user" to="/login">Iniciar sesión</router-link>
        <router-link v-if="!auth.user" to="/register">Registrarse</router-link>
        <template v-if="auth.user">
          <router-link to="/panel">Panel</router-link>
          <router-link to="/cuenta">Cuenta</router-link>
          <div class="user-card">
            <span class="user-email">{{ auth.user.email }}</span>
            <button class="logout-btn" @click="handleLogout">Cerrar sesión</button>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import LogoEventizate from '@/components/LogoEventizate.vue'

const auth = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background-color: #f0eae5;
  padding: 0.4rem 1.5rem;
  color: #2c4a77;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* Logo */
.logo-link svg {
  height: 42px;
  width: auto;
  transition: height 0.3s ease;
}

/* Botón hamburguesa (solo mobile) */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

/* Menú */
.nav {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  transition: all 0.3s ease;
}

.nav a {
  color: #2c4a77;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.nav a:hover {
  color: #b98b4e;
}

/* Usuario logueado */
.user-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-left: 1rem;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
}

.logout-btn {
  background-color: transparent;
  border: 1.5px solid #2c4a77;
  color: #2c4a77;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.logout-btn:hover {
  background-color: #b98b4e;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 1.5rem;
    right: 1.5rem;
    background: #f0eae5;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.8rem 1rem;
    gap: 0.6rem;
    transform: translateY(-15px);
    opacity: 0;
    pointer-events: none;
    border-bottom: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 99;
  }

  .nav.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .user-card {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 0;
    gap: 0.3rem;
  }

  .logout-btn {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
}

/* Modo oscuro automático */
@media (prefers-color-scheme: dark) {
  .header {
    background-color: #2a2a34;
    color: #f5f5f5;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
  }

  .nav {
    background-color: #2a2a34;
  }

  .nav a {
    color: #e6dec9;
  }

  .nav a:hover {
    color: #b98b4e;
  }

  .logout-btn {
    border-color: #e6dec9;
    color: #e6dec9;
  }

  .logout-btn:hover {
    background-color: #b98b4e;
    color: white;
  }

  .menu-toggle {
    color: #f5f5f5;
  }
}
</style>



