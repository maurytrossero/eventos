<!-- components/fifteen/CountdownSetting.vue -->
<template>
  <div class="config-box">
    <h2>🛠️ Configurar Cuenta Regresiva</h2>

    <label>Nombre:</label>
    <input v-model="nombre" placeholder="Ej: Kiara" />

    <label>Título del evento (ej: 'MIS QUINCE'):</label>
    <input v-model="titulo" placeholder="Ej: MIS QUINCE, NUESTRA BODA, etc." />

    <label>Fecha y hora del evento:</label>
    <input type="datetime-local" v-model="fecha" />

    <label>Imagen de fondo:</label>
    <input type="file" @change="onFileSelected" accept="image/*" />
    <small>O pegá una URL de imagen:</small>
    <input type="text" v-model="imagenFondo" placeholder="https://..." />

    <small v-if="subiendoImagen">🕒 Subiendo imagen...</small>
    <small v-if="errorImagen" class="danger">❌ {{ errorImagen }}</small>

    <div v-if="imagenFondo" class="preview">
      <p>Vista previa del fondo:</p>
      <img :src="imagenFondo" />
    </div>

    <!-- Cropper -->
    <ImageCropper
      v-if="mostrarCropper"
      :image="imagenTemporal"
      @cropped="onImagenRecortada"
      @cancel="mostrarCropper = false"
    />

    <div class="buttons">
      <button @click="guardarCambios">💾 Guardar</button>
      <button @click="restablecerValores" class="danger">🗑️ Restablecer</button>
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

// 🔄 Cargar datos del evento
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

// ✅ Recibe el blob de imagen recortada
const onImagenRecortada = async (blob: Blob) => {
  imagenSeleccionada.value = new File([blob], 'fondo_recortado.jpg', { type: 'image/jpeg' })
  mostrarCropper.value = false
  await guardarImagenFondo()
}

// 📤 Subir imagen recortada
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

// 📁 Selección desde archivo
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

// 💾 Guardar todos los cambios (nombre, título, fecha e imagen)
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

// 🔄 Restablecer valores a los valores guardados
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

.danger {
  color: red;
}

.preview img {
  max-width: 100%;
  margin-top: 0.5rem;
  border-radius: 8px;
}

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
