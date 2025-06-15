<template>
  <div class="config-box">
    <h2>🛠️ Configurar Cuenta Regresiva</h2>

    <label>Nombre:</label>
    <input v-model="nombre" placeholder="Ej: Kiara" />

    <label>Fecha y hora del evento:</label>
    <input type="datetime-local" v-model="fecha" />

    <label>URL de imagen de fondo:</label>
    <input v-model="imagenFondo" placeholder="Pega una URL válida (Dropbox, Drive, etc)" />

    <div v-if="imagenFondo" class="preview">
      <p>Vista previa del fondo:</p>
      <img :src="imagenFondo" />
    </div>

    <div class="buttons">
      <button @click="guardarCambios">💾 Guardar</button>
      <button @click="restablecerValores" class="danger">🗑️ Restablecer</button>
    </div>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { doc, getDoc, updateDoc } from 'firebase/firestore'
    import { getFirestore } from 'firebase/firestore'

    const props = defineProps<{ idEvento: string }>()
    const emit = defineEmits(['actualizarEvento'])

    const db = getFirestore()

    const nombre = ref('')
    const fecha = ref('')
    const imagenFondo = ref('')
    const mensaje = ref('')

    onMounted(async () => {
    const refEvento = doc(db, 'eventos', props.idEvento)
    const snapshot = await getDoc(refEvento)
    if (snapshot.exists()) {
        const data = snapshot.data()
        nombre.value = data.nombreQuinceanera || ''
        fecha.value = data.fecha || ''
        imagenFondo.value = data.imagenFondo || ''
    }
    })

    const guardarCambios = async () => {
    const refEvento = doc(db, 'eventos', props.idEvento)
    try {
        await updateDoc(refEvento, {
        nombreQuinceanera: nombre.value,
        fecha: fecha.value,
        imagenFondo: imagenFondo.value
        })

        // Emitir evento para que el padre actualice localmente sin esperar Firestore
        emit('actualizarEvento', {
        nombreQuinceanera: nombre.value,
        fecha: fecha.value,
        imagenFondo: imagenFondo.value
        })

        mensaje.value = '✅ Cambios guardados correctamente.'
    } catch (e) {
        console.error(e)
        mensaje.value = '❌ Error al guardar cambios.'
    }
    }

    const restablecerValores = async () => {
    const refEvento = doc(db, 'eventos', props.idEvento)
    try {
        await updateDoc(refEvento, {
        nombreQuinceanera: '',
        fecha: '',
        imagenFondo: ''
        })

        nombre.value = ''
        fecha.value = ''
        imagenFondo.value = ''

        // Emitir evento para que el padre actualice localmente
        emit('actualizarEvento', {
        nombreQuinceanera: '',
        fecha: '',
        imagenFondo: ''
        })

        mensaje.value = '🔄 Se restablecieron los valores y cache actualizado.'
    } catch (e) {
        console.error(e)
        mensaje.value = '❌ Error al restablecer.'
    }
    }
</script>



<style scoped>
.config-box {
  background: #fafafa;
  padding: 1rem;
  border-radius: 10px;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

.preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  background-color: #6a5acd;
  border-radius: 6px;
  cursor: pointer;
}

button.danger {
  background-color: #b22222;
}

.mensaje {
  margin-top: 0.5rem;
  font-weight: bold;
}

</style>
