<!-- views/InvitationView.vue -->
<template>
  <div>
    <div v-if="seleccionando" class="selector-contenedor">
      <div class="selector">
        <h2>Seleccioná un diseño de invitación para el evento</h2>
        <div class="plantillas">
          <button
            v-for="plantilla in plantillasDisponibles"
            :key="plantilla"
            @click="seleccionarPlantilla(plantilla)"
          >
            {{ plantilla }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-else-if="componenteInvitacion"
      ref="contenedorInvitacion"
      style="position: relative;"
    >
      <component
        :is="componenteInvitacion"
        :key="evento?.invitacion || 'sin-invitacion'"
        :evento="evento"
        :evento-id="eventoId"
      />

      <!-- Botones edición y eliminación -->
      <div
        v-if="mostrarBotones"
        class="acciones-superiores"
      >
        <button class="accion editar" @click="abrirModalConfiguracion = true" title="Editar invitación">✏️</button>
        <button class="accion eliminar" @click="eliminarInvitacion" title="Eliminar invitación">🗑️</button>
      </div>
    </div>

    <div v-else class="cargando">
      <p>Cargando...</p>
    </div>

    <!-- MODAL DE CONFIGURACIÓN -->
    <Teleport to="body">
      <div
        v-if="abrirModalConfiguracion"
        class="modal-overlay"
        @click.self="abrirModalConfiguracion = false"
      >
        <div class="modal-content scrollable">
          <!-- Mobile: collapse -->
          <div class="tabs-responsive" v-if="isMobile">
            <div class="collapse-menu">
              <button class="collapse-toggle" @click="mostrarOpciones = !mostrarOpciones">
                ⚙️ Opciones de Configuración
              </button>
              <transition name="fade">
                <div class="tabs" v-if="mostrarOpciones">
                  <button :class="{ active: tabActual === 'countdown' }" @click="cambiarTab('countdown')">Cuenta Regresiva</button>
                  <button :class="{ active: tabActual === 'carousel' }" @click="cambiarTab('carousel')">Carrusel</button>
                  <button :class="{ active: tabActual === 'info' }" @click="cambiarTab('info')">Información</button>
                  <button :class="{ active: tabActual === 'confirm' }" @click="cambiarTab('confirm')">Fondo Confirmación</button>
                  <button :class="{ active: tabActual === 'trivia' }" @click="cambiarTab('trivia')">Preguntas Trivia</button>
                  <button :class="{ active: tabActual === 'galeria' }" @click="cambiarTab('galeria')">Galería</button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Desktop: tabs fijos arriba -->
          <div class="tabs-responsive" v-else>
            <div class="tabs">
              <button :class="{ active: tabActual === 'countdown' }" @click="cambiarTab('countdown')">Cuenta Regresiva</button>
              <button :class="{ active: tabActual === 'carousel' }" @click="cambiarTab('carousel')">Carrusel</button>
              <button :class="{ active: tabActual === 'info' }" @click="cambiarTab('info')">Información</button>
              <button :class="{ active: tabActual === 'confirm' }" @click="cambiarTab('confirm')">Fondo Confirmación</button>
              <button :class="{ active: tabActual === 'trivia' }" @click="cambiarTab('trivia')">Preguntas Trivia</button>
              <button :class="{ active: tabActual === 'galeria' }" @click="cambiarTab('galeria')">Galería</button>
            </div>
          </div>

          <!-- Contenido según pestaña -->
          <div v-if="tabActual === 'countdown'">
            <CountdownSetting :idEvento="eventoId" @actualizarEvento="actualizarEventoLocal" />
          </div>
          <div v-else-if="tabActual === 'carousel'">
            <CarouselSetting :eventoId="eventoId" @actualizarEvento="actualizarEventoLocal" />
          </div>
          <div v-else-if="tabActual === 'info'">
            <InformationSetting
              :modelValue="evento.informacionInvitacion || {
                adornoSuperior: '',
                adornoInferior: '',
                textoInvitacion: '',
                tarjetas: []
              }"
              @update:modelValue="handleUpdateInfo"
              :idEvento="eventoId"
            />
          </div>
          <div v-else-if="tabActual === 'confirm'">
            <ConfirmBackgroundSetting :idEvento="eventoId" @actualizarEvento="actualizarEventoLocal" />
          </div>
          <div v-else-if="tabActual === 'trivia'">
            <TriviaSetting :eventoId="eventoId" />
          </div>
          <div v-else-if="tabActual === 'galeria'">
            <GallerySetting
              :eventoId="eventoId"
              :modelValue="evento.galeriaConfig || { activa: false, opciones: {} }"
              @update:modelValue="handleUpdateGaleria"
              @actualizarEvento="actualizarEventoLocal"
            />
          </div>

          <!-- Botón Cerrar -->
          <button class="cerrar" @click="abrirModalConfiguracion = false">✖</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  shallowRef,
  ref,
  onMounted,
  onUnmounted,
  computed,
  nextTick,
} from 'vue'
import { useRoute } from 'vue-router'
import { updateEvento } from '@/services/firestoreService'
import {
  doc,
  onSnapshot,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'

import CountdownSetting from '@/components/fifteen/CountdownSetting.vue'
import CarouselSetting from '@/components/fifteen/CarouselSetting.vue'
import InformationSetting from '@/components/fifteen/InformationSetting.vue'
import ConfirmBackgroundSetting from '@/components/fifteen/ConfirmSetting.vue'
import TriviaSetting from '@/components/TriviaQuestionForm.vue'
import GallerySetting from '@/components/gallery-live/GallerySetting.vue'

import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Para evitar warning de slug como atributo extraño
defineProps<{ slug?: string }>()

const usuarioAutorizado = ref(false) // CORRECCIÓN: inicializa aquí

const route = useRoute()
const rutaEsPublica = computed(() => route.name === 'invitacion-slug')

const detalleRef = ref<HTMLElement | null>(null)

const tabActual = ref<
  'countdown' | 'carousel' | 'info' | 'confirm' | 'trivia' | 'galeria'
>('countdown')
const eventoId = ref<string>('')
const evento = ref<any>(null)
const componenteInvitacion = shallowRef<any>(null)
const seleccionando = ref(false)
const abrirModalConfiguracion = ref(false)
const mostrarOpciones = ref(false)

const db = getFirestore()

const plantillasDisponibles = ['FifteenView', 'WeddingView']

const isMobile = window.innerWidth <= 600

const componentesInvitacion: Record<string, () => Promise<any>> = {
  FifteenView: () => import('@/views/invitation-type/FifteenView.vue'),
  WeddingView: () => import('@/views/invitation-type/WeddingView.vue'),
}

const cargarComponente = (nombre: string) => {
  const loader = componentesInvitacion[nombre]
  if (!loader) return null

  return defineAsyncComponent({
    loader,
    delay: 200,
    timeout: 10000,
    errorComponent: {
      template: `<div style="color:red; padding:1rem; text-align:center;">
                  Error al cargar la invitación.<br>
                  Probá recargar la página.
                </div>`,
    },
    loadingComponent: {
      template: `<div style="padding:1rem; text-align:center;">
                  Cargando invitación...
                </div>`,
    },
  })
}

const unsubscribe = ref<() => void>()

const cargarEvento = async () => {
  const eventoIdParam = route.params.eventoId as string | undefined
  const slugParam = route.params.slug as string | undefined

  if (eventoIdParam) {
    eventoId.value = eventoIdParam
  } else if (slugParam) {
    const eventosQuery = query(
      collection(db, 'eventos'),
      where('slug', '==', slugParam)
    )
    const snapshot = await getDocs(eventosQuery)

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0]
      eventoId.value = docSnap.id
    }
  }

  if (!eventoId.value) {
    console.warn(
      '[InvitationView] No se recibió un eventoId válido en la URL'
    )
    return
  }

  const refEvento = doc(db, 'eventos', eventoId.value)
  unsubscribe.value = onSnapshot(refEvento, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      evento.value = data
      localStorage.setItem(
        `eventoCache_${eventoId.value}`,
        JSON.stringify(data)
      )
      if (data.invitacion) {
        componenteInvitacion.value = cargarComponente(data.invitacion)
        seleccionando.value = false
      } else {
        seleccionando.value = true
        componenteInvitacion.value = null
      }
    } else {
      console.log(
        '[InvitationView] No existe el documento del evento en Firestore'
      )
    }
  })
}

