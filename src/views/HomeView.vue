<!-- HomeView.vue -->
<template>
  <div class="home">
    <h1>Eventizate App</h1>
    <h2>Elige una categoría</h2>

    <!-- Introducción solo si NO está logueado -->
    <div v-if="!isLoggedIn" class="intro-box animate-fade-in">
      <h3>¿Nuevo en Eventizate?</h3>
      <p>
        Creá invitaciones digitales interactivas con trivias, galerías en tiempo real y confirmaciones.
        <br />
        ¡Ideal para cumpleaños, bodas y todo tipo de celebraciones!
      </p>
      <router-link to="/register" class="btn btn-highlight">Empezá ahora</router-link>
    </div>

    <div class="categories">
      <!-- Mostrar solo si es admin -->
      <div v-if="isAdmin" class="category animate-up">
        <h3><PhCalendarPlus size="24" /> Eventos</h3>
        <ul>
          <li><router-link to="/eventos">Agregar Evento</router-link></li>
          <li><router-link to="/eventos/lista">Ver Lista</router-link></li>
        </ul>
      </div>

      <!-- Usuarios-->
      <div v-if="isAdmin" class="category animate-up">
        <h3><PhUser size="24" /> Usuarios</h3>
        <ul>
          <li><router-link to="/usuarios">Gestión de Usuarios</router-link></li>
        </ul>
      </div>

      <div class="category animate-up">
        <h3><PhHouse size="24" /> Inicio</h3>
        <ul>
          <li><router-link to="/">Ir a Inicio</router-link></li>
        </ul>
      </div>

      <div class="category animate-up">
        <h3><PhInfo size="24" /> Acerca de</h3>
        <ul>
          <li><router-link to="/about">Sobre Nosotros</router-link></li>
        </ul>
      </div>

      <div class="category animate-up">
        <h3><PhUser size="24" /> Cuenta</h3>
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

    <!-- Funcionalidades destacadas -->
    <section class="features animate-fade-in">
      <h2>¿Qué podés hacer con Eventizate?</h2>
      <ul>
        <li><PhChatCenteredDots size="28" weight="light" class="list-icon" /> Crear invitaciones interactivas</li>
        <li><PhCamera size="28" weight="light" class="list-icon" /> Galerías de fotos en tiempo real</li>
        <li><PhConfetti size="28" weight="light" class="list-icon" /> Juegos y trivias personalizadas</li>
        <li><PhEnvelopeSimple size="28" weight="light" class="list-icon" /> Confirmación y comunicación con invitados</li>
      </ul>
    </section>

    <!-- Footer contacto -->
    <footer class="home-footer animate-fade-in">
      <p>¿Consultas? <a href="mailto:mtproduccioneshd@gmail.com">Contactanos</a></p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import {
  PhHouse,
  PhCalendarPlus,
  PhInfo,
  PhUser,
  PhConfetti,
  PhChatCenteredDots,
  PhCamera,
  PhEnvelopeSimple
} from '@phosphor-icons/vue'

const auth = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => !!auth.user)
const isAdmin = computed(() => auth.isAdmin)
/*
onMounted(() => {
  if (auth.user) {
    router.push('/panel')
  }
})*/
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 60px;
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

.intro-box {
  background: #b98b4e;
  color: white;
  max-width: 560px;
  padding: 1.8rem 2rem;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(185, 139, 78, 0.3);
  text-align: center;
}

.btn-highlight {
  margin-top: 1rem;
  padding: 0.8rem 1.6rem;
  font-weight: 700;
  border-radius: 12px;
  background: #fff;
  color: #b98b4e;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.btn-highlight:hover {
  background-color: #e6d9c3;
  color: #9a733b;
}

.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 960px;
  margin-bottom: 40px;
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

.features {
  max-width: 700px;
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(185, 139, 78, 0.15);
  color: #34495e;
  text-align: left;
  margin-bottom: 50px;
}

.features h2 {
  color: #b98b4e;
  margin-bottom: 1rem;
  text-align: center;
}

.features ul {
  list-style: none;
  padding-left: 0;
}

.features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.list-icon {
  color: #b98b4e;
}

.home-footer {
  font-size: 1.1rem;
  color: #406d9e;
}

.home-footer a {
  color: #b98b4e;
  font-weight: 600;
  text-decoration: none;
}

.home-footer a:hover {
  text-decoration: underline;
  color: #9a733b;
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

.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}

.animate-up {
  animation: fadeInUp 0.8s ease forwards;
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

  .intro-box {
    background: #9a733b;
    box-shadow: 0 8px 20px rgba(154, 115, 59, 0.3);
    color: #f0e6d2;
  }

  .btn-highlight {
    background: #f5f5f5;
    color: #9a733b;
  }

  .btn-highlight:hover {
    background-color: #e0d7c3;
    color: #654f27;
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

  .features {
    background: #2e3b4e;
    color: #d6caa5;
    box-shadow: 0 10px 25px rgba(154, 115, 59, 0.15);
  }

  .list-icon {
    color: #9a733b;
  }

  .home-footer {
    color: #b98b4e;
  }

  .home-footer a {
    color: #e1c27d;
  }
}

/* Responsive */
@media (max-width: 600px) {
  h1 {
    font-size: 2.2em;
  }
  h2 {
    font-size: 1.4em;
  }
  .features ul {
    font-size: 1rem;
  }
}
</style>
