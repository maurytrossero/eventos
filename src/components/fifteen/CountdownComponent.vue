<template>
  <div
    class="container"
    :style="{ backgroundImage: `url('${backgroundUrl}')` }"
  >
    <div class="overlay">
      <div class="header">
        <h2>MIS QUINCE</h2>
        <h1>Kyara</h1>
      </div>

      <div v-if="isEventToday" class="message">¡Llegó el gran día!</div>

      <div v-else class="countdown">
        <div class="time-box" v-for="(val, label) in time" :key="label">
          <div class="time-value">{{ val }}</div>
          <div class="time-label">{{ label }}</div>
        </div>
      </div>

      <div class="date">16 · Agosto · 2025</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const eventDate = new Date('2025-08-16T00:00:00')

const time = ref({
  DÍAS: '00',
  HORAS: '00',
  MINUTOS: '00',
  SEGUNDOS: '00'
})

const isEventToday = ref(false)
let interval = null

const backgroundUrl = ref('') // Dinámico

function updateBackground() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  const isMobile = window.innerWidth <= 768

  backgroundUrl.value = isMobile && isPortrait
    ? 'https://dl.dropboxusercontent.com/scl/fi/mbuurifow6wrqzblkq55n/fondo-cuenta-regresiva.jpg?rlkey=mjh2idwb921bgidgwjxxgo03l&st=pa40y6zy'
    : 'https://dl.dropboxusercontent.com/scl/fi/3pe534n3rtymvhtlpxf34/fondo-cuenta-regresiva-horizontal.jpg?rlkey=2i5soo6xdsd7jz7rirv06kim2&st=jr834jrh'
}

function updateCountdown() {
  const now = new Date()
  const startOfEventDay = new Date(eventDate)
  const endOfEventDay = new Date(eventDate)
  endOfEventDay.setHours(23, 59, 59)

  if (now >= startOfEventDay && now <= endOfEventDay) {
    isEventToday.value = true
    return
  }

  const diff = eventDate - now
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  time.value = {
    DÍAS: String(days).padStart(2, '0'),
    HORAS: String(hours).padStart(2, '0'),
    MINUTOS: String(minutes).padStart(2, '0'),
    SEGUNDOS: String(seconds).padStart(2, '0')
  }
}

onMounted(() => {
  updateCountdown()
  updateBackground()
  window.addEventListener('resize', updateBackground)
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
  window.removeEventListener('resize', updateBackground)
})
</script>


<style scoped>
@font-face {
  font-family: 'Amelia Faith';
  src: url('../../assets/fonts/AmeliaFaithRegular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Bahnschrift';
  src: url('../../assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}


/* Elimina márgenes y padding predeterminados del navegador */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Evita scroll horizontal */
  height: 100%;
  width: 100%;
}

/* Contenedor principal de pantalla completa */
.container {
  position: relative;
  width: 100%;
  height: 100vh; /* Altura de toda la pantalla */
  background-size: cover;
  background-position: right bottom;
  background-repeat: no-repeat;
  overflow: hidden;

  display: flex;
  align-items: center;  /* Centrado vertical del contenido */
  justify-content: center; /* Centrado horizontal */
}

/* Capa negra transparente encima de fondo */
.container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Cambiar opacidad aquí */
  z-index: 1;
}

/* Contenedor del contenido principal */
.overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 480px; /* Cambiá esto para hacerlo más ancho o más angosto */
  text-align: center;
  padding: 2rem 1rem; /* Ajusta espaciado interno */
  color: white;
  font-family: 'Bahnschrift', Thin;

}

/* Texto secundario superior (como fecha o ubicación) */
.header h2 {
  font-size: 0.9rem; /* Cambiá tamaño del texto secundario */
  letter-spacing: 2px; /* Espaciado entre letras */
  margin-bottom: 0.2rem;
}

/* Título principal (nombre, evento, etc.) */
.header h1 {
  font-family: 'Amelia Faith', cursive; /* Cambiá la fuente aquí */
  font-size: 3rem; /* Cambiá tamaño del título */
  font-weight: normal;
}

/* Cuenta regresiva */
.countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem auto;
  padding: 0 1rem; /* Padding reducido para evitar scroll */
  box-sizing: border-box;
  white-space: nowrap; /* Evita que se bajen a otra línea */
  overflow: visible; /* Mostrar contenido completo */
  max-width: 100%;
  flex-wrap: nowrap;
}

.time-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 40px; /* Tamaño mínimo pequeño para móviles */
  text-align: center;
  flex-shrink: 1; /* Permite achicar si no hay espacio */
}

.time-value {
  font-size: 2rem; /* Tamaño base de números */
  font-weight: bold;
}

.time-label {
  font-size: 0.75rem;
  margin-top: 0.3rem;
  text-transform: uppercase;
}

/* Fecha del evento con líneas decorativas arriba y abajo */
.date {
  position: relative;
  margin-top: 1.5rem;
  padding: 0.8rem 0;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-align: center;
  color: white;
}

.date::before,
.date::after {
  content: "";
  display: block;
  height: 2px;
  background-color: white;
  width: 15%;
  margin: 1rem auto;
}

/* Mensaje adicional */
.message {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 2rem 0;
  color: #ffe680;
}

/* Responsivo para móviles (hasta 600px) */
@media (max-width: 600px) {
  .countdown {
    gap: 1.5rem;
    padding: 0 0.5rem; /* Padding aún más pequeño */
  }

  .time-box {
    min-width: 30px; /* Más pequeño para móviles */
  }

  .time-value {
    font-size: 1.5rem;
  }

  .time-label {
    font-size: 0.6rem;
  }
}

/* Pantallas medianas y grandes */
@media (min-width: 601px) and (max-width: 899px) {
  .countdown {
    gap: 2rem;
    padding: 0 1rem;
  }

  .time-box {
    min-width: 50px;
  }

  .time-value {
    font-size: 2.5rem;
  }

  .time-label {
    font-size: 0.75rem;
  }
}

/* Pantallas grandes desde 900px en adelante */
@media (min-width: 900px) {
  .header h2 {
    font-size: 1.2rem;
    letter-spacing: 3px;
  }

  .header h1 {
    font-size: 5rem;
  }

  .countdown {
    gap: 3rem;
    padding: 0 4vw;
    max-width: 100%;
  }

  .time-box {
    min-width: 90px;
  }

  .time-value {
    font-size: 3.5rem;
  }

  .time-label {
    font-size: 1rem;
  }

  .date {
    font-size: 1.2rem;
  }

  .message {
    font-size: 2rem;
  }

  .date::before,
  .date::after {
    width: 25%;
  }
}
</style>
