<template>
  <div class="lista-eventos">
    <h1>Lista de Eventos</h1>
    <ul class="eventos-lista">
      <li v-for="evento in eventos" :key="evento.id" class="evento-item">
        <h2>{{ evento.nombre }}</h2>
        <p>Fecha: {{ evento.fecha }}</p>
        <p>Lugar: {{ evento.lugar }}</p>
        <router-link :to="{ name: 'EventoDetalle', params: { eventoId: evento.id } }" class="link-evento">Ver Detalles</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEventos } from '../services/firestoreService';

interface Evento {
    id: string; // Asegúrate de que `id` es de tipo string
    nombre: string;
    fecha: string; // O el tipo adecuado, si es diferente
    lugar: string; // O el tipo adecuado, si es diferente
}

const eventos = ref<Evento[]>([]); // Inicializa como un arreglo de Evento

// Función para cargar los eventos desde Firestore
const cargarEventos = async () => {
  const fetchedEventos = await getEventos();
  eventos.value = fetchedEventos as Evento[]; // Asegúrate de que sea un arreglo de Evento
};

onMounted(() => {
  cargarEventos();
});
</script>


<style scoped>
.lista-eventos {
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

.eventos-lista {
  list-style-type: none;
  padding: 0;
}

.evento-item {
  padding: 15px; /* Increased padding for better spacing */
  margin-bottom: 20px; /* Increased margin for spacing between items */
  border: 2px solid #ccc; /* Increase border width */
  border-radius: 8px; /* Rounded corners for elegance */
  background-color: #ffffff; /* White background for items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Slight shadow for items */
  transition: transform 0.2s; /* Smooth transition for hover effect */
}

.evento-item:hover {
  transform: scale(1.02); /* Slightly enlarge on hover */
}

.link-evento {
  color: #007bff; /* Link color */
  text-decoration: none; /* Remove underline from links */
  transition: color 0.3s ease; /* Smooth color transition */
}

.link-evento:hover {
  color: #0056b3; /* Darker blue on hover */
  text-decoration: underline; /* Underline on hover */
}

/* Responsive styles */
@media (max-width: 768px) {
  h1 {
    font-size: 2em; /* Adjust size for smaller screens */
  }

  .evento-item {
    padding: 10px; /* Adjust padding for smaller screens */
  }
}
</style>
