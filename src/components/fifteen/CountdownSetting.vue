<!-- components/fifteen/CountdownSetting.vue -->
<template>
  <div class="config-box">
    <h2>🛠️ Configurar Cuenta Regresiva</h2>

    <label>Nombre:</label>
    <input type="text" v-model="nombre" placeholder="Ej: Kiara" />

    <label>Título del evento (ej: 'MIS QUINCE'):</label>
    <input type="text" v-model="titulo" placeholder="Ej: MIS QUINCE, NUESTRA BODA, etc." />

    <label>Fecha y hora del evento:</label>
    <input type="datetime-local" v-model="fecha" />

    <label>Imagen de fondo:</label>
    <div class="custom-file-input">
      <label for="fileUpload">📁 Seleccionar imagen</label>
      <input
        type="file"
        id="fileUpload"
        @change="onFileSelected"
        accept="image/*"
      />
    </div>
    <small>O pegá una URL de imagen:</small>
    <input type="text" v-model="imagenFondo" placeholder="https://..." />

    <small v-if="subiendoImagen">🕒 Subiendo imagen...</small>
    <small v-if="errorImagen" class="danger">❌ {{ errorImagen }}</small>

    <div v-if="imagenFondo" class="preview">
      <p>Vista previa del fondo:</p>
      <img :src="imagenFondo" />
    </div>

    <ImageCropper
      v-if="mostrarCropper"
      :image="imagenTemporal"
      @cropped="onImagenRecortada"
      @cancel="mostrarCropper = false"
    />

    <div class="buttons">
      <button @click="guardarCambios">💾 Guardar</button>
      <button class="danger" @click="restablecerValores">♻️ Reestablecer</button>
    </div>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { uploadInvitacionBackground } from '@/services/invitacionService'
import ImageCropper from '@/components/ImageCropper.vue'

const route = useRoute()
const eventoId = route.params.eventoId as string
const evento = ref<any>(null)

const nombre = ref('')
const titulo = ref('')
const fecha = ref('')
const imagenFondo = ref('')
const imagenSeleccionada = ref<File | null>(null)
const imagenTemporal = ref('')
const mostrarCropper = ref(false)

const subiendoImagen = ref(false)
const errorImagen = ref('')
const mensaje = ref('')

const cargarEvento = async () => {
  const eventoRef = doc(db, 'eventos', eventoId)
  const snap = await getDoc(eventoRef)
  if (snap.exists()) {
    evento.value = snap.data()
    nombre.value = evento.value?.nombreQuinceanera || ''
    titulo.value = evento.value?.titulo || ''
    fecha.value = evento.value?.fecha || ''
    imagenFondo.value = evento.value?.imagenFondo || ''
  }
}
cargarEvento()

const onImagenRecortada = async (blob: Blob) => {
  imagenSeleccionada.value = new File([blob], 'fondo_recortado.jpg', { type: 'image/jpeg' })
  mostrarCropper.value = false
  await guardarImagenFondo()
}

const guardarImagenFondo = async () => {
  if (!imagenSeleccionada.value) return
  subiendoImagen.value = true
  errorImagen.value = ''
  try {
    const nuevaURL = await uploadInvitacionBackground(imagenSeleccionada.value)
    const eventoRef = doc(db, 'eventos', eventoId)
    await updateDoc(eventoRef, {
      imagenFondo: nuevaURL
    })
    imagenFondo.value = nuevaURL
    mensaje.value = '✅ Imagen guardada correctamente'
  } catch (error) {
    console.error(error)
    errorImagen.value = '❌ Error al subir imagen'
  } finally {
    subiendoImagen.value = false
  }
}

const onFileSelected = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imagenTemporal.value = reader.result as string
      mostrarCropper.value = true
    }
    reader.readAsDataURL(file)
  }
}

const guardarCambios = async () => {
  if (!nombre.value.trim()) {
    mensaje.value = '❗ El nombre no puede estar vacío.'
    return
  }
  if (!titulo.value.trim()) {
    mensaje.value = '❗ El título no puede estar vacío.'
    return
  }

  const eventoRef = doc(db, 'eventos', eventoId)
  try {
    await updateDoc(eventoRef, {
      nombreQuinceanera: nombre.value,
      titulo: titulo.value,
      fecha: fecha.value,
      imagenFondo: imagenFondo.value
    })
    mensaje.value = '✅ Cambios guardados correctamente.'
  } catch (error) {
    console.error(error)
    mensaje.value = '❌ Error al guardar cambios.'
  }
}

const restablecerValores = () => {
  if (evento.value) {
    nombre.value = evento.value?.nombreQuinceanera || ''
    titulo.value = evento.value?.titulo || ''
    fecha.value = evento.value?.fecha || ''
    imagenFondo.value = evento.value?.imagenFondo || ''
    mensaje.value = '🔄 Valores restablecidos.'
  }
}
</script>

<style scoped>
.config-box {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

label {
  font-weight: 500;
  margin-bottom: 0.4rem;
  display: block;
  color: #444;
}

input[type="text"],
input[type="datetime-local"],
input[type="file"] {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: inherit;
  transition: border 0.2s, background-color 0.2s;
}

input[type="text"]:focus,
input[type="datetime-local"]:focus {
  border-color: #999;
  background-color: #fff;
  outline: none;
}

input[type="file"] {
  padding: 0.5rem 0.3rem;
  background-color: #fff;
  cursor: pointer;
}

small {
  font-size: 0.85rem;
  color: #777;
}

.preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  margin-top: 0.5rem;
  border: 1px solid #e0e0e0;
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
  padding: 0.5rem 1rem;
  background-color: #e0e0e0;
  color: #333;
  font-family: 'Poppins', sans-serif;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.custom-file-input label:hover {
  background-color: #d0d0d0;
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
  .config-box {
    background: #1e1e1e;
    color: #f1f1f1;
    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.04);
  }

  label {
    color: #ccc;
  }

  input[type="text"],
  input[type="datetime-local"],
  input[type="file"] {
    background-color: #2a2a2a;
    border: 1px solid #555;
    color: #eee;
  }

  input[type="text"]:focus,
  input[type="datetime-local"]:focus {
    background-color: #1a1a1a;
    border-color: #777;
  }

  .custom-file-input label {
    background-color: #444;
    color: #eee;
  }

  .custom-file-input label:hover {
    background-color: #555;
  }

  .preview img {
    border: 1px solid #555;
  }

  .mensaje {
    color: #ccc;
  }

  small {
    color: #aaa;
  }

  button {
    background-color: #3a8ddb;
  }

  button:hover {
    background-color: #2f76b6;
  }

  button.danger {
    background-color: #a52828;
  }

  button.danger:hover {
    background-color: #821c1c;
  }
}

</style>
