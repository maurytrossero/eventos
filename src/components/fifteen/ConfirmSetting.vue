<template>
  <div class="config-box">
    <h2>🎨 Configurar Fondo de Confirmación</h2>

    <label>URL de imagen de fondo:</label>
    <input v-model="imagenFondo" placeholder="Pega una URL válida (Dropbox, Drive, etc)" />

    <div v-if="imagenFondo" class="preview">
      <p>Vista previa del fondo:</p>
      <img :src="imagenFondo" />
    </div>

    <div class="buttons">
      <button @click="guardarCambios">💾 Guardar</button>
      <button class="danger" @click="restablecerValores">🗑️ Restablecer</button>
    </div>


    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const props = defineProps<{ idEvento: string }>()
const emit = defineEmits(['actualizarFondoConfirmacion'])

const db = getFirestore()
const imagenFondo = ref('')
const mensaje = ref('')

const DEFAULT_IMAGE = 'https://dl.dropboxusercontent.com/scl/fi/ucpo6t3d9by764ew4yu27/fondo-topaz.png?rlkey=qdnl6efzqjgudccawx19t3yzr&st=mom1g4qi'

onMounted(async () => {
  const refEvento = doc(db, 'eventos', props.idEvento)
  const snapshot = await getDoc(refEvento)
  if (snapshot.exists()) {
    const data = snapshot.data()
    imagenFondo.value = data.fondoConfirmacion || ''
  }
})

const guardarCambios = async () => {
  const refEvento = doc(db, 'eventos', props.idEvento)
  try {
    await updateDoc(refEvento, {
      fondoConfirmacion: imagenFondo.value
    })

    emit('actualizarFondoConfirmacion', imagenFondo.value)
    mensaje.value = '✅ Fondo guardado correctamente.'
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al guardar fondo.'
  }
}

const restablecerValores = async () => {
  const refEvento = doc(db, 'eventos', props.idEvento)
  try {
    await updateDoc(refEvento, {
      fondoConfirmacion: DEFAULT_IMAGE
    })

    imagenFondo.value = DEFAULT_IMAGE
    emit('actualizarFondoConfirmacion', DEFAULT_IMAGE)
    mensaje.value = '🔄 Imagen restablecida al valor por defecto.'
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al restablecer imagen.'
  }
}
</script>

<style scoped>
.config-box {
  background: #fff;
  color: #333;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-top: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 0.5rem;
  border: none;
}
.preview {
  margin-top: 1rem;
}
.preview img {
  max-width: 100%;
  max-height: 300px; /* o el valor que prefieras */
  object-fit: contain;
  border-radius: 0.75rem;
  margin-top: 0.5rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  background-color: #6a5acd;
  border-radius: 6px;
  cursor: pointer;
  flex-grow: 1;
  min-width: 120px;
  text-align: center;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
  font-weight: 600;
}

button:hover {
  background-color: #5747c0;
}

button.danger {
  background-color: #b22222;
}

button.danger:hover {
  background-color: #7f2c2c;
}

/* Responsive para móviles */
@media (max-width: 500px) {
  .buttons {
    flex-direction: column;
    gap: 0.7rem;
  }

  button {
    min-width: 100%;
    flex-grow: 0;
  }
}

.mensaje {
  margin-top: 1rem;
  font-style: italic;
  color: #ccc;
}
</style>
