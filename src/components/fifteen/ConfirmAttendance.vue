<!-- components/fifteen/ConfirmAttendance.vue -->

<template>
  <div
    class="container"
    :style="{
      backgroundImage: 'url(https://dl.dropboxusercontent.com/scl/fi/ucpo6t3d9by764ew4yu27/fondo-topaz.png?rlkey=qdnl6efzqjgudccawx19t3yzr&st=mom1g4qi)'
    }"
  >
    <div class="overlay">
      <div class="contenido">

        <!-- Mensaje principal -->
        <p class="mensaje">
          Podés confirmar y realizar el pago hasta el <strong>05/08</strong>
        </p>

        <!-- Botones principales -->
        <div class="botones" v-if="!formVisible && !mostrarFormularioEdicion">
          <button class="boton" @click="formVisible = true">Sí, asistiré</button>
          <button class="boton" @click="mostrarAlertaNoAsistira">No podré asistir</button>
        </div>

      <!-- Formulario confirmación asistencia -->
      <div v-if="formVisible" class="formulario">
        <div class="campos">
          <input v-model="nombre" type="text" placeholder="Nombre" />
          <input v-model="apellido" type="text" placeholder="Apellido" />
          <input v-model="telefono" type="tel" placeholder="Teléfono (ej: 1123456789)" />
          <button @click="agregarAsistente" class="boton">Agregar</button>
          <button @click="cancelarFormulario" class="boton cancelar">Cancelar</button>
        </div>

        <ul class="lista" style="margin-top: 1rem;">
          <li v-for="(a, i) in asistentes" :key="i">{{ a.nombre }} {{ a.apellido }}</li>
        </ul>

        <button @click="confirmarAsistencia" class="boton confirmar" style="margin-top: 1rem;">
          Confirmar asistencia
        </button>

        <!-- Botón editar dentro del formulario -->
        <button @click="() => { formVisible = false; mostrarFormularioEdicion = true }" class="boton cancelar" style="margin-top: 1rem;">
          Editar asistentes
        </button>
      </div>


        <!-- Formulario edición asistentes por código -->
        <div v-if="mostrarFormularioEdicion" class="formulario-edicion">
          <h3>Editar por Código de familia</h3>

        <input
          v-model="codigoBusqueda"
          placeholder="Ingresá código de familia"
          style="text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem;"
        />
        <div class="botones" style="width: 100%; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
          <button @click="buscarFamilia" class="boton">Buscar</button>
          <button @click="cerrarEdicion" class="boton cancelar">Volver</button>
        </div>


          <div v-if="documentoEdicionId" style="margin-top: 1rem; width: 100%;">
            <input v-model="telefonoEdicion" placeholder="Teléfono" />

            <ul class="lista" style="margin-top: 1rem;">
              <li v-for="(a, i) in asistentesEdicion" :key="i" class="lista-edicion">
                <input v-model="a.nombre" placeholder="Nombre" />
                <input v-model="a.apellido" placeholder="Apellido" />
                <button @click="eliminarAsistente(i)" class="boton cancelar">Eliminar</button>
              </li>
            </ul>

            <button @click="agregarAsistenteEdicion" class="boton" style="margin-top: 0.5rem;">Agregar asistente</button>

            <div class="botones" style="margin-top: 1rem; justify-content: center;">
              <button @click="guardarCambios" class="boton confirmar">Guardar cambios</button>
              <button @click="cerrarEdicion" class="boton cancelar">Cancelar</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import Swal from 'sweetalert2'

interface Asistente {
  nombre: string
  apellido: string
}

const props = defineProps<{ eventoId: string }>()

const formVisible = ref(false)
const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const asistentes = ref<Asistente[]>([])

const mostrarFormularioEdicion = ref(false)
const codigoBusqueda = ref('')
const telefonoEdicion = ref('')
const asistentesEdicion = ref<Asistente[]>([])
const documentoEdicionId = ref<string | null>(null)

async function mostrarAlerta({
  icon = 'info',
  title = '',
  html = '',
  text = '',
  confirmButtonText = 'Aceptar',
  showCancelButton = false,
  cancelButtonText = 'Cancelar',
  onConfirm,
  onCancel
}: {
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  title?: string
  html?: string
  text?: string
  confirmButtonText?: string
  showCancelButton?: boolean
  cancelButtonText?: string
  onConfirm?: () => void
  onCancel?: () => void
} = {}) {
  const result = await Swal.fire({
    icon,
    title,
    html: html || undefined,
    text: html ? undefined : text,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    background: 'linear-gradient(145deg, #1e1e1e, #2d2d2d)',
    color: '#ffffff',
    confirmButtonColor: '#ffffff',
    cancelButtonColor: '#888',
    customClass: {
      popup: 'custom-alert-popup',
      confirmButton: 'custom-alert-button',
      cancelButton: 'custom-alert-button'
    }
  })

  if (result.isConfirmed && onConfirm) onConfirm()
  if (result.isDismissed && onCancel) onCancel()

  return result
}

