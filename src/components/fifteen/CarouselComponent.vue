<template>
  <div class="container">
    <!-- Adornos -->
    <img
      class="adorno superior"
      :src="adornoSuperior"
      alt="Adorno Superior"
      aria-hidden="true"
    />
    <img
      class="adorno inferior"
      :src="adornoInferior"
      alt="Adorno Inferior"
      aria-hidden="true"
    />

    <div class="content">
      <p class="quote">
        "El futuro pertenece<br />
        a quienes creen en la belleza<br />
        de sus sueños"
      </p>

      <div class="carousel">
        <transition-group name="fade" tag="div" class="carousel-inner">
          <img
            v-for="(img, idx) in images"
            v-show="currentIndex === idx"
            :key="img"
            :src="img"
            class="carousel-image"
            alt="Imagen galería"
            loading="lazy"
          />
        </transition-group>
      </div>

      <!-- Texto "GALERÍA DE FOTOS" -->
      <h2 class="gallery-title">GALERÍA DE FOTOS</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const adornoSuperior =
  "https://dl.dropboxusercontent.com/scl/fi/ng7hgiehcw270vy5fpkld/adorno-superior.png?rlkey=siwe9gz2wlzlaeq2ihi8jtdbd&st=j89m0pxm";
const adornoInferior =
  "https://dl.dropboxusercontent.com/scl/fi/fqccte9ioz89kmlog4lb3/adorno-inferior.png?rlkey=rsgkpbj2ty8jhwvh5kf2kwsy5&st=t9nn5t20";

const images = [
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1016/600/400",
  "https://picsum.photos/id/1018/600/400",
];

const currentIndex = ref(0);
let interval = null;

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.length;
}

onMounted(() => {
  interval = setInterval(nextImage, 11000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('../../assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'FairProsper';
  src: url('../../assets/fonts/FairProsper.woff') format('woff');
}


:global(html, body) {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  flex-direction: column;
}

.adorno {
  position: absolute;
  user-select: none;
  pointer-events: none;
  z-index: 10;
  opacity: 0.7;
  width: 25vw;
  height: auto;
  margin: 0;
  padding: 0;
}

.adorno.superior {
  top: 0;
  left: 0;
}
.adorno.inferior {
  bottom: 0;
  right: 0;
}

@media (max-width: 600px) {
  .adorno {
    width: 40vw;
    opacity: 0.6;
  }
}

.content {
  position: relative;
  z-index: 20;
  max-width: 700px;
  width: 100%;
  text-align: center;
  user-select: none;
  padding: 1rem;
}

.quote {
  font-family: "FairProsper", serif;  /* Aquí cambio a Fair Prosper */
  font-weight: 400;
  font-size: 2rem;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  color: #b6afa0;
}

.carousel {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  background-color: #eee;
  margin-bottom: 1rem;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2rem;
  opacity: 0;
  transform: scale(1);
  transition: opacity 1s ease;
  animation: zoomIn 10s ease forwards;
}

.carousel-image[v-show="true"] {
  opacity: 1;
  animation: zoomIn 10s ease forwards;
}

@keyframes zoomIn {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

.gallery-title {
  font-family: 'Bahnschrift', sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: #000;
  margin-top: 0.5rem;
  letter-spacing: 0.05em;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

@media (max-width: 600px) and (orientation: portrait) {
  .carousel {
    width: 80%;
    aspect-ratio: 3 / 2;
    border-radius: 1rem;
    margin: 0 auto 1rem auto;
  }

  .quote {
    font-size: 1.4rem;
    padding: 0 1rem;
  }

  .gallery-title {
    font-size: 1.3rem;
    margin-top: 0.75rem;
  }
}

@media (max-width: 800px) and (orientation: landscape) {
  .container {
    padding: 1rem;
    justify-content: flex-start;
  }

  .quote {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .carousel {
    width: auto;
    height: calc(100vh - 7rem); /* ajustamos según espacio de la quote */
    aspect-ratio: 3 / 2;
    max-height: 60vh;
    margin: 0 auto 1rem auto;
    border-radius: 1rem;
  }

  .gallery-title {
    font-size: 1rem;
  }
}


</style>
