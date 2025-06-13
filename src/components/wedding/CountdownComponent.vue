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
  import { ref, onMounted, computed } from 'vue'
  
  const targetDate = new Date('2024-11-23T17:00:00').getTime()
  const days = ref<string[]>(['0', '0'])
  const hours = ref<string[]>(['0', '0'])
  const minutes = ref<string[]>(['0', '0'])
  const seconds = ref<string[]>(['0', '0'])
  
  // Computed property for background image
  const backgroundImage = computed(() => {
    return window.innerWidth <= 768 
      ? "url('https://dl.dropboxusercontent.com/scl/fi/rgynuaxbx2bnlomrbovqa/DSC_5877V.jpg?rlkey=pvoiylrouwt9ez1gdi90wi5eh&dl=1')" // URL de la imagen para móviles
      : "url('https://dl.dropboxusercontent.com/scl/fi/tomyp07mxjuvdeixwe94z/DSC_5877.jpg?rlkey=gshrm2a20w49dspunprs89top&st=1snq9htw')" // URL de la imagen para desktop
  })
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    let distance = targetDate - now;

    // Si la fecha ya pasó, establece la cuenta en cero
    if (distance <= 0) {
      days.value = ['0', '0'];
      hours.value = ['0', '0'];
      minutes.value = ['0', '0'];
      seconds.value = ['0', '0'];
      return; // No continúa calculando el tiempo
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    days.value = d.toString().padStart(2, '0').split('');
    hours.value = h.toString().padStart(2, '0').split('');
    minutes.value = m.toString().padStart(2, '0').split('');
    seconds.value = s.toString().padStart(2, '0').split('');
  }
  
  onMounted(() => {
    updateCountdown()
    setInterval(updateCountdown, 1000) // Actualiza cada segundo
  })
</script>
  
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
  
  .cuenta-regresiva {
    position: relative;
    height: calc(100vh - 50px); /* Reduce el margen inferior */
    margin: 5px; /* Aplica margen de 10px alrededor */
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    overflow: hidden;
    border: 2px solid white; /* Añade el borde blanco */
    border-radius: 15px; /* Esquinas redondeadas */
    box-sizing: border-box; /* Incluye el borde en el tamaño del elemento */
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    font-family: 'Great Vibes', cursive;
    padding: 20px;
  }
  
  h1 {
    font-size: 3em;
    margin: 0;
    text-align: center;
    line-height: 1.1; /* Ajusta la altura de la línea para mejorar la legibilidad */
    overflow-wrap: break-word; /* Permite que el texto se rompa para ajustarse al contenedor */
  }
  
  .contador {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: center;
  }
  
  .tiempo {
    font-family: 'Open Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 5px;
  }
  
  .digit {
    display: flex;
    flex-direction: row;
    height: 60px;
    overflow: hidden;
  }
  
  .digit span {
    font-size: 2em;
    display: inline-block;
    width: 100%;
  }
  
  .tiempo p {
    font-size: 1em;
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
  
  /* Responsive styling */
  @media (max-width: 768px) {
    h1 {
      font-size: 2em;
      display: block;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      max-width: 90%;
    }
  
    .digit span {
      font-size: 1.5em;
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
  