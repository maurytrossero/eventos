<template>
  <div class="evento-detalle">
    <h1>{{ evento?.nombre }}</h1>
    <p class="detalle">
      <strong>Fecha:</strong>
      {{ evento?.fecha ? formatDate(evento.fecha) : 'Fecha no disponible' }}
    </p>
    <p class="detalle">
      <strong>Lugar:</strong>
      {{ evento?.lugar }}
    </p>

    <!-- <CuentaRegresiva v-if="evento?.fecha" :targetDate="evento.fecha" />-->

    <div class="links-container">
      <router-link
        :to="{ name: 'eventos-canciones', params: { eventoId: eventoId } }"
        class="card link"
      >
        Lista de Canciones
      </router-link>
    </div>

    <div class="acciones-contenedor">
      <button @click="abrirModal" class="accion-button">
        Sugerir Canción
      </button>

      <template v-if="!evento?.invitacion">
        <button @click="crearInvitacion" class="accion-button">
          Crear Invitación
        </button>
      </template>

      <template v-else>
        <button @click="verEditarInvitacion" class="accion-button">
          Ver / Editar Invitación
        </button>
        <button @click="eliminarInvitacion" class="accion-button eliminar">
          Eliminar Invitación
        </button>
      </template>

      <button
        v-if="evento?.galeriaActiva === true"
        @click="irAGaleriaInteractiva"
        class="accion-button"
      >
        Ver Galería Interactiva
      </button>

      <button
        v-else
        @click="crearGaleria"
        class="accion-button"
      >
        Crear Galería Interactiva
      </button>

      <button @click="eliminarEvento" class="accion-button eliminar">
        Eliminar Evento
      </button>

    </div>

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
import { useRoute, useRouter } from 'vue-router';
import { getEventoById, addCancion, updateEvento  } from '@/services/firestoreService';
import ModalDialog from './ModalDialog.vue';
import CuentaRegresiva from './CuentaRegresiva.vue';
import { deleteField } from 'firebase/firestore';
import { deleteEvento } from '@/services/firestoreService'; // Asegúrate de que esta función exista y funcione


import { FieldValue } from 'firebase/firestore';

interface Evento {
  id?: string;
  nombre: string;
  fecha: string;
  lugar?: string;
  invitacion?: string;
  galeriaActiva?: boolean;  // <-- Agregá esta línea
}



const route = useRoute();
const router = useRouter();
const eventoId = route.params.eventoId as string;
const evento = ref<Evento | null>(null);
const mostrarModal = ref(false);

const formatDate = (dateString: string) => {
  const date = new Date(new Date(dateString).getTime() + new Date().getTimezoneOffset() * 60000);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

const cargarEvento = async () => {
  evento.value = await getEventoById(eventoId) as Evento;
};

const eliminarEvento = async () => {
  const confirmacion = window.confirm('¿Estás seguro de que querés eliminar este evento? Esta acción no se puede deshacer.');
  if (!confirmacion) return;

  try {
    await deleteEvento(eventoId);
    alert('Evento eliminado con éxito.');
    router.push({ name: 'eventos-listado' }); // Asegúrate de tener esta ruta configurada
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    alert('Ocurrió un error al eliminar el evento.');
  }
};
  // Función para ir a la galería interactiva
  const irAGaleriaInteractiva = () => {
    router.push({ 
      name: 'evento-galeria-interactiva', 
      params: { eventoId } 
    })
  }

onMounted(() => {
  cargarEvento();
});

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
    cerrarModal();
  } catch (error) {
    console.error("Error al enviar sugerencia:", error);
  }
};

const crearInvitacion = () => {
  router.push({ name: 'evento-invitacion', params: { eventoId } });
};

const verEditarInvitacion = () => {
  router.push({ name: 'evento-invitacion', params: { eventoId } });
};

const eliminarInvitacion = async () => {
  try {
    await updateEvento(eventoId, { invitacion: deleteField() });
    evento.value!.invitacion = undefined;
    alert('Invitación eliminada con éxito');
  } catch (error) {
    console.error("Error al eliminar la invitación:", error);
    alert('Ocurrió un error al eliminar la invitación.');
  }
};

const crearGaleria = () => {
  alert('Funcionalidad de galería interactiva próximamente.');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.evento-detalle {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to bottom right, #f7faff, #e3ecf4);
  color: #1f2d3d;
  min-height: 100vh;
  text-align: center;
}

h1 {
  font-size: 2.4em;
  color: #1a3c64;
  margin-bottom: 15px;
  animation: fadeInDown 0.6s ease-out;
}

.detalle {
  font-size: 1.1em;
  color: #444;
  margin-bottom: 10px;
}

.links-container {
  margin: 30px 0 20px;
  display: flex;
  justify-content: center;
}

.card {
  background-color: #ffffff;
  padding: 18px 25px;
  border-radius: 10px;
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  background-color: #f0f7ff;
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.acciones-contenedor {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.accion-button {
  width: 280px;
  max-width: 90%;
  padding: 14px 24px;
  font-size: 1.05em;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.accion-button:hover {
  background-color: #0d47a1;
}

.accion-button.eliminar {
  background-color: #d32f2f;
}

.accion-button.eliminar:hover {
  background-color: #b71c1c;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  .evento-detalle {
    background: linear-gradient(to bottom right, #1a1f2b, #2c3e50);
    color: #f0f0f0;
  }

  .card {
    background-color: #2f3e52;
    color: #90caf9;
  }

  .card:hover {
    background-color: #3f5370;
  }

  .accion-button {
    background-color: #64b5f6;
    color: #0c1c33;
  }

  .accion-button:hover {
    background-color: #42a5f5;
  }

  .accion-button.eliminar {
    background-color: #e57373;
    color: white;
  }

  .accion-button.eliminar:hover {
    background-color: #c62828;
  }

  .detalle {
    color: #ccc;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 2em;
  }

  .detalle {
    font-size: 1em;
  }

  .card {
    width: 90%;
  }

  .links-container {
    flex-direction: column;
    gap: 12px;
  }

  .accion-button {
    width: 90%;
  }
}
</style>
