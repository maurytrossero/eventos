<template>
  <div class="background-container">
    <div class="songs-list">
      <h2 class="title">Listado de Canciones</h2>
      <button @click="goBack" class="back-button">← Volver</button>
      <ul class="song-items">
        <li v-for="cancion in canciones" :key="cancion.id" class="song-item">
          <div class="song-info">
            <span class="song-name">{{ cancion.nombre }}</span>
            <span class="song-artist">{{ cancion.interprete }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCancionesByEvento } from '@/services/firestoreService';

interface Cancion {
  id?: string;
  nombre: string;
  interprete: string;
}

export default defineComponent({
  setup() {
    const canciones = ref<Cancion[]>([]);
    const route = useRoute();
    const idEvento = route.params.eventoId as string;

    const loadCanciones = async () => {
      try {
        canciones.value = await getCancionesByEvento(idEvento);
      } catch (error) {
        console.error("Error al cargar las canciones:", error);
      }
    };

    const goBack = () => {
      window.history.back();
    };

    onMounted(() => {
      loadCanciones();
    });

    return { canciones, goBack };
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.background-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f9fbfe, #dee9f7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 15px;
  font-family: 'Poppins', sans-serif;
}

.songs-list {
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.title {
  font-size: 2.2em;
  color: #1f3b5b;
  margin-bottom: 25px;
}

.back-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s, transform 0.2s;
}

.back-button:hover {
  background-color: #0d47a1;
  transform: scale(1.03);
}

.song-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-item {
  padding: 16px 20px;
  background-color: #fdfdfd;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}

.song-item:hover {
  transform: translateY(-3px);
}

.song-info {
  display: flex;
  justify-content: space-between;
  font-size: 1.05em;
  font-weight: 500;
  color: #333;
}

.song-artist {
  color: #777;
  font-weight: 400;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .background-container {
    background: linear-gradient(to bottom right, #1e1f26, #2c2f39);
  }

  .songs-list {
    background-color: #2a2d3a;
    color: #e0e0e0;
  }

  .title {
    color: #90caf9;
  }

  .song-item {
    background-color: #3b3f4f;
    color: #e0e0e0;
  }

  .song-artist {
    color: #b0bec5;
  }

  .back-button {
    background-color: #64b5f6;
    color: #10151b;
  }

  .back-button:hover {
    background-color: #42a5f5;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .title {
    font-size: 1.8em;
  }

  .song-info {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }

  .back-button {
    width: 100%;
  }
}
</style>
