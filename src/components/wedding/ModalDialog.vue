<template>
    <div class="modal-backdrop" v-if="isVisible">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="modal-close" @click="$emit('onClose')">✖</button>
        </div>
        <div class="modal-body">
          <p v-html="message"></p>
          <!-- Sección para inputs de sugerencias de música -->
          <div v-if="showInputs" class="inputs-container">
            <input
              type="text"
              placeholder="Nombre de la canción"
              v-model="nombreCancion"
              class="modal-input"
            />
            <input
              type="text"
              placeholder="Artista"
              v-model="artista"
              class="modal-input"
            />
            <button class="modal-button enviar-sugerencia" @click="enviarSugerencia">
              Enviar Sugerencia
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="$emit('onClose')">Cerrar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      isVisible: {
        type: Boolean,
        required: true
      },
      showInputs: {
        type: Boolean,
        default: false // Asegúrate de que tenga un valor por defecto
      }
    },
    data() {
      return {
        nombreCancion: '',
        artista: ''
      };
    },
    methods: {
      enviarSugerencia() {
        // Emitir la sugerencia al componente padre
        this.$emit('enviarSugerencia', this.nombreCancion, this.artista);
        // Limpiar los inputs después de enviar
        this.nombreCancion = '';
        this.artista = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: white;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
  }
  
  .modal-body {
    margin: 20px 0;
  }
  
  .inputs-container {
    display: flex;
    flex-direction: column; /* Cambiado a columna para centrar los inputs */
    align-items: center; /* Centra los inputs horizontalmente */
  }
  
  .modal-footer {
    text-align: right;
  }
  
  .modal-button {
    background-color: #b98b4e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .modal-button:hover {
    background-color: #9a733b;
  }
  
  /* Estilo para los inputs */
  .modal-input {
    width: 100%; /* Mantiene el input al 100% del ancho del contenedor */
    max-width: 300px; /* Ancho máximo para que no se extienda demasiado */
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  /* Estilo específico para el botón de enviar sugerencia */
  .enviar-sugerencia {
    margin-top: 15px; /* Añadir margen superior para separar del input */
  }
  @media (max-width: 768px) {
    .modal {
      width: 75%; /* Mantén el ancho al 90% en dispositivos móviles */
      padding: 15px; /* Reduce el padding para que todo entre bien */
    }
  
    .modal-header h3 {
      font-size: 1.2em; /* Ajusta el tamaño del título en móviles */
    }
  
    .modal-body {
      font-size: 1em; /* Ajusta el tamaño del texto del cuerpo en móviles */
    }
  
    .modal-input {
      font-size: 0.9em; /* Ajusta el tamaño del texto dentro de los inputs */
    }
  
    .modal-button {
      padding: 8px 16px; /* Reduce el padding del botón para mejor ajuste */
      font-size: 0.9em; /* Ajusta el tamaño del texto del botón */
    }
  }
  </style>
  