<template>
  <div class="cuenta-regresiva" :style="{ backgroundImage: backgroundImage }">
    <div class="overlay">
      <h1>Cuenta Regresiva</h1>
      <div class="contador">
        <div class="tiempo">
          <transition-group name="slide-fade" tag="div" class="digit">
            <span v-for="(digit, index) in days" :key="'days-' + index">{{ digit }}</span>
          </transition-group>
          <p>Días</p>
        </div>
        <div class="tiempo">
          <transition-group name="slide-fade" tag="div" class="digit">
            <span v-for="(digit, index) in hours" :key="'hours-' + index">{{ digit }}</span>
          </transition-group>
          <p>Horas</p>
        </div>
        <div class="tiempo">
          <transition-group name="slide-fade" tag="div" class="digit">
            <span v-for="(digit, index) in minutes" :key="'minutes-' + index">{{ digit }}</span>
          </transition-group>
          <p>Minutos</p>
        </div>
        <div class="tiempo">
          <transition-group name="slide-fade" tag="div" class="digit">
            <span v-for="(digit, index) in seconds" :key="'seconds-' + index">{{ digit }}</span>
          </transition-group>
          <p>Segundos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Código de lógica sigue igual
import { ref, onMounted, computed, watch, defineProps } from 'vue';

const props = defineProps<{ targetDate: string }>();
const days = ref<string[]>(['0', '0']);
const hours = ref<string[]>(['0', '0']);
const minutes = ref<string[]>(['0', '0']);
const seconds = ref<string[]>(['0', '0']);

let targetDate = new Date(props.targetDate).getTime();

watch(() => props.targetDate, (newDate) => {
  targetDate = new Date(newDate).getTime();
  updateCountdown();
});

const backgroundImage = computed(() => {
  return window.innerWidth <= 768 
    ? "url('')" // URL de la imagen para móviles
    : "url('')" // URL de la imagen para desktop
});

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((distance % (1000 * 60)) / 1000);

  days.value = d.toString().padStart(2, '0').split('');
  hours.value = h.toString().padStart(2, '0').split('');
  minutes.value = m.toString().padStart(2, '0').split('');
  seconds.value = s.toString().padStart(2, '0').split('');
};

onMounted(() => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

.cuenta-regresiva {
  position: relative;
  height: 40vh; /* Reduce la altura total */
  margin: 5px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  overflow: hidden;
  border: 2px solid white;
  border-radius: 15px;
  box-sizing: border-box;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(55, 64, 146, 0.99);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-family: 'Great Vibes', cursive;
  padding: 15px; /* Reduce el padding */
}

h1 {
  font-size: 2.5em; /* Tamaño reducido */
  margin: 0;
  text-align: center;
  line-height: 1.1;
  overflow-wrap: break-word;
}

.contador {
  display: flex;
  gap: 8px; /* Espacio reducido entre contadores */
  margin-top: 15px;
  justify-content: center;
}

.tiempo {
  font-family: 'Open Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 4px; /* Espacio reducido en los márgenes */
}

.digit {
  display: flex;
  flex-direction: row;
  height: 50px; /* Reduce la altura del dígito */
  overflow: hidden;
}

.digit span {
  font-size: 1.8em; /* Tamaño reducido */
  display: inline-block;
  width: 100%;
}

.tiempo p {
  font-size: 0.9em; /* Tamaño de texto reducido */
  margin: 0;
}

/* Animación para los cambios */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.8em;
    display: block;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    max-width: 90%;
  }

  .digit span {
    font-size: 1.4em;
  }

  .tiempo p {
    font-size: 0.8em;
  }

  .contador {
    gap: 5px;
    padding: 10px;
  }

  .overlay {
    padding: 10px;
  }
}
</style>
