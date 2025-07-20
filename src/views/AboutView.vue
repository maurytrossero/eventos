<!-- AboutView.vue -->
<template>
  <section class="about-container">
   <!-- Banner con logo y slogan -->
    <div class="header-banner animated fade-in-down" style="animation-delay: 0.1s">
      <LogoEventizate class="logo" />
      <div class="slogan">
        <strong>invita, juega, comparte en tiempo real</strong>
      </div>
    </div>
    
    <div class="image-row animated fade-in-up" style="animation-delay: 0.5s">
      <img src="https://img.freepik.com/free-vector/online-party-invitation-concept_23-2148575976.jpg" alt="Invitación virtual" />
      <img src="https://img.freepik.com/free-vector/people-sharing-photos-social-media_23-2148527093.jpg" alt="Galería en tiempo real" />
      <img src="https://img.freepik.com/free-vector/quiz-concept-illustration_114360-1059.jpg" alt="Trivia interactiva" />
    </div>

    <h1 class="animated fade-in-down" style="animation-delay: 0.3s">
      ¿Qué es Eventizate?
    </h1>

    <div class="intro animated fade-in" style="animation-delay: 0.4s">
      <p>
        <strong>Eventizate</strong> es una app web que te permite crear <strong>invitaciones digitales e interactivas</strong> para tus celebraciones. Ideal para cumpleaños, bodas, reuniones y más.
        Cada invitación es única, personalizable y accesible desde cualquier dispositivo.
      </p>
    </div>



    <section class="section-block animated fade-in-up" style="animation-delay: 0.7s">
      <div class="section-header">
        <PhCalendarCheck class="top-icon" size="48" weight="light" />
        <h2>¿Cómo funciona?</h2>
      </div>
      <p>
        Al crear un evento, la app genera automáticamente una invitación personalizada con acceso web. Desde allí, los invitados pueden:
        <br />
        ✔ Confirmar asistencia<br />
        ✔ Compartir fotos en tiempo real<br />
        ✔ Jugar trivias<br />
        ✔ Sugerir canciones<br />
        ¡Y mucho más!
      </p>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 0.9s">
      <div class="section-header">
        <PhCamera class="top-icon" size="48" weight="light" />
        <h2>Galería Interactiva</h2>
      </div>
      <p>
        Tus invitados pueden subir fotos durante el evento desde su celular. Todo se muestra en tiempo real en una galería dinámica, que podés moderar como anfitrión.
      </p>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 1.1s">
      <div class="section-header">
        <PhConfetti class="top-icon" size="48" weight="light" />
        <h2>Trivias Personalizadas</h2>
      </div>
      <p>
        Agregá preguntas divertidas sobre el homenajeado o el evento. Las trivias son ideales para romper el hielo y sumar risas a la celebración.
      </p>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 1.3s">
      <div class="section-header">
        <PhHeart class="top-icon" size="48" weight="light" />
        <h2>¿Por qué usar Eventizate?</h2>
      </div>
      <ul>
        <li><PhLightning size="28" weight="light" class="list-icon" /> Rápido y fácil de usar</li>
        <li><PhDevices size="28" weight="light" class="list-icon" /> Accesible desde cualquier dispositivo</li>
        <li><PhUserCircle size="28" weight="light" class="list-icon" /> Invitaciones únicas y personalizadas</li>
        <li><PhChatCenteredDots size="28" weight="light" class="list-icon" /> Interacción en tiempo real</li>
      </ul>
    </section>

    <section class="section-block animated fade-in-up" style="animation-delay: 1.5s">
      <div class="section-header">
        <PhEnvelopeSimple class="top-icon" size="48" weight="light" />
        <h2>Contacto</h2>
      </div>
      <p>
        ¿Querés más información? Escribinos a
        <a href="mailto:contacto@eventosapp.com">mtproduccioneshd@gmail.com</a> o seguinos en
        <a href="https://www.tiktok.com/@mauritrossero" target="_blank">TikTok</a>,
        <a href="https://facebook.com/mtproduccioneshd" target="_blank">Facebook</a> e
        <a href="https://instagram.com//mtproducciones.ok/" target="_blank">Instagram</a>.
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
  flex-direction: column;  /* vertical */
  align-items: center;     /* centrado horizontal */
  gap: 0.8rem;             /* separación entre logo y slogan */
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
@media (prefers-color-scheme: dark) {
  .about-container {
    background-color: #2e3b4e;
    color: #d6caa5;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
  }

  h1 {
    color: #b98b4e;
  }

  h2 {
    color: #d4a755;
  }

  .slogan {
    color: #d4a755;
  }

  .top-icon {
    color: #d4a755;
  }

  .intro p,
  li {
    color: #d6caa5;
  }

  ul {
    max-width: 480px;
  }

  a {
    color: #b98b4e;
  }

  a:hover {
    color: #8a6239;
  }

  .image-row img {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.8);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: none; }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: none; }
}
</style>
