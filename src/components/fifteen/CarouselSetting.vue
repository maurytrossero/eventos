<!-- components/fifteen/CarouselSetting.vue -->
<template>
  <div class="carousel-settings">
    <h2 class="titulo">🖼️ Configurar Carrusel</h2>

    <div class="form-group">
      <label>Frase</label>
      <textarea v-model="frase" rows="3" placeholder="Frase para mostrar" />
    </div>

    <div class="form-group">
      <label>Adorno superior</label>
      <div class="custom-file-input">
        <label for="adornoSuperiorUpload">📁 Seleccionar imagen</label>
        <input type="file" id="adornoSuperiorUpload" @change="handleUploadAdornoSuperior" accept="image/*" />
      </div>
      <div v-if="adornoSuperior" class="preview-box">
        <img :src="adornoSuperior" alt="Adorno superior" width="120" />
      </div>
    </div>

    <div class="form-group">
      <label>Adorno inferior</label>
      <div class="custom-file-input">
        <label for="adornoInferiorUpload">📁 Seleccionar imagen</label>
        <input type="file" id="adornoInferiorUpload" @change="handleUploadAdornoInferior" accept="image/*" />
      </div>
      <div v-if="adornoInferior" class="preview-box">
        <img :src="adornoInferior" alt="Adorno inferior" width="120" />
      </div>
    </div>

    <div class="form-group">
      <label>Imágenes (una por línea)</label>
      <textarea v-model="imagenesRaw" rows="4" placeholder="https://... (una por línea)" />
    </div>

    <div class="form-group">
      <label>Subir imagen desde tu dispositivo</label>
      <div class="custom-file-input">
        <label for="imagenesUpload">📁 Seleccionar imagen</label>
        <input type="file" id="imagenesUpload" @change="handleUpload" accept="image/*" />
      </div>
    </div>

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
import { uploadImageToCloudinary } from '@/services/galleryService' // o tu path correcto

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
    setTimeout(() => (mensaje.value = ''), 3000)
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al guardar cambios.'
  }
}

async function reestablecerConfiguracion() {
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

async function handleUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    const url = await uploadImageToCloudinary(file)
    imagenes.value.push(url)
    syncImagenesToRaw()
    mensaje.value = '✅ Imagen subida y añadida.'
    setTimeout(() => (mensaje.value = ''), 2000)
  } catch (e) {
    console.error('Error al subir a Cloudinary:', e)
    mensaje.value = '❌ Error al subir imagen.'
  }
}

async function handleUploadAdornoSuperior(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    const url = await uploadImageToCloudinary(file)
    adornoSuperior.value = url
    mensaje.value = '✅ Adorno superior actualizado.'
    setTimeout(() => (mensaje.value = ''), 2000)
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al subir adorno superior.'
  }
}

async function handleUploadAdornoInferior(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    const url = await uploadImageToCloudinary(file)
    adornoInferior.value = url
    mensaje.value = '✅ Adorno inferior actualizado.'
    setTimeout(() => (mensaje.value = ''), 2000)
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al subir adorno inferior.'
  }
}

onMounted(cargarConfiguracion)
</script>

<style scoped>
.carousel-settings {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.titulo {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

textarea,
input[type="text"],
input[type="datetime-local"] {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background: white;
  color: #333;
  resize: vertical;
  box-sizing: border-box;
}

.custom-file-input {
  position: relative;
  display: inline-block;
}

.custom-file-input input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.custom-file-input label {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #e0e0e0;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.custom-file-input label:hover {
  background-color: #d0d0d0;
}

.preview-box {
  margin-top: 0.5rem;
  text-align: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  color: white;
  background-color: #4a90e2;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: 'Poppins', sans-serif;
  min-width: 130px;
}

button:hover {
  background-color: #357ac4;
}

button.danger {
  background-color: #b22222;
}

button.danger:hover {
  background-color: #8b1a1a;
}

.mensaje {
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
  color: #333;
}

@media (max-width: 500px) {
  .buttons {
    flex-direction: column;
    gap: 0.8rem;
  }

  button {
    width: 100%;
  }
}
@media (prefers-color-scheme: dark) {
  .carousel-settings {
    background: #1e1e1e;
    color: #f0f0f0;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  .titulo {
    color: #f0f0f0;
  }

  textarea,
  input[type="text"],
  input[type="datetime-local"] {
    background: #2a2a2a;
    border: 1px solid #555;
    color: #f0f0f0;
  }

  .custom-file-input label {
    background-color: #333;
    color: #f0f0f0;
  }

  .custom-file-input label:hover {
    background-color: #444;
  }

  .mensaje {
    color: #f0f0f0;
  }

  button {
    background-color: #4a90e2;
    color: white;
  }

  button:hover {
    background-color: #357ac4;
  }

  button.danger {
    background-color: #c0392b;
  }

  button.danger:hover {
    background-color: #992d22;
  }
}

</style>

