<template>
  <div class="selector-container">
    <h2>Elegir diseño de invitación</h2>
    <div class="cards">
      <div
        v-for="plantilla in templates"
        :key="plantilla.id"
        class="card"
        :class="{ seleccionada: seleccion === plantilla.id }"
        @click="seleccionarPlantilla(plantilla.id)"
      >
        <img :src="plantilla.imagenPreview" alt="preview" />
        <h3>{{ plantilla.nombre }}</h3>
        <p>{{ plantilla.descripcion }}</p>
      </div>
    </div>
    <button @click="guardarEleccion">Guardar selección</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { invitationTemplates } from '@/data/InvitationTemplates';
import { updateEvento } from '@/services/firestoreService';
import { useRoute } from 'vue-router';

const route = useRoute();
const eventoId = route.params.eventoId as string;

const templates = invitationTemplates;
const seleccion = ref('');

const seleccionarPlantilla = (id: string) => {
  seleccion.value = id;
};

const guardarEleccion = async () => {
  try {
    await updateEvento(eventoId, { invitacion: seleccion.value });
    alert('Invitación guardada con éxito');
  } catch (error) {
    console.error('Error al guardar invitación:', error);
  }
};
</script>

<style scoped>
.selector-container { text-align: center; }
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.card {
  border: 2px solid transparent;
  padding: 10px;
  cursor: pointer;
  width: 200px;
  border-radius: 10px;
  transition: 0.3s;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.card img {
  width: 100%;
  border-radius: 6px;
}
.card.seleccionada {
  border-color: #2196f3;
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.4);
}
</style>
