<!-- components/fifteen/ModalComponent.vue -->
<template>
  <div
    class="card"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="card-inner" :class="{ flipped: isFlipped }">
      <!-- Frente -->
      <div
        class="card-front"
        :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${frontImage})` }"
      >
        <div class="front-content">
          <component :is="FrontIconComponent" size="48" class="icon" />
          <p v-if="frontText" class="front-text">{{ frontText }}</p>
        </div>
      </div>

      <!-- Atrás -->
      <div class="card-back">
        <img
          src="https://dl.dropboxusercontent.com/scl/fi/f671ih37wawblpzykpmkq/tarjeta.png?rlkey=g372wrfe4b8zrxbwv2nstfoqa"
          alt="Decoración"
          class="back-decoration"
        />
        <div class="back-content">
          <template v-if="backContent && backContent.type === 'price'">
            <ul>
              <li v-for="(price, i) in backContent.prices" :key="i">
                {{ price.description }}: {{ price.amount }}
              </li>
            </ul>
          </template>

          <template v-else-if="backContent && backContent.type === 'location'">
            <div class="modal-back-content location">
              <p class="direccion" v-html="formattedAddress"></p>
              <a
                :href="backContent.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="boton-maps"
              >
                Ver en Google Maps
              </a>
            </div>
          </template>

          <template v-else-if="backContent && backContent.type === 'music'">
            <p>¿Quieres sugerir música? Haz clic para abrir el formulario.</p>
            <button @click="$emit('open-music-form')" class="boton abrir-formulario">Abrir Formulario Música</button>
          </template>

          <template v-else>
            <p>Contenido no disponible.</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Cake, Gift, Info, Music } from "lucide-vue-next";

const props = defineProps({
  frontImage: String,
  frontText: String,
  frontIcon: String,
  backContent: {
    type: Object,
    default: () => ({}),
  }
});

const formattedAddress = computed(() => {
  return props.backContent.address
    ? props.backContent.address.replace(/\n/g, '<br />')
    : '';
});

const iconMap = {
  cake: Cake,
  gift: Gift,
  info: Info,
  music: Music,
};

const FrontIconComponent = computed(() => iconMap[props.frontIcon] || Info);

const isFlipped = ref(false);

const isMobile = ref(false);
onMounted(() => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
});

const handleMouseEnter = () => {
  if (!isMobile.value) isFlipped.value = true;
};

const handleMouseLeave = () => {
  if (!isMobile.value) isFlipped.value = false;
};

const handleClick = () => {
  if (isMobile.value) isFlipped.value = !isFlipped.value;
};
</script>

<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('../../assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: 100 700;
  font-style: normal;
}

.card {
  width: 320px;
  height: 240px; /* Proporción 4:3 */
  perspective: 1000px;
  cursor: pointer;
  font-family: 'Bahnschrift';
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid #71937b;
  font-family: 'Bahnschrift';
}

.card-front {
  background-size: cover;
  background-position: center;
  color: white;
  flex-direction: column;
}

.front-content {
  text-align: center;
  z-index: 1;
}

.icon {
  color: white;
}

.front-text {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.card-back {
  background-color: white;
  transform: rotateY(180deg);
  padding: 0;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  position: relative;
}

.back-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
  z-index: 0;
  opacity: 0.9;
  pointer-events: none;
}

.back-content {
  position: relative;
  z-index: 1;
  color: black;
  font-family: 'Bahnschrift';
  padding: 1rem;
}

.back-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.back-content li {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.back-content a {
  color: #436436;
  text-decoration: underline;
  font-weight: 600;
}

.back-content button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #71937b;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.back-content button:hover {
  background-color: #5a7963;
}

</style>
