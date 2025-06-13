<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getEventoById, updateEvento } from '@/services/firestoreService';

const route = useRoute();
const eventoId = route.params.eventoId as string;

const evento = ref<any>(null);
const componenteInvitacion = ref<any>(null);
const seleccionando = ref(false);

const plantillasDisponibles = ['FifteenView', 'WeddingView'];

const cargarComponente = (nombre: string) => {
  return defineAsyncComponent(() => import(`@/views/invitation-type/${nombre}.vue`));
};

const seleccionarPlantilla = async (nombre: string) => {
  await updateEvento(eventoId, { invitacion: nombre });
  componenteInvitacion.value = cargarComponente(nombre);
  seleccionando.value = false;
};

onMounted(async () => {
  evento.value = await getEventoById(eventoId);
  if (evento.value?.invitacion) {
    componenteInvitacion.value = cargarComponente(evento.value.invitacion);
  } else {
    seleccionando.value = true;
  }
});
</script>

<template>
  <div>
    <!-- Solo muestra la selección si no hay plantilla asignada -->
    <div v-if="seleccionando" class="selector-contenedor">
      <div class="selector">
        <h2>Seleccioná un diseño de invitación para el evento</h2>
        <div class="plantillas">
          <button
            v-for="plantilla in plantillasDisponibles"
            :key="plantilla"
            @click="seleccionarPlantilla(plantilla)"
          >
            {{ plantilla }}
          </button>
        </div>
      </div>
    </div>

    <!-- Muestra la invitación si ya se seleccionó una plantilla -->
    <component :is="componenteInvitacion" v-else-if="componenteInvitacion" />

    <!-- Fallback de carga -->
    <div v-else class="cargando">
      <p>Cargando...</p>
    </div>
  </div>
</template>

<style scoped>
/* Solo afecta la selección de plantilla */
.selector-contenedor {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: linear-gradient(to right, #f8fbff, #eaf3ff);
  padding: 2rem;
}

.selector {
  text-align: center;
  max-width: 600px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.selector h2 {
  margin-bottom: 1.5rem;
  color: #1a3c64;
  font-size: 1.4rem;
  font-weight: 600;
}

.plantillas {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

button {
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  background-color: #1976d2;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0d47a1;
  transform: translateY(-2px);
}

.cargando {
  text-align: center;
  padding: 4rem;
  color: #888;
  font-style: italic;
}
</style>