function generarCodigoFamilia(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function agregarAsistente() {
  if (!nombre.value.trim() || !apellido.value.trim()) {
    mostrarAlerta({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor completá nombre y apellido del asistente.'
    })
    return
  }
  asistentes.value.push({ nombre: nombre.value.trim(), apellido: apellido.value.trim() })
  nombre.value = ''
  apellido.value = ''
}

function validarTelefono(tel: string): boolean {
  const soloNumeros = tel.replace(/\D/g, '')
  return soloNumeros.length >= 7
}

function cancelarFormulario() {
  formVisible.value = false
  nombre.value = ''
  apellido.value = ''
  telefono.value = ''
  asistentes.value = []
}

function mostrarAlertaNoAsistira() {
  mostrarAlerta({
    icon: 'info',
    title: '¡Gracias por avisar!',
    html: '<p style="font-family: Bahnschrift, sans-serif; font-size: 1rem;">Si cambiás de opinión, podés confirmar asistencia hasta el <strong>05/08</strong>.</p>',
    confirmButtonText: 'Entendido'
  })
}

async function confirmarAsistencia() {
  if (asistentes.value.length === 0) {
    mostrarAlerta({
      icon: 'warning',
      title: 'Atención',
      text: 'Agregá al menos un asistente.'
    })
    return
  }
  if (!validarTelefono(telefono.value)) {
    mostrarAlerta({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor ingresá un teléfono válido (al menos 7 dígitos).'
    })
    return
  }
  if (!telefono.value || typeof telefono.value !== 'string') {
    mostrarAlerta({
      icon: 'warning',
      title: 'Atención',
      text: 'El teléfono es inválido.'
    })
    return
  }
  for (const a of asistentes.value) {
    if (typeof a.nombre !== 'string' || !a.nombre.trim() || typeof a.apellido !== 'string' || !a.apellido.trim()) {
      mostrarAlerta({
        icon: 'warning',
        title: 'Atención',
        text: 'Todos los asistentes deben tener nombre y apellido.'
      })
      return
    }
  }

  const codigoFamilia = generarCodigoFamilia()

  try {
    console.log('Datos a guardar:', {
      codigoFamilia,
      telefono: telefono.value,
      asistentes: asistentes.value,
      confirmacion: true,
      timestamp: new Date()
    })

    await addDoc(collection(db, 'eventos', props.eventoId, 'familias'), {
      codigoFamilia,
      telefono: telefono.value,
      asistentes: asistentes.value,
      confirmacion: true,
      timestamp: serverTimestamp()
    })

    formVisible.value = false
    asistentes.value = []
    telefono.value = ''

    await mostrarAlerta({
      icon: 'success',
      title: '¡Asistencia confirmada!',
      html: `
        <p style="font-family: Bahnschrift, sans-serif; font-size: 1rem;">
          Tu <strong>código de familia</strong> es:
        </p>
        <div style="margin: 0.5rem auto 1rem; padding: 0.75rem 1.25rem; font-size: 1.5rem; font-weight: bold; border-radius: 1rem; background-color: rgba(255,255,255,0.2); width: fit-content;">
          ${codigoFamilia}
        </div>
        <p style="font-family: Bahnschrift, sans-serif; font-size: 0.95rem;">
          Te recomendamos anotarlo o hacerle una captura para futuras modificaciones.
        </p>`,

      showCancelButton: true,
      confirmButtonText: 'Copiar código',
      cancelButtonText: 'Cerrar',
      onConfirm: () => {
        navigator.clipboard.writeText(codigoFamilia)
        mostrarAlerta({
          icon: 'success',
          title: '¡Código copiado!',
          confirmButtonText: 'Ok'
        })
      }
    })
  } catch (e: any) {
    console.error('Error en confirmarAsistencia:', e)
    mostrarAlerta({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al confirmar: ' + e.message
    })
  }
}

async function buscarFamilia() {
  if (!codigoBusqueda.value.trim()) {
    mostrarAlerta({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor ingresá un código de familia.'
    })
    return
  }
  try {
    const familiasRef = collection(db, 'eventos', props.eventoId, 'familias')
    const q = query(familiasRef, where('codigoFamilia', '==', codigoBusqueda.value.trim().toUpperCase()))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      mostrarAlerta({
        icon: 'info',
        title: 'No encontrado',
        text: 'No se encontró ninguna familia con ese código.'
      })
      return
    }

    querySnapshot.forEach(docSnap => {
      documentoEdicionId.value = docSnap.id
      const data = docSnap.data()
      telefonoEdicion.value = data.telefono || ''
      asistentesEdicion.value = (data.asistentes ?? []).map((a: Asistente) => ({ ...a }))
    })
  } catch (e: any) {
    mostrarAlerta({
      icon: 'error',
      title: 'Error',
      text: 'Error al buscar la familia: ' + e.message
    })
  }
}

