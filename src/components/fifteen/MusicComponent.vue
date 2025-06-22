<!-- components/fifteen/MusicComponent.vue -->
<template>
  <div class="background-container">
    <div class="overlay">
      <div class="songs-list">
        <h2 class="title">Listado de Canciones</h2>

        <div v-if="canciones.length === 0" class="no-songs">Aún no se han sugerido canciones.</div>

        <div v-else class="table-wrapper">
          <table class="songs-table">
            <thead>
              <tr>
                <th>Sugerida Por</th>
                <th>Título</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cancion in canciones" :key="cancion.id">
                <td>{{ cancion.nombre }}</td>
                <td>{{ cancion.cancion }}</td>
                <td>
                  <button class="action-button" @click="reproducir(cancion.youtube)">▶ Reproducir</button>
                  <button class="action-button" @click="pausar">⏸ Pausar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Reproductor oculto -->
        <div
          id="youtube-player"
          style="width:1px; height:1px; position:absolute; top:0; left:0; visibility:hidden;"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* global YT */
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { db } from '@/firebase';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
  var YT: any;
}

interface Cancion {
  id: string;
  nombre: string;
  cancion: string;
  youtube: string;
  creada: any;
}

let player: any;

export default defineComponent({
  name: "SongsList",
  setup() {
    const canciones = ref<Cancion[]>([]);

    let unsubscribe: () => void;

    const loadCanciones = () => {
      console.log("Cargando canciones...");
      const songsCollection = collection(db, 'kiara-musica');
      unsubscribe = onSnapshot(
        songsCollection,
        (snapshot: QuerySnapshot<DocumentData>) => {
          canciones.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Cancion[];
          console.log("Canciones cargadas:", canciones.value);
        },
        (error) => {
          console.error("Error al obtener canciones en tiempo real:", error);
        }
      );
    };

    const reproducir = (youtubeUrl: string) => {
    console.log("Intentando reproducir URL:", youtubeUrl);
    const videoId = extraerIdYoutube(youtubeUrl);

    if (!videoId) {
      alert("El ID de YouTube no es válido.");
      return;
    }

    console.log("Reproduciendo video con ID:", videoId);

    if (player) {
      player.loadVideoById(videoId);
      player.playVideo();
    } else {
      console.warn("Player aún no está inicializado.");
    }
  };
  // Función auxiliar para extraer el ID del video de una URL
  function extraerIdYoutube(url: string): string | null {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w\-]{11})/);
    return match ? match[1] : null;
  }

    const pausar = () => {
      if (player && typeof player.pauseVideo === "function") {
        console.log("Pausando video");
        player.pauseVideo();
      } else {
        console.warn("No se puede pausar. Player no está listo:", player);
      }
    };

    const onYouTubeIframeAPIReady = () => {
      console.log("YouTube Iframe API lista. Inicializando player...");
      player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            console.log("Player listo:", event);
          },
          onError: (error: any) => {
            console.error("Error en el reproductor:", error);
          }
        }
      });
    };

    onMounted(() => {
      console.log("Componente montado");
      loadCanciones();

      if (!window.YT || typeof window.YT.Player !== "function") {
        console.log("Cargando script de YouTube...");
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      } else {
        console.log("YouTube API ya disponible.");
        onYouTubeIframeAPIReady();
      }
    });

    onUnmounted(() => {
      console.log("Componente desmontado");
      if (unsubscribe) unsubscribe();
    });

    return { canciones, reproducir, pausar };
  }
});
</script>


<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('@/assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.background-container {
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
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.songs-list {
  position: relative;
  max-width: 900px;
  width: 100%;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  color: #f5f5f5;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
  background: transparent;
  max-height: 90vh; /* NUEVO: evita que se desborde en pantallas bajas */
  overflow-y: auto;  /* NUEVO: permite scroll si se excede el contenido */
}

.songs-list::-webkit-scrollbar {
  width: 6px;
}

.songs-list::-webkit-scrollbar-thumb {
  background-color: #f4d88a;
  border-radius: 3px;
}

.songs-list::-webkit-scrollbar-track {
  background: transparent;
}

.title {
  font-size: 2rem;
  color: #f4d88a;
  margin-bottom: 1.5rem;
}

.no-songs {
  font-size: 1.1rem;
  color: #ffffffcc;
  margin-top: 2rem;
}

.table-wrapper {
  overflow-x: auto;
}

.songs-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.songs-table th,
.songs-table td {
  padding: 1rem;
  font-size: 0.95rem;
  backdrop-filter: blur(4px);
}

.songs-table th {
  color: #f4d88a;
  font-weight: bold;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 2px solid #e0c693;
}

.songs-table td {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.action-button {
  font-family: 'Bahnschrift', sans-serif;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border-radius: 9999px;
  border: 1px solid #f4d88a;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f4d88a;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #f4d88a;
  color: black;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .songs-list {
    padding: 1rem;
    border-radius: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .songs-table th,
  .songs-table td {
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  .action-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
}
</style>
