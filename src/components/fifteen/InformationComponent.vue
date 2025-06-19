<template>
  <div class="information-wrapper">
    <!-- Adorno superior -->
    <img
      class="adorno superior"
      :src="adornoSuperior"
      alt="Adorno superior"
      aria-hidden="true"
    />

    <!-- Texto invitación -->
    <div class="mensaje-invitacion">
      <p v-html="texto.replaceAll('\n', '<br>')"></p>

      <img
        class="separador-img"
        src="https://dl.dropboxusercontent.com/scl/fi/ulhlqd8fcy3xlhh5oq30v/separador.png?rlkey=sx7wsrnmamhxhx6ig99hbjwtx&st=pa7hlxgt"
        alt="Separador decorativo"
        aria-hidden="true"
      />
    </div>

    <!-- Contenedor de tarjetas -->
    <div class="modals-container">
      <ModalComponent
        v-for="(modal, index) in modals"
        :key="index"
        :frontImage="modal.frontImage"
        :frontText="modal.frontText"
        :frontIcon="modal.frontIcon"
        :backContent="modal.backContent"
        @open-music-form="abrirFormularioMusica"
      />
    </div>

    <!-- Modal de música -->
    <ModalMusic :show="showMusicModal" @close="cerrarFormularioMusica" />

    <!-- Adorno inferior -->
    <img
      class="adorno inferior"
      :src="adornoInferior"
      alt="Adorno inferior"
      aria-hidden="true"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import ModalComponent from './ModalComponent.vue'
import ModalMusic from './ModalMusic.vue'

const props = defineProps<{
  informacion?: {
    textoInvitacion: string
    adornoSuperior: string
    adornoInferior: string
    tarjetas: Array<{
      frontImage: string
      frontText: string
      frontIcon: string
      backContent: any
    }>
  }
}>()

const showMusicModal = ref(false)

function abrirFormularioMusica() {
  showMusicModal.value = true
}

function cerrarFormularioMusica() {
  showMusicModal.value = false
}

const texto = computed(() =>
  props.informacion?.textoInvitacion ||
  'El regalo es opcional,\nla asistencia es obligatoria'
)

const adornoSuperior = computed(() =>
  props.informacion?.adornoSuperior ||
  'https://dl.dropboxusercontent.com/scl/fi/ng7hgiehcw270vy5fpkld/adorno-superior.png?rlkey=siwe9gz2wlzlaeq2ihi8jtdbd&st=j89m0pxm'
)

const adornoInferior = computed(() =>
  props.informacion?.adornoInferior ||
  'https://dl.dropboxusercontent.com/scl/fi/fqccte9ioz89kmlog4lb3/adorno-inferior.png?rlkey=rsgkpbj2ty8jhwvh5kf2kwsy5&st=t9nn5t20'
)

const modals = computed(() =>
  props.informacion?.tarjetas?.length
    ? props.informacion.tarjetas
    : [
        {
          frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0h0CMgMLU-zuXvv31t2jhUWKhY2HwJCrhA&s',
          frontText: 'Precio',
          frontIcon: 'cake',
          backContent: {
            type: 'price',
            prices: [
              { description: 'Mayores', amount: '$40.000' },
              { description: 'Menores', amount: '$25.000' },
              { description: 'Juvenil', amount: '$35.000' },
              { description: 'Brindis', amount: '$20.000' }
            ]
          }
        },
        {
          frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUPnVDxHNIJTBlHK9JwfncsixbV8SwKb5Fvg&s',
          frontText: 'Lugar',
          frontIcon: 'gift',
          backContent: {
            type: 'location',
            address: `AGOSTO | 16 | 2025\nAsociación Italiana príncipe Humberto. Porteña.`,
            googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Asociación+Italiana+Príncipe+Humberto,+Porteña'
          }
        },
        {
          frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb54uUvljGEDIhS6QTp1I-JrL4PDd6xKOjfQ&s',
          frontText: 'Música',
          frontIcon: 'music',
          backContent: {
            type: 'music'
          }
        }
      ]
)
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Constantia:ital@1&display=swap');

.mensaje-invitacion {
  text-align: center;
  font-family: 'Constantia', serif;
  font-style: italic;
  color: black;
  margin-bottom: 1rem;
  z-index: 20;
}

.mensaje-invitacion p {
  font-size: 1.2rem; /* Base para mobile */
  margin: 0;
}

.separador-img {
  margin-top: 0.8rem;  /* Espacio entre texto y separador */
  width: 120px;
  height: auto;
  opacity: 0.85;
}

/* MEDIA QUERIES: más espacio en vista web */
@media (min-width: 600px) {
  .mensaje-invitacion {
    margin-bottom: 2.5rem;
  }

  .mensaje-invitacion p {
    font-size: 1.8rem;
  }

  .separador-img {
    margin-top: 1.5rem;
    width: 150px;
  }

  .modals-container {
    margin-top: 1rem;
  }
}

@media (min-width: 1024px) {
  .mensaje-invitacion p {
    font-size: 2rem;
  }

  .separador-img {
    width: 180px;
  }
}

.information-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
  flex-direction: column;
}

.adorno {
  position: absolute;
  user-select: none;
  pointer-events: none;
  z-index: 10;
  opacity: 0.7;
  width: 25vw;
  height: auto;
}

.adorno.superior {
  top: 0;
  left: 0;
}

.adorno.inferior {
  bottom: 0;
  right: 0;
}

@media (max-width: 600px) {
  .adorno {
    width: 40vw;
    opacity: 0.6;
  }
}

.modals-container {
  display: flex;
  flex-wrap: nowrap;  /* No se envuelven */
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  z-index: 20;
  max-width: 100%;
  max-height: 100%;
  flex-direction: column;  /* Default para portrait */
}

/* Escalado para móvil vertical pequeño para que entren sin scroll */
@media (max-width: 767px) and (orientation: portrait) {
  .modals-container {
    transform: scale(0.85);
    transform-origin: top center;
    gap: 1rem;
    flex-direction: column;
  }

  .information-wrapper {
    padding: 1rem 0.5rem;
  }

  .mensaje-invitacion {
    margin-bottom: 1.5rem;
  }
}

/* TODOS los dispositivos en landscape: fila sin escala */
@media (orientation: landscape) {
  .modals-container {
    flex-direction: row;
    transform: none;  /* Sin escala */
  }
}

/* Vistas web grandes (>=768px) en portrait también en fila */
@media (min-width: 768px) and (orientation: portrait) {
  .modals-container {
    flex-direction: row;
    transform: none;  /* Sin escala */
  }
}
</style>