// CORRECCIÓN IMPORTANTE: Detectar usuario autenticado para mostrar botones
const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  usuarioAutorizado.value = !!user
})

onMounted(cargarEvento)

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value()
    unsubscribe.value = undefined
  }
})

// Computed para controlar visibilidad botones edición/eliminación
const mostrarBotones = computed(() => {
  return (
    !rutaEsPublica.value &&
    usuarioAutorizado.value &&
    !seleccionando.value &&
    !!evento.value?.invitacion &&
    !abrirModalConfiguracion.value
  )
})

const seleccionarPlantilla = async (nombre: string) => {
  if (!eventoId.value) return

  try {
    localStorage.removeItem(`eventoCache_${eventoId.value}`)
    await updateEvento(eventoId.value, { invitacion: nombre })

    if (evento.value) {
      evento.value.invitacion = nombre
      localStorage.setItem(
        `eventoCache_${eventoId.value}`,
        JSON.stringify(evento.value)
      )
    }

    componenteInvitacion.value = cargarComponente(nombre)
    seleccionando.value = false
  } catch (error) {
    console.error('Error al seleccionar plantilla:', error)
  }
}

const eliminarInvitacion = async () => {
  if (!eventoId.value) return

  try {
    await updateEvento(eventoId.value, { invitacion: '' })

    if (evento.value) {
      evento.value.invitacion = ''
      localStorage.removeItem(`eventoCache_${eventoId.value}`)
    }

    componenteInvitacion.value = null
    seleccionando.value = true
  } catch (error) {
    console.error('Error al eliminar invitación:', error)
  }
}

