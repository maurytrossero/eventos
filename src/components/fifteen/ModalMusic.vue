<!-- components/fifteen/ModalMusic.vue -->
<template>
  <div v-if="show" class="modal-backdrop" @click.self="cerrar">
    <div class="modal">
      <h3>Enviar canción</h3>

      <label>Nombre:</label>
      <input v-model="nombre" placeholder="Tu nombre" />

      <label>Canción:</label>
      <input v-model="cancion" placeholder="Título o artista" />

      <label>Link YouTube:</label>
      <input v-model="youtube" placeholder="URL YouTube (opcional)" />

      <div class="acciones">
        <button @click="enviarCancion" :disabled="!nombre || !cancion">Enviar</button>
        <button @click="cerrar">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { db } from '@/firebase' // ajustá esta ruta si tu config Firebase está en otro lado
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const props = defineProps({
  show: Boolean,
})
const cancionesRef = collection(db, 'kiara-musica')

const emit = defineEmits(['close', 'submitted'])

const nombre = ref('')
const cancion = ref('')
const youtube = ref('')

watch(
  () => props.show,
  (val) => {
    if (val) {
      nombre.value = ''
      cancion.value = ''
      youtube.value = ''
    }
  }
)

function cerrar() {
  emit('close')
}

async function enviarCancion() {
  const nuevaCancion = {
    nombre: nombre.value.trim(),
    cancion: cancion.value.trim(),
    youtube: youtube.value.trim(),
    creada: serverTimestamp(),
  }

  try {
    await addDoc(cancionesRef, nuevaCancion)
    emit('submitted', nuevaCancion) // solo si querés emitirlo al componente padre
    cerrar()
  } catch (error) {
    console.error('Error al guardar canción:', error)
    alert('Hubo un error al enviar la canción. Intentá nuevamente.')
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
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: rgba(202, 201, 201, 0.1);
  padding: 2rem;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Bahnschrift', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: white;
  text-align: center;
  backdrop-filter: blur(4px);
}

.modal h3 {
  margin: 0;
  font-weight: 600;
}

label {
  font-weight: 500;
  text-align: left;
  display: block;
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
  font-size: 1rem;
  outline-offset: 2px;
  outline-color: transparent;
  transition: outline-color 0.3s ease;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

input:focus {
  outline-color: rgba(255, 255, 255, 0.7);
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
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 0.9rem;
  transition: transform 0.2s ease, background-color 0.3s, color 0.3s;
  cursor: pointer;
  white-space: nowrap;
  font-weight: normal;
  user-select: none;
}

.acciones button:first-child {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.acciones button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.acciones button:hover:not(:disabled) {
  background-color: white;
  color: black;
  transform: scale(1.05);
}
</style>
