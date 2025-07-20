<!-- components/fifteen/ConfirmSetting.vue -->
<template>
  <div class="config-box">
    <h2 class="text-xl font-bold text-gray-800">🎨 Configurar Fondo de Confirmación</h2>

    <div class="form-group">
      <label class="label">Mensaje de confirmación (opcional):</label>
      <textarea v-model="mensajeConfirmacion" placeholder="Ej: Podés confirmar tu asistencia hasta el 05/08" class="form-textarea"></textarea>
    </div>

    <div class="form-group">
      <label class="label">URL de imagen de fondo:</label>
      <input v-model="imagenFondo" placeholder="Pega una URL válida (Dropbox, Drive, etc)" class="form-input" />
    </div>

    <div class="form-group">
      <label class="label">O seleccioná una imagen desde tu dispositivo:</label>
      <label class="custom-file-upload">
        📁 Seleccionar imagen
        <input type="file" @change="onFileSelected" accept="image/*" />
      </label>
    </div>

    <ImageCropper
      v-if="mostrarCropper"
      :image="imagenTemporal"
      @cropped="onImagenRecortada"
      @cancel="mostrarCropper = false"
    />

    <div v-if="imagenFondo" class="preview">
      <p class="text-sm text-gray-600 font-medium mb-2">Vista previa del fondo:</p>
      <img :src="imagenFondo" />
    </div>

    <div class="buttons">
      <button @click="guardarCambios" :disabled="subiendo" class="btn btn-primary">💾 Guardar</button>
      <button @click="restablecerValores" class="btn btn-danger">🗑️ Restablecer</button>
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

.label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.4rem;
  display: block;
}

.form-input,
.form-textarea {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #f9f9f9;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #6366f1;
  background-color: #fff;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.custom-file-upload {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  background-color: #f9f9f9;
  color: #333;
  border: 1px solid #d1d5db;
  transition: background-color 0.3s ease;
  font-family: inherit;
}

.custom-file-upload:hover {
  background-color: #f3f4f6;
}

.custom-file-upload input[type="file"] {
  display: none;
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
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: inherit;
  transition: background-color 0.3s ease;
}

.btn-primary {
  color: #fff;
  background-color: #6366f1;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.btn-danger {
  color: #fff;
  background-color: #ef4444;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.mensaje {
  margin-top: 0.5rem;
  font-weight: bold;
  text-align: center;
  color: #444;
}

@media (max-width: 600px) {
  .buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-danger {
    width: 100%;
  }
}
</style>
