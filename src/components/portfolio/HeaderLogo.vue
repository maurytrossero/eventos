<template>
  <div class="header-logo">
    <div class="carousel-container">
      <div class="carousel-track" :style="carouselStyle">
        <div
          v-for="image in backgroundImages"
          :key="image"
          :style="{ backgroundImage: `url(${image})` }"
          class="carousel-slide"
        ></div>
      </div>
    </div>
    <!-- Al hacer click en el logo se redirige a la ruta de invitacion -->
    <img :src="logoSrc" alt="Logo" class="logo" @click="goToInvitation" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const logoSrc = 'https://www.dropbox.com/scl/fi/gv2k4qop077jvccqdhriu/LOGO.jpg?rlkey=isw4oc0cdjzp8k7kac4gv9wsp&st=i465hsay&raw=1'; // Logo

// Vector de imágenes para el carrusel
const backgroundImages = ref([
  'https://www.dropbox.com/scl/fi/hgyvzblja8cj0wm6ni10j/fiesta-manfrey.jpg?rlkey=prijj0wu4jmnuq66zmxp9esjq&st=snbc1dzw&raw=1',
  'https://www.dropbox.com/scl/fi/d56ik6joirj0ns0d80s0m/axion2.jpg?rlkey=byfn0uncipahmaj3isq2hhpuq&st=gf5pfi2j&raw=1',
  'https://www.dropbox.com/scl/fi/g6yvj29gbtymue8hcr8mq/estadio-kempes.jpg?rlkey=napgyqztr2x1lxo5b8pkectxo&st=kj7kwqv0&raw=1',
  'https://www.dropbox.com/scl/fi/8p73n9x52xg065pigspf1/drone.jpg?rlkey=jei5o2h8ct3tol443vfbc28o5&st=a0d0otuh&raw=1'
])

const currentImageIndex = ref(0)

// Configura el estilo del carrusel
const carouselStyle = computed(() => ({
  transform: `translateX(-${currentImageIndex.value * 100}%)`,
  transition: 'transform 1s ease-in-out'
}))

onMounted(() => {
  setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % backgroundImages.value.length
  }, 5000) // Cambia la imagen cada 5 segundos
})

// Router para redirigir al componente 'invitacion'
const router = useRouter()
const goToInvitation = () => {
  router.push({ name: 'invitacion-virtual' }) // Redirige a la ruta '/invitacion'
}
</script>

<style scoped>
.header-logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 50px;
}

.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  background-size: cover;
  background-position: center;
}

.logo {
  z-index: 10;
  max-width: 150px;
  height: auto;
  border: 5px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  cursor: pointer; /* Agregar cursor de puntero para que parezca clicable */
}

@media (max-width: 768px) {
  .header-logo {
    height: 100vh; /* Ocupa toda la pantalla en dispositivos móviles */
    margin-bottom: 0; /* Elimina el margen inferior en vistas móviles */
  }

  .logo {
    max-width: 120px; /* Ajusta el tamaño del logo para dispositivos móviles */
  }
}
</style>
