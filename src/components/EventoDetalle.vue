<!-- src/components/EventoDetalle.vue -->
<template>
  <div class="evento-detalle">
    <h1>Detalles del Evento</h1>

    <div class="form-edicion">
      <label>
        Nombre:
        <input v-model="eventoEditable.nombre" type="text" />
      </label>
      <label>
        Fecha:
        <input v-model="eventoEditable.fecha" type="date" />
      </label>
      <label>
        Lugar:
        <input v-model="eventoEditable.lugar" type="text" />
      </label>

      <!-- Slug personalizado, solo si hay invitación activa -->
      <label v-if="evento?.invitacion">
        URL personalizada:
        <input
          v-model="eventoEditable.slug"
          type="text"
          placeholder="ej: fiesta-sofia-2025"
        />
        <small style="color: #666; font-weight: 400;">
          Usá letras, números y guiones. La invitación se podrá acceder en:<br />
          <strong>
            <a
              :href="urlInvitacion"
              target="_blank"
              rel="noopener"
              style="color: #007bff;"
            >
              {{ urlInvitacion }}
            </a>
          </strong>
        </small>
        <!-- QR Invitación -->
        <div class="qr-container" ref="qrWrapperInvitacion">
          <qrcode-vue
            :value="urlInvitacion"
            :size="120"
            render-as="canvas"
            :key="'invitacion-' + eventoEditable.slug"
          />
          <button class="qr-boton" @click="descargarQR('invitacion')">Descargar QR</button>
        </div>
      </label>

      <!-- URL pública galería solo si está activa y hay slug -->
      <label v-if="evento?.galeriaActiva && eventoEditable.slug" style="margin-top: 1rem;">
        <small style="color: #666; font-weight: 400;">
          La galería se podrá acceder en:<br />
          <strong>
            <a
              :href="urlGaleria"
              target="_blank"
              rel="noopener"
              style="color: #007bff;"
            >
              {{ urlGaleria }}
            </a>
          </strong>
        </small>
        <!-- QR Galería -->
        <div class="qr-container" ref="qrWrapperGaleria">
          <qrcode-vue
            :value="urlGaleria"
            :size="120"
            render-as="canvas"
            :key="'galeria-' + eventoEditable.slug"
          />
          <button class="qr-boton" @click="descargarQR('galeria')">Descargar QR</button>
        </div>
      </label>

      <button @click="guardarCambios" class="accion-button guardar">Guardar Cambios</button>
    </div>

    <div class="acciones-grid">
      <!-- Invitación -->
      <div class="accion-card">
        <div class="icon-header">📄</div>
        <h2>Invitación</h2>
        <div class="acciones-btns">
          <button
            v-if="!evento?.invitacion"
            @click="crearInvitacion"
            class="accion-button"
          >
            Crear
          </button>
          <template v-else>
            <button @click="verEditarInvitacion" class="accion-button">
              Ver / Editar
            </button>
            <button @click="eliminarInvitacion" class="accion-button danger">
              Eliminar
            </button>
          </template>
        </div>
      </div>

      <!-- Galería -->
      <div class="accion-card">
        <div class="icon-header">🖼️</div>
        <h2>Galería</h2>
        <div class="acciones-btns">
          <button
            v-if="evento?.galeriaActiva"
            @click="irAGaleriaInteractiva"
            class="accion-button"
          >
            Ver
          </button>
          <button v-else @click="crearGaleria" class="accion-button">
            Crear
          </button>
          <router-link
            :to="{ name: 'evento-moderar-galeria-interactiva', params: { eventoId } }"
            class="accion-button router"
          >
            Moderar
          </router-link>
        </div>
      </div>

      <!-- Canciones -->
      <div class="accion-card">
        <div class="icon-header">🎵</div>
        <h2>Música</h2>
        <div class="acciones-btns">
          <button @click="abrirModal" class="accion-button">
            Sugerir canción
          </button>
          <router-link
            :to="{ name: 'evento-canciones', params: { eventoId } }"
            class="accion-button router"
          >
            Ver lista
          </router-link>
        </div>
      </div>

      <!-- Riesgo -->
      <div class="accion-card danger-card">
        <div class="icon-header">⚠️</div>
        <h2>Eliminar Evento</h2>
        <div class="acciones-btns">
          <button @click="eliminarEvento" class="accion-button danger">
            Eliminar
          </button>
        </div>
      </div>
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
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getEventoById, addCancion, updateEvento, deleteEvento } from '@/services/firestoreService';
import ModalDialog from './ModalDialog.vue';
import { deleteField } from 'firebase/firestore';
import { useAuthStore } from '@/stores/authStore';
import QrcodeVue from 'qrcode.vue';

interface Evento {
  id?: string;
  nombre: string;
  fecha: string;
  lugar?: string;
  invitacion?: string;
  galeriaActiva?: boolean;
  slug?: string;
}

const route = useRoute();
const router = useRouter();
const eventoId = route.params.eventoId as string;
const evento = ref<Evento | null>(null);
const eventoEditable = ref<Evento>({ nombre: '', fecha: '', lugar: '', slug: '' });
const mostrarModal = ref(false);
const baseURL = window.location.origin;
const auth = useAuthStore();

// Refs para los wrappers de QR (divs)
const qrWrapperInvitacion = ref<HTMLElement | null>(null);
const qrWrapperGaleria = ref<HTMLElement | null>(null);

// Computed URLs
const urlInvitacion = computed(() =>
  `${baseURL}/invitacion/${eventoEditable.value.slug || ''}`
);

const urlGaleria = computed(() =>
  `${baseURL}/galeria/${eventoEditable.value.slug || ''}`
);

