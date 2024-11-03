<template>
  <div class="background-container"> <!-- Contenedor de fondo -->
    <div class="songs-list"> <!-- Este es tu formulario existente -->
      <h2 class="title">Listado de Canciones</h2>
      <button @click="goBack" class="back-button">Volver</button>
      <ul class="song-items">
        <li v-for="cancion in canciones" :key="cancion.id" class="song-item">
          <div class="song-info">
            <span class="song-name">{{ cancion.nombre }}</span>
            <span class="song-artist"> - {{ cancion.interprete }}</span>
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
    const idEvento = route.params.eventoId as string; // Obtener el ID del evento desde los parámetros de la ruta

    const loadCanciones = async () => {
      try {
        canciones.value = await getCancionesByEvento(idEvento);
      } catch (error) {
        console.error("Error al cargar las canciones:", error);
      }
    };

    const goBack = () => {
      // Use Vue Router's method to go back to the previous page
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
html, body {
  height: 100%; /* Asegura que el HTML y el cuerpo ocupen toda la altura */
  margin: 0; /* Elimina márgenes predeterminados */
}

.background-container {
  width: 100%; /* Ancho completo */
  height: 100%; /* Alto completo */
  background-color: #ffffff; /* Fondo blanco */
  display: flex; /* Flex para centrar contenido */
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
}

.songs-list {
  max-width: 800px; /* Ajustar el ancho máximo según sea necesario */
  margin: 20px auto; /* Centrar la lista con margen superior */
  padding: 20px;
  background-color: #ffffff; /* Fondo blanco para la lista de canciones */
  border-radius: 8px; /* Esquinas redondeadas */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

.title {
  font-size: 2.5em; /* Tamaño del título más grande */
  text-align: center; /* Alinear el título al centro */
  color: #2c3e50; /* Color más oscuro para el título */
  margin-bottom: 20px; /* Espacio debajo del título */
}

.song-items {
  list-style: none; /* Eliminar el estilo de lista predeterminado */
  padding: 0; /* Eliminar el padding */
}

.song-item {
  margin: 10px 0; /* Espaciado entre los elementos */
  padding: 15px; /* Espaciado interno */
  background-color: #ffffff; /* Fondo blanco para las canciones */
  border-radius: 5px; /* Esquinas redondeadas */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  transition: transform 0.3s; /* Transición suave para el efecto hover */
}

.song-item:hover {
  transform: translateY(-2px); /* Efecto de elevación al pasar el mouse */
}

.song-info {
  display: flex; /* Flex para el nombre de la canción y el artista */
  justify-content: space-between; /* Espacio entre los elementos */
}

.song-name {
  font-size: 1.2em; /* Tamaño del nombre de la canción */
  color: #333; /* Color para el nombre de la canción */
}

.song-artist {
  font-size: 1em; /* Tamaño del nombre del artista */
  color: #555; /* Color más claro para el nombre del artista */
}

.back-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #0056b3; 
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .title {
    font-size: 2em; /* Tamaño ajustado para pantallas pequeñas */
  }

  .song-name {
    font-size: 1.1em; /* Tamaño ajustado para el nombre de la canción */
  }

  .song-artist {
    font-size: 0.9em; /* Tamaño ajustado para el nombre del artista */
  }
}
</style>
