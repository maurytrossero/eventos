<!-- components/fifteen/CountdownComponent.vue -->
<template>
  <div class="container" :style="{ backgroundImage: `url('${backgroundUrl}')` }">
    <div class="overlay">
      <div class="header">
        <h2>{{ evento.titulo || 'MIS QUINCE' }}</h2>
        <h1>{{ evento.nombreQuinceanera }}</h1>
      </div>

      <div v-if="isEventToday" class="message">¡Llegó el gran día!</div>

      <div v-else class="countdown">
        <div class="time-box" v-for="(val, label) in time" :key="label">
          <div class="time-value">{{ val }}</div>
          <div class="time-label">{{ label }}</div>
        </div>
      </div>

      <div class="date">{{ fechaFormateada }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { parseISO, format,  isValid  } from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps<{
  evento: {
    fecha: string
    nombreQuinceanera: string
    imagenFondo?: string  
    titulo?: string 
  }
}>()
const defaultDate = new Date() // por ejemplo, hoy

const eventDate = ref<Date>(parseISO(props.evento.fecha))

const fechaFormateada = computed(() => {
  const date = eventDate.value ? new Date(eventDate.value) : defaultDate
  if (!isValid(date)) return 'Fecha inválida'
  return format(date, "d '·' MMMM '·' yyyy", { locale: es })
})

const time = ref({
  DÍAS: '00',
  HORAS: '00',
  MINUTOS: '00',
  SEGUNDOS: '00'
})

const isEventToday = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const backgroundUrl = ref('')

// Función para decidir fondo default según orientación y tamaño
function getDefaultBackgroundUrl() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  const isMobile = window.innerWidth <= 768

  return isMobile && isPortrait
    ? 'https://dl.dropboxusercontent.com/scl/fi/mbuurifow6wrqzblkq55n/fondo-cuenta-regresiva.jpg?rlkey=mjh2idwb921bgidgwjxxgo03l&st=pa40y6zy'
    : 'https://dl.dropboxusercontent.com/scl/fi/3pe534n3rtymvhtlpxf34/fondo-cuenta-regresiva-horizontal.jpg?rlkey=2i5soo6xdsd7jz7rirv06kim2&st=jr834jrh'
}

// Actualiza background según props.evento.imagenFondo, si no existe usa default dinámico
function updateBackground() {
  if (props.evento.imagenFondo && props.evento.imagenFondo.trim() !== '') {
    backgroundUrl.value = props.evento.imagenFondo
  } else {
    backgroundUrl.value = getDefaultBackgroundUrl()
  }
}

function updateCountdown() {
  const now = new Date()
  const start = new Date(eventDate.value)
  const end = new Date(eventDate.value)
  end.setHours(23, 59, 59)

  if (now >= start && now <= end) {
    isEventToday.value = true
    return
  }

  const diff = eventDate.value.getTime() - now.getTime()

  if (diff < 0) {
    const elapsedSeconds = Math.floor((now.getTime() - eventDate.value.getTime()) / 1000)
    const days = Math.floor(elapsedSeconds / (3600 * 24))
    const hours = Math.floor((elapsedSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((elapsedSeconds % 3600) / 60)
    const seconds = elapsedSeconds % 60

    time.value = {
      DÍAS: String(days).padStart(2, '0'),
      HORAS: String(hours).padStart(2, '0'),
      MINUTOS: String(minutes).padStart(2, '0'),
      SEGUNDOS: String(seconds).padStart(2, '0')
    }
    return
  }

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
  updateBackground()
  updateCountdown()
  window.addEventListener('resize', updateBackground)
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
  window.removeEventListener('resize', updateBackground)
})

// Escuchar cambios reactivos en el evento para actualizar la fecha y la imagen
watch(() => props.evento, (nuevoEvento) => {
  eventDate.value = parseISO(nuevoEvento.fecha)
  updateCountdown()
  updateBackground()
}, { deep: true })

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
  font-family: 'Amelia Faith', cursive;
  font-weight: normal;
  text-align: center;

  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;

  font-size: clamp(1.5rem, 10vw, 4rem);
  max-width: 100%;
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