// Descargar QR como imagen PNG
const descargarQR = (tipo: 'invitacion' | 'galeria') => {
  const wrapper = tipo === 'invitacion' ? qrWrapperInvitacion.value : qrWrapperGaleria.value;

  if (!wrapper) {
    alert('No se encontró el contenedor del QR');
    return;
  }

  const canvas = wrapper.querySelector('canvas') as HTMLCanvasElement | null;

  if (!canvas || typeof canvas.toDataURL !== 'function') {
    alert('No se pudo obtener el código QR como imagen');
    return;
  }

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `qr-${tipo}-${eventoEditable.value.slug || 'evento'}.png`;
  link.click();
};

// Cargar evento desde Firestore
const cargarEvento = async () => {
  const data = await getEventoById(eventoId) as Evento & { creadoPor?: string };
  evento.value = data;
  eventoEditable.value = { ...data };

  // Validar permisos de edición
  const usuarioEsCreador = data.creadoPor ? data.creadoPor === auth.user?.uid : false;
  const usuarioEsAdmin = auth.isAdmin;

  if (!usuarioEsCreador && !usuarioEsAdmin) {
    alert('No tenés permisos para editar este evento');
    return router.push('/no-autorizado');
  }
};

onMounted(() => {
  cargarEvento();
});

// Autogenerar slug desde el nombre si está vacío
watch(() => eventoEditable.value.nombre, (nuevoNombre) => {
  if (!eventoEditable.value.slug && nuevoNombre) {
    eventoEditable.value.slug = generateSlug(nuevoNombre);
  }
});

function generateSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // saca acentos
    .replace(/[^a-z0-9]+/g, '-') // reemplaza todo lo que no sea letra o número por guiones
    .replace(/(^-|-$)+/g, ''); // elimina guiones al inicio o fin
}

// Guardar cambios en Firestore
const guardarCambios = async () => {
  if (!eventoEditable.value) return;
  try {
    await updateEvento(eventoId, eventoEditable.value);
    evento.value = { ...eventoEditable.value };
    alert('Evento actualizado con éxito.');
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    alert('Ocurrió un error al guardar los cambios.');
  }
};

// Eliminar evento completo
const eliminarEvento = async () => {
  const confirmacion = window.confirm('¿Estás seguro de que querés eliminar este evento? Esta acción no se puede deshacer.');
  if (!confirmacion) return;
  try {
    await deleteEvento(eventoId);
    alert('Evento eliminado con éxito.');
    router.push({ name: 'eventos-listado' });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    alert('Ocurrió un error al eliminar el evento.');
  }
};

// Modal para sugerencia de canciones
const abrirModal = () => { mostrarModal.value = true; };
const cerrarModal = () => { mostrarModal.value = false; };

const enviarSugerencia = async (nombreCancion: string, artista: string) => {
  try {
    const cancion = { nombre: nombreCancion, interprete: artista };
    await addCancion(eventoId, cancion);
    cerrarModal();
  } catch (error) {
    console.error("Error al enviar sugerencia:", error);
  }
};

// Acciones relacionadas con la invitación
const crearInvitacion = () => {
  router.push({ name: 'evento-invitacion', params: { eventoId } });
};

const verEditarInvitacion = () => {
  router.push({ name: 'evento-invitacion', params: { eventoId } });
};

const eliminarInvitacion = async () => {
  try {
    await updateEvento(eventoId, { invitacion: deleteField() });
    if (evento.value) evento.value.invitacion = undefined;
    alert('Invitación eliminada con éxito');
  } catch (error) {
    console.error("Error al eliminar la invitación:", error);
    alert('Ocurrió un error al eliminar la invitación.');
  }
};

// Acciones relacionadas con la galería
const crearGaleria = async () => {
  try {
    await updateEvento(eventoId, { galeriaActiva: true });
    await cargarEvento(); // recarga la info local del evento
    router.push({ name: 'evento-galeria-interactiva', params: { eventoId } });
  } catch (error) {
    console.error('Error al activar la galería:', error);
    alert('No se pudo activar la galería. Intentá nuevamente más tarde.');
  }
};

const irAGaleriaInteractiva = () => {
  router.push({ name: 'evento-galeria-interactiva', params: { eventoId } });
};
</script>


<style scoped>
.evento-detalle {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Poppins', sans-serif;
  color: #1f2d3d;
}

.form-edicion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.form-edicion label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

.form-edicion input {
  margin-top: 0.25rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.accion-button.guardar {
  background-color: #4caf50;
  color: white;
}

.acciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.accion-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 0 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-header {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.accion-card h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.acciones-btns {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.accion-button,
.accion-button.secondary {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.accion-button {
  background-color: #1976d2;
  color: white;
}

.accion-button:hover {
  background-color: #125aa0;
}

.accion-button.secondary {
  background-color: #e9e9e9;
  color: #333;
}

.accion-button.secondary:hover {
  background-color: #d2d2d2;
}

.accion-button.danger {
  background-color: #d32f2f;
  color: white;
}

.accion-button.danger:hover {
  background-color: #b71c1c;
}

.danger-card {
  background-color: #fff4f4;
}
.accion-button.router {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  background-color: #1976d2;
  transition: background-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  border: none;
}

.accion-button.router:hover {
  background-color: #125aa0;
}

.qr-container {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.qr-boton {
  background-color: #1976d2;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.qr-boton:hover {
  background-color: #125aa0;
}


.descargar-button {
  margin-top: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  transition: background-color 0.2s ease;
}

.descargar-button:hover {
  background-color: #125aa0;
}
.qr-boton {
  margin-top: 0.5rem;
  background-color: #1976d2;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.qr-boton:hover {
  background-color: #125aa0;
}
</style>
