<template>
  <div class="lista-eventos">
    <h1>Eventos Disponibles</h1>
    <ul class="eventos-lista">
      <li v-for="evento in eventos" :key="evento.id" class="evento-item">
        <h2>{{ evento.nombre }}</h2>
        <p class="detalle"><strong>Fecha:</strong> {{ evento.fecha }}</p>
        <p class="detalle"><strong>Lugar:</strong> {{ evento.lugar }}</p>
        <router-link :to="{ name: 'EventoDetalle', params: { eventoId: evento.id } }" class="link-evento">
          Ver Detalles
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEventos } from '../services/firestoreService';

interface Evento {
  id: string;
  nombre: string;
  fecha: string;
  lugar: string;
}

const eventos = ref<Evento[]>([]);

const cargarEventos = async () => {
  const fetchedEventos = await getEventos();
  eventos.value = fetchedEventos as Evento[];
};

onMounted(() => {
  cargarEventos();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.lista-eventos {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to bottom right, #f5f9ff, #eef3f9);
  color: #1f2d3d;
}

h1 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 30px;
  color: #1a3c64;
  animation: fadeInDown 0.6s ease-out;
}

.eventos-lista {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.evento-item {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  text-align: left;
  animation: fadeInUp 0.5s ease;
}

.evento-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.evento-item h2 {
  font-size: 1.4em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.detalle {
  font-size: 0.95em;
  color: #555;
  margin-bottom: 6px;
}

.link-evento {
  display: inline-block;
  margin-top: 10px;
  font-weight: 500;
  font-size: 0.95em;
  color: #1976d2;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.3s ease, border-bottom 0.3s ease;
}

.link-evento:hover {
  color: #0d47a1;
  border-bottom: 1px solid #0d47a1;
}

/* Animaciones */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  .lista-eventos {
    background: linear-gradient(to bottom right, #1e1e2f, #2c3e50);
    color: #f0f0f0;
  }

  .evento-item {
    background-color: #2e3b4e;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  }

  .evento-item h2 {
    color: #e0ecff;
  }

  .detalle {
    color: #ccc;
  }

  .link-evento {
    color: #90caf9;
  }

  .link-evento:hover {
    color: #64b5f6;
    border-bottom: 1px solid #64b5f6;
  }
}

/* Responsive */
@media (max-width: 600px) {
  h1 {
    font-size: 2em;
  }

  .evento-item {
    padding: 16px;
  }

  .evento-item h2 {
    font-size: 1.2em;
  }
}
</style>
