<template>
  <div class="evento-detalle">
  <h1>{{ evento?.nombre }}</h1>
  <p>Fecha: {{ evento?.fecha ? formatDate(evento.fecha) : 'Fecha no disponible' }}</p>
  <p>Lugar: {{ evento?.lugar }}</p>

  <CuentaRegresiva v-if="evento?.fecha" :targetDate="evento.fecha" />

  <div class="links-container">
    <router-link :to="{ name: 'eventos-canciones', params: { eventoId: eventoId } }" class="card link">Lista de Canciones</router-link>
  </div>

  <button @click="abrirModal" class="sugerir-cancion-button">Sugerir Canción</button>

  <ModalDialog
    :isVisible="mostrarModal"
    title="Enviar Sugerencia de Canción"
    message="Por favor, envíanos tus sugerencias de canciones."
    :showInputs="true"
    @onClose="cerrarModal"
    @enviarSugerencia="enviarSugerencia"
  />
</div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getEventoById } from '../services/firestoreService';
import ModalDialog from './ModalDialog.vue'; 
import { addCancion } from '@/services/firestoreService'; 
import CuentaRegresiva from './CuentaRegresiva.vue';


interface Evento {
  id?: string;
  nombre: string;
  fecha: string; // Ensure this is in a format that can be parsed
  lugar?: string; 
}

const route = useRoute();
const eventoId = route.params.eventoId as string;
const evento = ref<Evento | null>(null); 
const mostrarModal = ref(false);

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', options); // Change 'es-ES' to your desired locale
};

// Cargar los detalles del evento
const cargarEvento = async () => {
  evento.value = await getEventoById(eventoId) as Evento; 
};

onMounted(() => {
  cargarEvento();
});

// Funciones para manejar el modal
const abrirModal = () => {
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const enviarSugerencia = async (nombreCancion: string, artista: string) => {
  try {
    const cancion = {
      nombre: nombreCancion,
      interprete: artista,
    };

    await addCancion(eventoId, cancion);
    console.log(`Sugerencia enviada: ${nombreCancion} - ${artista}`);
    cerrarModal(); 
  } catch (error) {
    console.error("Error al enviar sugerencia:", error);
  }
};
</script>

<style scoped>
.evento-detalle {
  max-width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: 'Arial', sans-serif; 
  color: #333; 
  background-color: #f8f9fa; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
}

h1 {
  font-size: 2.5em; 
  color: #2c3e50; 
}

p {
  font-size: 1.2em; 
  margin: 10px 0; 
}

.links-container {
  margin: 20px 0; 
  display: flex;
  justify-content: space-around; 
}

.card {
  display: block;
  width: 200px; 
  padding: 15px;
  margin: 10px; 
  background-color: #fff;
  border: 1px solid #ddd; 
  border-radius: 8px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  text-align: center;
  text-decoration: none;
  color: #007bff; 
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

.sugerir-cancion-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.sugerir-cancion-button:hover {
  background-color: #0056b3; 
}

/* Responsive styles */
@media (max-width: 768px) {
  h1 {
    font-size: 2em; 
  }

  p {
    font-size: 1em; 
  }

  .links-container {
    flex-direction: column; 
    align-items: center; 
  }

  .card {
    width: 90%; 
  }
}
</style>
