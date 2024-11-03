<template>
    <div class="modal" @click.self="cerrarModal" aria-modal="true" role="dialog">
      <transition name="modal">
        <div class="modal-content" v-show="mostrarModal">
          <span class="close" @click="cerrarModal">&times;</span>
          <h2 class="titulo-mesa">Invitados de la Mesa {{ mesa }}</h2>
          <ul class="lista-invitados">
            <li
              v-for="(invitado, index) in invitados"
              :key="invitado.id_invitado"
              :class="{'fade-in': mostrarLista}"
              :style="{ opacity: mostrarLista ? 1 : 0, transition: `opacity 0.2s ${index * 0.1}s` }"
            >
              <span class="icono-invitado">🎉</span>
              {{ invitado.nombre }} - Mesa {{ invitado.mesa }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      invitados: {
        type: Array,
        required: true,
      },
      mesa: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        mostrarModal: true,
        mostrarLista: false,
      };
    },
    methods: {
      cerrarModal() {
        this.mostrarModal = false;
        setTimeout(() => {
          this.$emit('close');
        }, 300);
      },
      handleKeydown(event) {
        if (event.key === 'Escape') {
          this.cerrarModal();
        }
      },
    },
    mounted() {
      setTimeout(() => {
        this.mostrarLista = true;
      }, 300);
      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() { // Cambiado aquí
      window.removeEventListener('keydown', this.handleKeydown);
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex; /* Flexbox para centrar */
    justify-content: center; /* Centrar horizontalmente */
    align-items: center; /* Centrar verticalmente */
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border-radius: 8px; /* Esquinas redondeadas */
    width: 80%;
    max-width: 600px; /* Ancho máximo */
    animation: scaleIn 0.3s forwards; /* Animación de entrada */
    transform: scale(0); /* Comienza desde 0 */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Sombra para dar profundidad */
  }
  
  .titulo-mesa {
    text-align: center; /* Centrar el título */
    font-size: 24px; /* Tamaño del título */
    margin-bottom: 20px; /* Margen inferior */
    color: #2c3e50; /* Color atractivo */
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #e74c3e; /* Color al pasar el mouse */
    text-decoration: none;
    cursor: pointer;
  }
  
  .lista-invitados {
    list-style: none; /* Eliminar puntos de enumeración */
    padding: 0; /* Eliminar padding */
  }
  
  .fade-in {
    opacity: 1; /* Asegúrate de que se puede ver */
    transition: opacity 0.2s; /* Transición para la entrada */
  }
  
  li {
    opacity: 0; /* Comienza como invisible */
    text-align: center; /* Centrar texto */
    font-size: 18px; /* Tamaño del texto */
    margin: 10px 0; /* Margen entre invitados */
  }
  
  .icono-invitado {
    margin-right: 8px; /* Espaciado entre icono y texto */
  }
  
  @keyframes scaleIn {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  
  /* Animación de cierre */
  .modal-content-leave-active {
    animation: scaleOut 0.3s forwards;
  }
  
  @keyframes scaleOut {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  </style>
  