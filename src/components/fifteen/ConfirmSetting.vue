<!-- components/fifteen/ConfirmSetting.vue -->
<template>
  <div class="config-box">

    <label>Mensaje de confirmación (opcional):</label>
    <textarea v-model="mensajeConfirmacion" placeholder="Ej: Podés confirmar tu asistencia hasta el 05/08"></textarea>

    <h2>🎨 Configurar Fondo de Confirmación</h2>

    <label>URL de imagen de fondo:</label>
    <input v-model="imagenFondo" placeholder="Pega una URL válida (Dropbox, Drive, etc)" />

    <label>O seleccioná una imagen desde tu dispositivo:</label>
    <input type="file" @change="onFileSelected" accept="image/*" />

    <!-- Cropper -->
    <ImageCropper
      v-if="mostrarCropper"
      :image="imagenTemporal"
      @cropped="onImagenRecortada"
      @cancel="mostrarCropper = false"
    />

    <div v-if="imagenFondo" class="preview">
      <p>Vista previa del fondo:</p>
      <img :src="imagenFondo" />
    </div>

    <div class="buttons">
      <button @click="guardarCambios" :disabled="subiendo">💾 Guardar</button>
      <button class="danger" @click="restablecerValores">🗑️ Restablecer</button>
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
textarea {
  width: 100%;
  height: 4rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  resize: vertical;
}

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
input[type="text"],
input[type="file"] {
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
  max-height: 300px;
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
  color: #888;
  font-size: 0.95rem;
}
</style>
