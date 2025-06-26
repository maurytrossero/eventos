<!-- components/fifteen/CountdownSetting.vue -->
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

      // Valores por defecto sugeridos
      const valoresPorDefecto = {
        nombreQuinceanera: 'Quinceañera',
        fecha: '2025-12-31',
        imagenFondo: 'https://dl.dropboxusercontent.com/scl/fi/3pe534n3rtymvhtlpxf34/fondo-cuenta-regresiva-horizontal.jpg?rlkey=2i5soo6xdsd7jz7rirv06kim2&st=b5x2h244'
      }

      try {
        await updateDoc(refEvento, valoresPorDefecto)

        // Actualizar reactividad local
        nombre.value = valoresPorDefecto.nombreQuinceanera
        fecha.value = valoresPorDefecto.fecha
        imagenFondo.value = valoresPorDefecto.imagenFondo

        // Emitir evento para que el padre también actualice
        emit('actualizarEvento', valoresPorDefecto)

        mensaje.value = '🔄 Se restablecieron los valores por defecto correctamente.'
      } catch (e) {
        console.error(e)
        mensaje.value = '❌ Error al restablecer los valores.'
      }
    }

</script>



<style scoped>
.config-box {
  background: #fafafa;
  padding: 1rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-sizing: border-box;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
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
  justify-content: center;
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

.mensaje {
  margin-top: 0.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
}

/* Responsivo para móviles */
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
</style>