function handleUpdateInfo(nuevaInfo: any) {
  if (!evento.value) return
  evento.value.informacionInvitacion = nuevaInfo
  actualizarEventoLocal({ informacionInvitacion: nuevaInfo })
}

function handleUpdateGaleria(nuevaConfig: any) {
  if (!evento.value) return
  evento.value.galeriaConfig = nuevaConfig
  actualizarEventoLocal({ galeriaConfig: nuevaConfig })
}

function actualizarEventoLocal(nuevosDatos: any) {
  if (!evento.value || !eventoId.value) return
  evento.value = { ...evento.value, ...nuevosDatos }
  localStorage.setItem(
    `eventoCache_${eventoId.value}`,
    JSON.stringify(evento.value)
  )
  updateEvento(eventoId.value, nuevosDatos).catch((e) => {
    console.error('Error actualizando Firestore:', e)
  })
}

// Scroll suave al cambiar pestaña para ver formulario y la invitación juntos
const contenedorInvitacion = ref<HTMLElement | null>(null)

function cambiarTab(tab: typeof tabActual.value) {
  tabActual.value = tab
  mostrarOpciones.value = false

  // Esperamos el DOM para el nuevo formulario antes de hacer scroll
  nextTick(() => {
    if (contenedorInvitacion.value) {
      contenedorInvitacion.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  })
}
</script>

<style scoped>
  /* (Conservé tu CSS igual, no cambió) */

  .selector-contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background: linear-gradient(to right, #f8fbff, #eaf3ff);
    padding: 2rem;
  }

  .selector {
    text-align: center;
    max-width: 600px;
    width: 100%;
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  .selector h2 {
    margin-bottom: 1.5rem;
    color: #1a3c64;
    font-size: 1.4rem;
    font-weight: 600;
  }

  .plantillas {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  button {
    padding: 12px 20px;
    font-size: 1rem;
    border: none;
    background-color: #1976d2;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  button:hover {
    background-color: #0d47a1;
    transform: translateY(-2px);
  }

  .cargando {
    text-align: center;
    padding: 4rem;
    color: #888;
    font-style: italic;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Estilos generales modal y cruz */
  .modal-content {
    position: relative;
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow-y: auto;
  }

  /* Cruz: fija en mobile dentro del modal */
  .cerrar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.4rem;
    font-weight: bold;
    color: #555;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s, color 0.3s;
    z-index: 10001;
  }

  .cerrar:hover {
    background: white;
    color: #000;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }

  /* Desktop: cruz fija en viewport, siempre visible */
  @media (min-width: 601px) {
    .cerrar {
      position: fixed;
      top: 1.5rem; /* Ajusta para que quede bien con el modal */
      right: calc(50% - 300px - 1.5rem); /* Centrado modal (max-width: 600px) menos margen */
      z-index: 11000;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
  }

  .acciones-superiores {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.6rem;
    z-index: 9999; /* Muy alto para que quede sobre todo */
  }

  .accion {
    background: white;
    border: none;
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s, background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .accion:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }

  .accion.editar {
    color: #2980b9;
  }

  .accion.eliminar {
    color: #e74c3c;
  }

  .modal-content.scrollable {
    max-height: 90vh;
    overflow-y: auto;
  }

  .tabs-responsive {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    padding-top: 1rem;
    padding-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .tabs-responsive summary {
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem 0;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .tabs button {
    padding: 0.6rem 1rem;
    font-size: 1rem;
    background-color: #eee;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #333;
    transition: background-color 0.3s ease;
  }

  .tabs button.active {
    background-color: #1976d2;
    color: white;
    font-weight: 600;
  }
  /* TRANSICIÓN SUAVE EN COLLAPSE MOBILE */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .collapse-toggle {
    background: #1976d2;
    color: white;
    font-size: 1rem;
    padding: 0.6rem 1rem;
    width: 100%;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }

  .collapse-toggle:hover {
    background-color: #125ea7;
  }

  .collapse-menu {
    padding: 0 1rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 600px) {
    .tabs {
      flex-direction: column;
      align-items: stretch;
    }

    .tabs button {
      width: 100%;
      font-size: 1rem;
    }

    .tabs-responsive summary {
      font-size: 1rem;
    }
  }
</style>
