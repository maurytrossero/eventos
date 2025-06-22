<!--InvitationView.vue-->
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

    <component
      :is="componenteInvitacion"
      :key="evento?.invitacion || 'sin-invitacion'"
      v-else-if="componenteInvitacion"
      :evento="evento"
    />

    <div 
      v-if="!seleccionando && evento?.invitacion && !abrirModalConfiguracion" 
      class="acciones-superiores"
    >
      <button class="accion editar" @click="abrirModalConfiguracion = true">✏️</button>
      <button class="accion eliminar" @click="eliminarInvitacion">🗑️</button>
    </div>

    <div v-else class="cargando">
      <p>Cargando...</p>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="abrirModalConfiguracion"
      class="modal-overlay"
      @click.self="abrirModalConfiguracion = false"
    >
      <div class="modal-content">
        <div class="tabs">
          <button :class="{ active: tabActual === 'countdown' }" @click="tabActual = 'countdown'">
            Cuenta Regresiva
          </button>
          <button :class="{ active: tabActual === 'carousel' }" @click="tabActual = 'carousel'">
            Carrusel
          </button>
          <button :class="{ active: tabActual === 'info' }" @click="tabActual = 'info'">
            Información
          </button>
        </div>

        <div v-if="tabActual === 'countdown'">
          <CountdownSetting :idEvento="eventoId" @actualizarEvento="actualizarEventoLocal" />
        </div>
        <div v-else-if="tabActual === 'carousel'">
          <CarouselSetting :event-id="eventoId" @actualizarEvento="actualizarEventoLocal" />
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

        <button class="cerrar" @click="abrirModalConfiguracion = false">✖</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { updateEvento } from '@/services/firestoreService'
import { doc, onSnapshot, getFirestore } from 'firebase/firestore'

import CountdownSetting from '@/components/fifteen/CountdownSetting.vue'
import CarouselSetting from '@/components/fifteen/CarouselSetting.vue'
import InformationSetting from '@/components/fifteen/InformationSetting.vue'

const tabActual = ref<'countdown' | 'carousel' | 'info'>('countdown')
const route = useRoute()
const eventoId = route.params.eventoId as string
const evento = ref<any>(null)
const componenteInvitacion = ref<any>(null)
const seleccionando = ref(false)
const abrirModalConfiguracion = ref(false)

const db = getFirestore()

const plantillasDisponibles = ['FifteenView', 'WeddingView']

// ✅ Registro seguro de componentes
const componentesInvitacion: Record<string, () => Promise<any>> = {
  FifteenView: () => import('@/views/invitation-type/FifteenView.vue'),
  WeddingView: () => import('@/views/invitation-type/WeddingView.vue')
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
                </div>`
    },
    loadingComponent: {
      template: `<div style="padding:1rem; text-align:center;">
                  Cargando invitación...
                </div>`
    }
  })
}

onMounted(() => {
  const eventoCache = localStorage.getItem(`eventoCache_${eventoId}`)
  if (eventoCache) {
    evento.value = JSON.parse(eventoCache)
    if (evento.value?.invitacion) {
      componenteInvitacion.value = cargarComponente(evento.value.invitacion)
      seleccionando.value = false
    } else {
      seleccionando.value = true
    }
  }

  const refEvento = doc(db, 'eventos', eventoId)
  const unsubscribe = onSnapshot(refEvento, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      if (JSON.stringify(data) !== JSON.stringify(evento.value)) {
        evento.value = data
        localStorage.setItem(`eventoCache_${eventoId}`, JSON.stringify(data))

        if (data.invitacion) {
          componenteInvitacion.value = cargarComponente(data.invitacion)
          seleccionando.value = false
        } else {
          seleccionando.value = true
          componenteInvitacion.value = null
        }
      }
    }
  })

  onUnmounted(() => {
    unsubscribe()
  })
})

const seleccionarPlantilla = async (nombre: string) => {
  try {
    localStorage.removeItem(`eventoCache_${eventoId}`)
    await updateEvento(eventoId, { invitacion: nombre })

    if (evento.value) {
      evento.value.invitacion = nombre
      localStorage.setItem(`eventoCache_${eventoId}`, JSON.stringify(evento.value))
    }

    componenteInvitacion.value = cargarComponente(nombre)
    seleccionando.value = false
  } catch (error) {
    console.error('Error al seleccionar plantilla:', error)
  }
}

const eliminarInvitacion = async () => {
  try {
    await updateEvento(eventoId, { invitacion: '' })

    if (evento.value) {
      evento.value.invitacion = ''
      localStorage.removeItem(`eventoCache_${eventoId}`)
    }

    componenteInvitacion.value = null
    seleccionando.value = true
  } catch (error) {
    console.error('Error al eliminar invitación:', error)
  }
}

function handleUpdateInfo(nuevaInfo: any) {
  evento.value.informacionInvitacion = nuevaInfo
  actualizarEventoLocal({ informacionInvitacion: nuevaInfo })
}

function actualizarEventoLocal(nuevosDatos: any) {
  if (!evento.value) return
  evento.value = { ...evento.value, ...nuevosDatos }
  localStorage.setItem(`eventoCache_${eventoId}`, JSON.stringify(evento.value))
  updateEvento(eventoId, nuevosDatos).catch((e) => {
    console.error('Error actualizando Firestore:', e)
  })
}
</script>


<style scoped>
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

  .modal-content {
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .cerrar {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
  }

  .cerrar:hover {
    color: #333;
  }

  .acciones-superiores {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.6rem;
    z-index: 500;
  }

  .accion {
    background: white;
    border: none;
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s, background-color 0.3s;
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
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.tabs button {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  background-color: #eee;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #333; /* ✅ AÑADIDO */
}

.tabs button.active {
  background-color: #1976d2;
  color: white;
  font-weight: 600;
}

</style>