function agregarAsistenteEdicion() {
  asistentesEdicion.value.push({ nombre: '', apellido: '' })
}

function eliminarAsistente(index: number) {
  asistentesEdicion.value.splice(index, 1)
}

async function guardarCambios() {
  for (const a of asistentesEdicion.value) {
    if (!a.nombre.trim() || !a.apellido.trim()) {
      mostrarAlerta({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor completá nombre y apellido de todos los asistentes.'
      })
      return
    }
  }
  if (!validarTelefono(telefonoEdicion.value)) {
    mostrarAlerta({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor ingresá un teléfono válido (al menos 7 dígitos).'
    })
    return
  }
  if (!documentoEdicionId.value) {
    mostrarAlerta({
      icon: 'error',
      title: 'Error',
      text: 'No hay documento seleccionado para editar.'
    })
    return
  }

  try {
    const docRef = doc(db, 'eventos', props.eventoId, 'familias', documentoEdicionId.value)
    await updateDoc(docRef, {
      telefono: telefonoEdicion.value,
      asistentes: asistentesEdicion.value,
      timestamp: serverTimestamp()
    })

    mostrarAlerta({
      icon: 'success',
      title: 'Guardado',
      text: 'Cambios guardados correctamente.'
    })
    cerrarEdicion()
  } catch (e: any) {
    mostrarAlerta({
      icon: 'error',
      title: 'Error',
      text: 'Error al guardar los cambios: ' + e.message
    })
  }
}

function cerrarEdicion() {
  mostrarFormularioEdicion.value = false
  codigoBusqueda.value = ''
  telefonoEdicion.value = ''
  asistentesEdicion.value = []
  documentoEdicionId.value = null
}
</script>


<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('@/assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
  text-align: center;
  color: white;
  backdrop-filter: blur(4px);
}

.contenido {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.mensaje {
  font-size: 1.125rem;
  font-weight: 300;
  font-style: italic;
  margin: 0;
  font-family: 'Constantia', serif;
}

@media (min-width: 768px) {
  .mensaje {
    font-size: 1.25rem;
  }
}

.botones {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.boton {
  font-family: 'Bahnschrift', sans-serif;
  flex: 1 1 auto;
  min-width: 120px;
  max-width: 180px;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  transition: transform 0.2s ease, background-color 0.3s, color 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.boton:hover {
  background-color: white;
  color: black;
  transform: scale(1.05);
}

@media (max-width: 400px) {
  .botones {
    flex-direction: column;
  }
  .boton {
    max-width: 100%;
    font-size: 1rem;
  }
}

.tarjeta {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  width: 90vw;
  max-width: 11rem;
  aspect-ratio: 11 / 8;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.imagen-tarjeta {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icono-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}
.formulario {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.campos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.campos input {
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  text-align: center;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
  color: white;
}

.confirmar {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
}
.cancelar {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-weight: normal;
}

.cancelar:hover {
  background-color: rgba(255, 255, 255, 0.3);
  color: black;
}
.formulario-edicion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.formulario-edicion input {
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  text-align: center;
  width: 100%;
  max-width: 300px;
  font-family: 'Bahnschrift', sans-serif;
  box-sizing: border-box;
}

/* Cada bloque de asistente */
.lista-edicion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 300px;
  margin: 0 auto 1rem;
  box-sizing: border-box;
}

/* Inputs individuales dentro del asistente */
.lista-edicion input {
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
}

/* Botón de eliminar dentro del bloque */
.lista-edicion .boton {
  width: 100%;
  padding: 0.4rem;
}

</style>
