<!-- components/fifteen/ManagerComponent.vue -->
<template>
  <nav class="nav-container">
    <div class="overlay">
      <div class="nav-content">
        <button class="nav-button" @click="navigate('/invitacion-kyara-invitados')">
          👥 Ver invitados confirmados
        </button>
        <button class="nav-button" @click="navigate('/invitacion-kyara-mesas')">
          🪑 Ver y gestionar mesas
        </button>
        <button class="nav-button" @click="navigate('/invitacion-kyara-musica-sugerida')">
          🎵 Ver lista de música sugerida
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function navigate(url) {
  router.push(url)
}
</script>

<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('@/assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.nav-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-image: url('https://blog.hiltoncolombia.com/hs-fs/hubfs/1%20(66).jpg?width=5568&name=1%20(66).jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
}


.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.nav-button {
  font-family: 'Bahnschrift', sans-serif;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s, color 0.3s;
  white-space: nowrap;
  user-select: none;
}

.nav-button:hover {
  background-color: white;
  color: black;
  transform: scale(1.05);
}

@media (max-width: 400px) {
  .nav-content {
    gap: 1rem;
  }

  .nav-button {
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
  }
}
</style>
