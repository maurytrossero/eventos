<!-- components/fifteen/CarouselSetting.vue -->
<template>
  <div class="config-box">
    <h2>🖼️ Configurar Carrusel</h2>

    <label>Frase</label>
    <textarea v-model="frase" rows="3" />

    <label>Adorno superior</label>
    <input v-model="adornoSuperior" type="text" />

    <label>Adorno inferior</label>
    <input v-model="adornoInferior" type="text" />

    <label>Imágenes (una por línea)</label>
    <textarea v-model="imagenesRaw" rows="4" />

    <div class="buttons">
      <button @click="guardarConfiguracion">💾 Guardar</button>
      <button class="danger" @click="reestablecerConfiguracion">♻️ Reestablecer</button>
    </div>



    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>

  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const props = defineProps({
  eventoId: {
    type: String,
    required: true
  }
})

const adornoSuperior = ref('')
const adornoInferior = ref('')
const frase = ref('')
const imagenes = ref([])
const imagenesRaw = ref('')
const mensaje = ref('')

function syncImagenesToRaw() {
  imagenesRaw.value = imagenes.value.join('\n')
}

function syncRawToImagenes() {
  imagenes.value = imagenesRaw.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
}

async function cargarConfiguracion() {
  if (!props.eventoId) {
    console.error('eventoId no está definido')
    return
  }

  const docRef = doc(db, 'eventos', props.eventoId, 'configuracion', 'carousel')
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    adornoSuperior.value = data.adornoSuperior || ''
    adornoInferior.value = data.adornoInferior || ''
    frase.value = data.frase || ''
    imagenes.value = Array.isArray(data.imagenes) ? data.imagenes : []
    syncImagenesToRaw()
  } else {
    await setDoc(docRef, {
      adornoSuperior: '',
      adornoInferior: '',
      frase: '',
      imagenes: []
    })
    imagenes.value = []
    syncImagenesToRaw()
  }
}

async function guardarConfiguracion() {
  if (!props.eventoId) {
    console.error('No se puede guardar: eventoId es undefined')
    return
  }

  syncRawToImagenes()

  const docRef = doc(db, 'eventos', props.eventoId, 'configuracion', 'carousel')

  try {
    await updateDoc(docRef, {
      adornoSuperior: adornoSuperior.value,
      adornoInferior: adornoInferior.value,
      frase: frase.value,
      imagenes: imagenes.value
    })

    localStorage.setItem(
      `carousel-${props.eventoId}`,
      JSON.stringify({
        adornoSuperior: adornoSuperior.value,
        adornoInferior: adornoInferior.value,
        frase: frase.value,
        imagenes: imagenes.value
      })
    )

    mensaje.value = '✅ Cambios guardados correctamente.'

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      mensaje.value = ''
    }, 3000)

  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al guardar cambios.'
  }
}

async function reestablecerConfiguracion() {
  if (!props.eventoId) {
    console.error('No se puede reestablecer: eventoId es undefined')
    mensaje.value = '❌ No se puede reestablecer: eventoId es inválido.'
    return
  }

  adornoSuperior.value = ''
  adornoInferior.value = ''
  frase.value = ''
  imagenes.value = []
  syncImagenesToRaw()

  const docRef = doc(db, 'eventos', props.eventoId, 'configuracion', 'carousel')
  try {
    await updateDoc(docRef, {
      adornoSuperior: '',
      adornoInferior: '',
      frase: '',
      imagenes: []
    })

    localStorage.removeItem(`carousel-${props.eventoId}`)
    mensaje.value = '✅ Configuración reestablecida.'
    setTimeout(() => (mensaje.value = ''), 3000)
  } catch (error) {
    console.error(error)
    mensaje.value = '❌ Error al reestablecer configuración.'
  }
}



onMounted(cargarConfiguracion)

</script>

<style scoped>
  .config-box {
    background: #fafafa;
    padding: 1rem;
    border-radius: 10px;
    max-width: 500px;       /* ancho max para escritorio */
    width: 90vw;            /* ancho adaptable a móvil */
    max-height: 90vh;       /* altura máxima con scroll */
    overflow-y: auto;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    box-sizing: border-box;
  }

  /* Inputs y textarea ocupan todo el ancho del contenedor */
  textarea,
  input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    resize: vertical;
    box-sizing: border-box;
  }

  /* Botones ocupan su contenido y están alineados horizontalmente */
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