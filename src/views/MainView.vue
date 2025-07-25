//views/HomeView.vue (actualizado)
<template>
  <div class="home">
    <h1>Bienvenido a Eventizate</h1>
    <h2>¿Qué querés hacer hoy?</h2>

    <div class="categories">
      <div class="category">
        <h3><PhHouse size="24" /> Inicio</h3>
        <ul>
          <li><router-link to="/">Ir a Inicio</router-link></li>
          <li><router-link to="/about">¿Qué es Eventizate?</router-link></li>
        </ul>
      </div>

      <div class="category">
        <h3><PhCalendarPlus size="24" /> Mi Panel</h3>
        <ul>
          <li><router-link to="/panel">Ver Panel</router-link></li>
          <li><router-link to="/eventos">Crear Evento</router-link></li>
          <li><router-link to="/eventos/lista">Mis Eventos</router-link></li>
        </ul>
      </div>

      <div class="category">
        <h3><PhTag size="24" /> Planes</h3>
        <ul>
          <li><router-link to="/precios">Ver Planes</router-link></li>
          <li><router-link to="/checkout">Ir a Checkout</router-link></li>
          <li><router-link to="/cuenta">Mi Cuenta</router-link></li>
        </ul>
      </div>

      <div class="category">
        <h3>Cuenta</h3>
        <ul>
          <template v-if="isLoggedIn">
            <li><router-link to="/panel">Ir al Panel</router-link></li>
          </template>
          <template v-else>
            <li><router-link to="/login">Iniciar sesión</router-link></li>
            <li><router-link to="/register">Registrarse</router-link></li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PhHouse, PhCalendarPlus, PhTag } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    PhHouse,
    PhCalendarPlus,
    PhTag
  },
  setup() {
    const auth = useAuthStore()
    const isLoggedIn = computed(() => !!auth.user)

    return { isLoggedIn }
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to bottom right, #f9fbfc, #e8f1f8);
  color: #1f2d3d;
}

h1 {
  font-size: 2.8em;
  color: #1a3c64;
  margin-bottom: 10px;
  animation: fadeInDown 0.8s ease-out;
}

h2 {
  font-size: 1.6em;
  color: #406d9e;
  margin-bottom: 30px;
  animation: fadeIn 1s ease-out;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 960px;
}

.category {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.8s ease;
}

.category:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
}

.category h3 {
  font-size: 1.4em;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category li {
  margin-bottom: 10px;
}

.category li a {
  font-size: 1.05em;
  color: #1976d2;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.category li a:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* Animaciones */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .home {
    background: linear-gradient(to bottom right, #1e1e2f, #2c3e50);
    color: #f5f5f5;
  }

  h1 {
    color: #e1ecf4;
  }

  h2 {
    color: #bcdffb;
  }

  .category {
    background-color: #2e3b4e;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
  }

  .category h3 {
    color: #f0f8ff;
  }

  .category li a {
    color: #90caf9;
  }

  .category li a:hover {
    color: #64b5f6;
  }
}

/* Responsive */
@media (max-width: 600px) {
  h1 { font-size: 2.2em; }
  h2 { font-size: 1.4em; }
}
</style>
