<!-- components/fifteen/ConfirmSetting.vue -->
<template>
  <div class="carousel-settings">
    <h2 class="titulo">🎨 Configurar Fondo de Confirmación</h2>

    <div class="form-group">
      <label>Mensaje de confirmación (opcional):</label>
      <textarea
        v-model="mensajeConfirmacion"
        placeholder="Ej: Podés confirmar tu asistencia hasta el 05/08"
        rows="3"
      />
    </div>

    <div class="form-group">
      <label>URL de imagen de fondo:</label>
      <input
        v-model="imagenFondo"
        placeholder="Pega una URL válida (Dropbox, Drive, etc)"
        type="text"
      />
    </div>

    <div class="form-group">
      <label>O seleccioná una imagen desde tu dispositivo:</label>
      <div class="custom-file-input">
        <label for="fileUpload">📁 Seleccionar imagen</label>
        <input id="fileUpload" type="file" @change="onFileSelected" accept="image/*" />
      </div>
    </div>

    <ImageCropper
      v-if="mostrarCropper"
      :image="imagenTemporal"
      @cropped="onImagenRecortada"
      @cancel="mostrarCropper = false"
    />

    <div v-if="imagenFondo" class="preview-box">
      <p class="text-sm text-gray-600 font-medium mb-2">Vista previa del fondo:</p>
      <img :src="imagenFondo" alt="Fondo de confirmación" />
    </div>

    <div class="buttons">
      <button @click="guardarCambios" :disabled="subiendo">💾 Guardar</button>
      <button class="danger" @click="restablecerValores">♻️ Reestablecer</button>
    </div>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { uploadInvitacionBackground } from '@/services/invitacionService'
import ImageCropper from '@/components/ImageCropper.vue'

const props = defineProps<{ idEvento: string }>()
const emit = defineEmits(['actualizarFondoConfirmacion'])

const db = getFirestore()
const imagenFondo = ref('')
const mensaje = ref('')
const subiendo = ref(false)

const imagenSeleccionada = ref<File | null>(null)
const imagenTemporal = ref('')
const mostrarCropper = ref(false)
const mensajeConfirmacion = ref('')

const DEFAULT_IMAGE = 'https://dl.dropboxusercontent.com/scl/fi/ucpo6t3d9by764ew4yu27/fondo-topaz.png?rlkey=qdnl6efzqjgudccawx19t3yzr&st=mom1g4qi'

// 🔄 Cargar imagen al montar
onMounted(async () => {
  const refEvento = doc(db, 'eventos', props.idEvento)
  const snapshot = await getDoc(refEvento)
  if (snapshot.exists()) {
    const data = snapshot.data()
    imagenFondo.value = data.fondoConfirmacion || ''
    mensajeConfirmacion.value = data.mensajeConfirmacion || ''

  }
})

// 📁 Al seleccionar archivo, activar crop
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

// ✅ Al recortar imagen, subir
const onImagenRecortada = async (blob: Blob) => {
  imagenSeleccionada.value = new File([blob], 'fondo_recortado.jpg', { type: 'image/jpeg' })
  mostrarCropper.value = false
  await subirImagenRecortada()
}

// 📤 Subir imagen recortada
const subirImagenRecortada = async () => {
  if (!imagenSeleccionada.value) return

  subiendo.value = true
  mensaje.value = '🕓 Subiendo imagen...'

  try {
    const url = await uploadInvitacionBackground(imagenSeleccionada.value)
    imagenFondo.value = url
    mensaje.value = '✅ Imagen subida. Ahora hacé clic en "Guardar" para aplicarla.'
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al subir la imagen.'
  } finally {
    subiendo.value = false
  }
}

// 💾 Guardar fondo en Firestore
const guardarCambios = async () => {
  if (!imagenFondo.value) {
    mensaje.value = '❗ Debes ingresar una URL o subir una imagen.'
    return
  }

  const refEvento = doc(db, 'eventos', props.idEvento)
  try {
    await updateDoc(refEvento, {
        fondoConfirmacion: imagenFondo.value,
        mensajeConfirmacion: mensajeConfirmacion.value
    })
    emit('actualizarFondoConfirmacion', imagenFondo.value)
    mensaje.value = '✅ Fondo guardado correctamente.'
  } catch (e) {
    console.error(e)
    mensaje.value = '❌ Error al guardar fondo.'
  }
}

// 🔁 Restaurar imagen por defecto
const restablecerValores = async () => {
  const refEvento = doc(db, 'eventos', props.idEvento)
  try {
    await updateDoc(refEvento, {
        fondoConfirmacion: DEFAULT_IMAGE,
        mensajeConfirmacion: ''
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

.preview-box img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
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

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:enabled {
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
</style>