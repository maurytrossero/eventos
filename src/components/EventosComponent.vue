<template>
  <div class="eventos-contenedor">
    <h1>Gestión de Eventos</h1>

    <!-- Mostrar el formulario solo si el usuario está logueado -->
    <form v-if="auth.isLoggedIn" @submit.prevent="crearEvento" class="evento-formulario">
      <input v-model="nuevoEventoNombre" placeholder="Nombre del evento" required />
      <input v-model="nuevoEventoFecha" type="date" required />
      <input v-model="nuevoEventoLugar" placeholder="Lugar del evento (opcional)" />
      <button type="submit">Crear Evento</button>
    </form>

    <!-- Si no está logueado, mostrar un mensaje -->
    <p v-else>
      Para crear un evento necesitás iniciar sesión.  
      <router-link to="/login">Iniciar sesión</router-link>
    </p>

    <h2 v-if="auth.user?.email === 'admin@example.com'">
      <router-link to="/eventos/lista" class="link-eventos">
        Ver listado de eventos
      </router-link>
    </h2>


    <div v-if="eventoId" class="sugerir-cancion">
      <input v-model="nuevaCancionNombre" placeholder="Nombre de la canción" />
      <input v-model="nuevaCancionArtista" placeholder="Artista" />
      <button @click="agregarCancion">Agregar Canción</button>
      
      <h3>Canciones Sugeridas</h3>
      <ul class="canciones-lista">
        <li v-for="cancion in canciones" :key="cancion.id" class="cancion-item">
          {{ cancion.nombre }} - {{ cancion.interprete }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { addEvento, addCancion, getCancionesByEvento } from '../services/firestoreService';
import { useAuthStore } from '@/stores/authStore'

interface Cancion {
    id: string; // Asegúrate de que `id` es de tipo string
    nombre: string;
    interprete: string;
}

const nuevoEventoNombre = ref('');
const nuevoEventoFecha = ref('');
const nuevoEventoLugar = ref('');
const nuevaCancionNombre = ref('');
const nuevaCancionArtista = ref('');
const canciones = ref<Cancion[]>([]); // Inicializa como un arreglo de Cancion
const route = useRoute();
const eventoId = route.params.eventoId as string;
const auth = useAuthStore()


// Función para crear un evento
const crearEvento = async () => {
  try {
    const user = auth.user

    const evento = {
      nombre: nuevoEventoNombre.value,
      fecha: nuevoEventoFecha.value,
      lugar: nuevoEventoLugar.value,
      creadoPor: user?.uid || 'admin' // guarda UID o "admin" por defecto
    }

    const id = await addEvento(evento)

    if (id) {
      alert(`Evento creado con ID: ${id}`)
      nuevoEventoNombre.value = ''
      nuevoEventoFecha.value = ''
      nuevoEventoLugar.value = ''
    }
  } catch (error) {
    console.error("Error al crear el evento:", error)
  }
}


// Función para agregar una canción al evento actual
const agregarCancion = async () => {
  if (!eventoId) return;
  const cancion = { nombre: nuevaCancionNombre.value, interprete: nuevaCancionArtista.value };
  await addCancion(eventoId, cancion);
  nuevaCancionNombre.value = '';
  nuevaCancionArtista.value = '';
  cargarCanciones();
};

// Cargar las canciones del evento
const cargarCanciones = async () => {
  if (!eventoId) return;
  const fetchedCanciones = await getCancionesByEvento(eventoId);
  canciones.value = fetchedCanciones as Cancion[]; // Asegúrate de que sea un arreglo de Cancion
};

onMounted(() => {
  if (eventoId) {
    cargarCanciones();
  }
});
</script>

<style scoped>
.eventos-contenedor {
  max-width: 100%; /* Occupy full width */
  min-height: 100vh; /* Ensure it occupies full height */
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: 'Arial', sans-serif; /* Use a pleasant font */
  color: #333; /* Text color for better readability */
  background-color: #f8f9fa; /* Light background for contrast */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

h1 {
  font-size: 2.5em; /* Increase main title size */
  color: #2c3e50; /* Darker color for title */
}

h2 {
  font-size: 2em; /* Increase subtitle size */
  color: #34495e; /* Slightly lighter color for subtitle */
}

.link-eventos {
  color: #2980b9; /* Link color */
  text-decoration: none; /* Remove underline from links */
  transition: color 0.3s ease; /* Smooth color transition */
}

.link-eventos:hover {
  color: #3498db; /* Lighter color on hover */
  text-decoration: underline; /* Underline on hover */
}

.evento-formulario {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  width: 60%; /* Set fixed width for form */
  margin: 20px auto; /* Center form with margin */
  padding: 15px; /* Padding inside the form */
  border: 2px solid #ccc; /* Increase border width */
  border-radius: 8px; /* Rounded corners for elegance */
  background-color: #ffffff; /* White background for form */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Slight shadow for form */
}

.evento-formulario input,
.evento-formulario button {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.evento-formulario button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.evento-formulario button:hover {
  background-color: #0056b3;
}

.sugerir-cancion {
  margin: 20px 0;
}

.canciones-lista {
  list-style-type: none;
  padding: 0;
}

.cancion-item {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

/* Responsive styles */
@media (max-width: 768px) {
  h1 {
    font-size: 2em; /* Adjust size for smaller screens */
  }

  h2 {
    font-size: 1.5em; /* Adjust size for smaller screens */
  }

  .evento-formulario {
    width: 80%; /* Adjust form width for smaller screens */
  }
}
</style>
