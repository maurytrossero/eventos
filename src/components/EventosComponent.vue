<template>
  <div class="eventos-contenedor">
    <h1>Crear un nuevo evento</h1>

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
import Swal from 'sweetalert2'

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
      creadoPor: user?.uid || 'admin'
    }

    const id = await addEvento(evento)

    if (id) {
      await Swal.fire({
        title: 'Evento creado',
        text: `Tu evento fue creado con ID: ${id}`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4a90e2',
        background: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2b2b2b' : '#fff',
        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f0f0f0' : '#333'
      })

      nuevoEventoNombre.value = ''
      nuevoEventoFecha.value = ''
      nuevoEventoLugar.value = ''
    }
  } catch (error) {
    console.error("Error al crear el evento:", error)
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo crear el evento. Por favor intentá de nuevo.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d33',
      background: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2b2b2b' : '#fff',
      color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f0f0f0' : '#333'
    })
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, color 0.3s ease;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

h2 {
  font-size: 1.6rem;
  margin-top: 2rem;
  text-align: center;
  color: #34495e;
}

.link-eventos {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.link-eventos:hover {
  text-decoration: underline;
  color: #2980b9;
}

.evento-formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;
}

.evento-formulario input,
.evento-formulario button {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  border: 1px solid #ccc;
  box-sizing: border-box;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.evento-formulario button {
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.evento-formulario button:hover {
  background-color: #357ac4;
}

.sugerir-cancion {
  margin-top: 2rem;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.sugerir-cancion input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.sugerir-cancion button {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.sugerir-cancion button:hover {
  background-color: #388e3c;
}

.canciones-lista {
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
}

.cancion-item {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  font-size: 0.95rem;
  color: #444;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  .eventos-contenedor {
    background-color: #1e1e1e;
    color: #f0f0f0;
  }

  h1, h2 {
    color: #ffffff;
  }

  .link-eventos {
    color: #85c1ff;
  }

  .evento-formulario,
  .sugerir-cancion {
    background-color: #2b2b2b;
    border-color: #444;
  }

  .evento-formulario input,
  .sugerir-cancion input {
    background-color: #3a3a3a;
    color: #f0f0f0;
    border-color: #555;
  }

  .evento-formulario button,
  .sugerir-cancion button {
    background-color: #007bff;
  }

  .evento-formulario button:hover {
    background-color: #0056b3;
  }

  .sugerir-cancion button:hover {
    background-color: #2e7d32;
  }

  .cancion-item {
    border-color: #555;
    color: #ddd;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .evento-formulario {
    padding: 1rem;
  }

  .sugerir-cancion {
    padding: 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.3rem;
  }
}
</style>
