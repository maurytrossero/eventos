<!-- src/views/HelpView.vue -->
<template>
  <section class="about-container">
    <!-- Banner -->
    <div class="header-banner animated fade-in-down" style="animation-delay: 0.1s">
      <LogoEventizate class="logo" />
      <div class="slogan">
        <strong>Tu guía rápida para usar Eventizate</strong>
      </div>
    </div>

    <h1 class="animated fade-in-down" style="animation-delay: 0.3s">Manual de Usuario</h1>

    <section class="section-block animated fade-in-up" style="animation-delay: 0.5s">
      <div class="section-header">
        <PhInfo class="top-icon" size="48" weight="light" />
        <h2>Introducción</h2>
      </div>
      <p>
        Bienvenido a Eventizate, la plataforma que te permite crear invitaciones digitales interactivas, personalizar tus eventos y compartir momentos en tiempo real.
      </p>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 0.7s">
      <div class="section-header">
        <PhCalendarCheck class="top-icon" size="48" weight="light" />
        <h2>Crear un Evento</h2>
      </div>
      <ol class="list-decimal ml-5 mt-2 text-lg space-y-1">
        <li>Registrate o inicia sesión en la plataforma.</li>
        <li>Haz clic en <strong>"Crear evento"</strong> y completa los datos básicos.</li>
        <li>Personaliza la invitación: título, fecha, imagen de fondo.</li>
        <li>Activa o desactiva secciones como galería, trivia y cuenta regresiva.</li>
        <li>Guarda los cambios para generar el enlace de invitación.</li>
      </ol>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 0.9s">
      <div class="section-header">
        <PhCamera class="top-icon" size="48" weight="light" />
        <h2>Galería Interactiva</h2>
      </div>
      <p>
        Los invitados pueden subir fotos en tiempo real durante el evento, que se mostrarán en una galería dinámica que podrás moderar desde tu panel.
      </p>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 1.1s">
      <div class="section-header">
        <PhConfetti class="top-icon" size="48" weight="light" />
        <h2>Trivias y Juegos</h2>
      </div>
      <p>
        Crea trivias personalizadas para entretener a tus invitados y hacer la celebración más divertida y participativa.
      </p>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 1.3s">
      <div class="section-header">
        <PhHeart class="top-icon" size="48" weight="light" />
        <h2>Consejos para aprovechar Eventizate</h2>
      </div>
      <ul>
        <li><PhLightning size="28" weight="light" class="list-icon" /> Mantén tus datos actualizados para que los invitados tengan siempre la información correcta.</li>
        <li><PhDevices size="28" weight="light" class="list-icon" /> Comparte el enlace de la invitación para que todos puedan acceder desde cualquier dispositivo.</li>
        <li><PhUserCircle size="28" weight="light" class="list-icon" /> Usa imágenes de buena calidad para mejorar la experiencia visual.</li>
        <li><PhChatCenteredDots size="28" weight="light" class="list-icon" /> Revisa regularmente la galería y la trivia para interactuar con tus invitados.</li>
      </ul>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 1.5s">
      <div class="section-header">
        <PhEnvelopeSimple class="top-icon" size="48" weight="light" />
        <h2>Contacto y Soporte</h2>
      </div>
      <p>
        ¿Tenés dudas o necesitás ayuda? Escríbenos a
        <a href="mailto:mtproduccioneshd@gmail.com">mtproduccioneshd@gmail.com</a> o seguinos en
        <a href="https://www.tiktok.com/@mauritrossero" target="_blank" rel="noopener">TikTok</a>,
        <a href="https://facebook.com/mtproduccioneshd" target="_blank" rel="noopener">Facebook</a> e
        <a href="https://instagram.com/mtproducciones.ok" target="_blank" rel="noopener">Instagram</a>.
      </p>
    </section>
  </section>
</template>

<script setup lang="ts">
import LogoEventizate from '@/components/LogoEventizate.vue'
import {
  PhInfo,
  PhCalendarCheck,
  PhCamera,
  PhConfetti,
  PhHeart,
  PhEnvelopeSimple,
  PhLightning,
  PhDevices,
  PhUserCircle,
  PhChatCenteredDots
} from '@phosphor-icons/vue'
</script>

<style scoped>
.about-container {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem 3rem;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  color: #1f2d3d;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* Banner */
.header-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.logo {
  width: 250px;
  height: auto;
}

.slogan {
  font-size: 1.5rem;
  color: #b98b4e;
  font-weight: 600;
  text-align: center;
}

/* Títulos */
h1 {
  font-size: 2.8rem;
  margin-bottom: 2rem;
  color: #406d9e;
}

h2 {
  font-size: 2.2rem;
  color: #2c4a77;
  margin-top: 0.5rem;
}

/* Iconos arriba de títulos */
.top-icon {
  display: block;
  margin: 0 auto 0.5rem;
  color: #b98b4e;
}

/* Sección encabezados */
.section-header {
  margin-bottom: 1rem;
}

/* Texto intro */
.intro p {
  font-size: 1.25rem;
  color: #34495e;
  max-width: 700px;
  margin: 0 auto 2rem;
}

/* Galería imágenes */
.image-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.image-row img {
  width: 280px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 6px 18px rgba(31, 45, 61, 0.12);
  transition: transform 0.3s ease;
}

.image-row img:hover {
  transform: scale(1.05);
}

/* Bloques de secciones */
.section-block {
  margin-bottom: 3rem;
}

/* Listas */
ul {
  list-style: none;
  padding-left: 0;
  margin: 1.5rem auto 0;
  max-width: 480px;
  text-align: left;
}

li {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #34495e;
}

.list-icon {
  color: #b98b4e;
}

/* Links */
a {
  color: #b98b4e;
  font-weight: 600;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #8a6239;
}

/* Animaciones */
.animated {
  opacity: 0;
  transform: translateY(20px);
  animation-fill-mode: both;
  animation-duration: 0.8s;
  animation-timing-function: ease-out;
}

.fade-in {
  animation-name: fadeIn;
}

.fade-in-down {
  animation-name: fadeInDown;
}

.fade-in-up {
  animation-name: fadeInUp;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

/* 🌙 Modo oscuro automático */
@media (prefers-color-scheme: dark) {
  .about-container {
    background-color: #1e1e2f;
    color: #f5f5f5;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  h1,
  h2 {
    color: #cfcaa5;
  }

  .slogan {
    color: #b98b4e;
  }

  a {
    color: #b98b4e;
  }

  a:hover {
    color: #8a6239;
  }

  li {
    color: #dcdcdc;
  }

  .top-icon {
    color: #b98b4e;
  }
}
</style>

