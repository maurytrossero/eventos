<template>
  <div class="page-background">
    <div class="upload-gallery">
      <h2 class="title">Subí tu foto 💌</h2>

      <form @submit.prevent="handleUpload" class="form">
        <!-- BOTÓN PARA TOMAR FOTO - SOLO SI ES MÓVIL -->
        <label v-if="isMobile" class="custom-btn">
          📷 Tomar foto
          <input
            type="file"
            accept="image/*"
            capture="environment"
            class="input-camera hidden-input"
            @change="handleFileChange"
          />
        </label>

        <!-- BOTÓN PARA ELEGIR DE GALERÍA - SIEMPRE -->
        <label class="custom-btn">
          🖼️ Elegir de galería
          <input
            type="file"
            accept="image/*"
            class="input-file hidden-input"
            @change="handleFileChange"
          />
        </label>

        <p v-if="file" class="filename">📸 Archivo: {{ file.name }}</p>

        <textarea
          v-model="message"
          placeholder="Mensaje opcional"
          class="textarea"
          rows="3"
        ></textarea>

        <button
          type="submit"
          :disabled="uploading || !file"
          class="btn-submit"
        >
          {{ uploading ? 'Subiendo...' : 'Enviar' }}
        </button>

        <p v-if="success" class="msg-success">¡Imagen enviada con éxito!</p>
        <p v-if="error" class="msg-error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { uploadImageWithMessage } from '@/services/galleryService'

const props = defineProps({
  eventoId: {
    type: String,
    required: true
  }
})

const file = ref<File | null>(null)
const message = ref('')
const uploading = ref(false)
const success = ref(false)
const error = ref('')

const isMobile = ref(false)

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    file.value = target.files[0]
    success.value = false
    error.value = ''
  } else {
    error.value = 'No se seleccionó ningún archivo'
  }
}

async function handleUpload() {
  if (!file.value) return

  uploading.value = true
  success.value = false
  error.value = ''

  try {
    await uploadImageWithMessage(props.eventoId, file.value, message.value)

    success.value = true
    file.value = null
    message.value = ''

    // Limpiar los inputs de tipo file
    const inputs = document.querySelectorAll('input[type="file"]')
    inputs.forEach((input) => {
      (input as HTMLInputElement).value = ''
    })
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Error al subir la imagen. Intenta nuevamente.'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.page-background {
  min-height: 100vh;
  background-color: #fffafc; /* color fijo */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

/* Contenedor central del formulario */
.upload-gallery {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(185, 139, 78, 0.3);
  width: 100%;
  max-width: 500px; /* máximo ancho razonable en desktop */
  padding: 2rem 2.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  margin: 0 1rem; /* margen horizontal para mobile */
  box-sizing: border-box;
}

/* Título */
.title {
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
  color: #b98b4e;
  margin-bottom: 2rem;
}

/* Formulario - columna vertical con separación */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: stretch;
}

/* Botones para subir imagen */
.custom-btn {
  background-color: #f7e9dd;
  border: 1.5px solid #b98b4e;
  color: #b98b4e;
  font-weight: 600;
  padding: 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.15s ease;
  display: inline-block;
  text-align: center;
  user-select: none;
}

.custom-btn:hover {
  background-color: #f1ddc8;
  transform: scale(1.04);
}

/* Inputs tipo file ocultos */
.hidden-input {
  display: none;
}

/* Textarea con ancho completo */
.textarea {
  box-sizing: border-box; /* agrega esta línea */
  border: 1.5px solid #b98b4e;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  min-height: 80px;
}


.textarea:focus {
  outline: none;
  border-color: #9a733b;
  box-shadow: 0 0 6px #9a733baa;
}

/* Botón submit: ancho completo, buen tamaño y accesible */
.btn-submit {
  background-color: #b98b4e;
  color: white;
  font-weight: 700;
  padding: 0.85rem 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.15rem;
  transition: background-color 0.3s ease;
  width: 100%;
}

.btn-submit:hover:not(:disabled) {
  background-color: #9a733b;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mensajes */
.msg-success {
  color: #2c7a2c;
  font-weight: 600;
  margin-top: -0.5rem;
}

.msg-error {
  color: #d43f3a;
  font-weight: 600;
  margin-top: -0.5rem;
}

/* Nombre archivo */
.filename {
  font-size: 0.9rem;
  color: #555;
  word-break: break-word;
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}

/* Ocultar input-camera en desktop */
@media (min-width: 768px) {
  .input-camera {
    display: none !important;
  }
}

/* Ajustes para pantallas pequeñas (mobile horizontal, tablets) */
@media (max-width: 480px) {
  .upload-gallery {
    padding: 1.5rem 1.25rem;
  }

  .custom-btn {
    font-size: 0.9rem;
    padding: 0.7rem;
  }

  .btn-submit {
    font-size: 1rem;
  }
}

</style>
