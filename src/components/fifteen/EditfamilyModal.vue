<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Editar Familia</h3>

      <label>Teléfono:</label>
      <input v-model="telefono" placeholder="Ej: 3511234567" />

      <h4>Asistentes:</h4>
      <div v-for="(a, i) in asistentes" :key="i" class="asistente">
        <input v-model="a.nombre" placeholder="Nombre" />
        <input v-model="a.apellido" placeholder="Apellido" />
      </div>

      <div class="acciones">
        <button @click="guardarCambios">Guardar</button>
        <button @click="$emit('cerrar')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */

import { ref, watch } from 'vue';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const props = defineProps({
  familia: Object,
});

const emit = defineEmits(['cerrar', 'guardado']);

const telefono = ref('');
const asistentes = ref([]);

watch(
  () => props.familia,
  (nueva) => {
    if (nueva) {
      telefono.value = nueva.telefono || '';
      asistentes.value = JSON.parse(JSON.stringify(nueva.asistentes || []));
    }
  },
  { immediate: true }
);

async function guardarCambios() {
  try {
    const refDoc = doc(db, 'familias', props.familia.id);
    await updateDoc(refDoc, {
      telefono: telefono.value,
      asistentes: asistentes.value,
    });
    emit('guardado');
    emit('cerrar');
  } catch (err) {
    console.error('Error al guardar:', err);
    alert('Error al guardar los cambios');
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('@/assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
}

.modal {
  background: rgba(202, 201, 201, 0); /* Más transparente y apenas gris */
  padding: 2rem;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Bahnschrift', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: white;
  text-align: center;
  backdrop-filter: blur(4px);
}

.modal h3,
.modal h4 {
  margin: 0;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.asistente {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.acciones {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.acciones button {
  flex: 1 1 auto;
  min-width: 120px;
  max-width: 180px;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.15); /* más sutil */
  color: white;
  font-size: 0.875rem;
  transition: transform 0.2s ease, background-color 0.3s, color 0.3s;
  cursor: pointer;
  white-space: nowrap;
  font-weight: normal;
}

.acciones button:first-child {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: bold;
}

.acciones button:hover {
  background-color: white;
  color: black;
  transform: scale(1.05);
}


</style>
