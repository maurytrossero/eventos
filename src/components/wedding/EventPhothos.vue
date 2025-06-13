<template>
    <div class="fiesta">
      <h1 class="fiesta-titulo">Galería de Recuerdos</h1>
      <br>
      <div class="carrusel">
        <div class="carrusel-contenedor" :style="carruselStyle">
          <div class="carrusel-item" v-for="(imagen, index) in imagenes" :key="index">
            <img :src="imagen" alt="Foto de la boda" />
          </div>
        </div>
        <button @click="anterior" class="carrusel-boton carrusel-boton-anterior">Anterior</button>
        <button @click="siguiente" class="carrusel-boton carrusel-boton-siguiente">Siguiente</button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { getInstagramImages } from '@/services';
  
  const imagenes = ref<string[]>([
    'https://www.dropbox.com/scl/fi/7996cwyfjs18mz6s9x5to/DSC_5882.jpg?rlkey=1kc9c8792hdmastyxp3bu8oq2&st=elyriyv4&raw=1',
    'https://www.dropbox.com/scl/fi/ox3ssc4m4e7gpf5820vwb/DSC_5876.jpg?rlkey=3hh1xhjcj07ym34dtp3psdz2p&raw=1',
    'https://www.dropbox.com/scl/fi/1m337w87mrzj15ojo26m1/DSC_5864.jpg?rlkey=qppnvzwiw1bw0vg9itu397s4w&raw=1'
  ]); // Inicializar con las imágenes de muestra
  
  const carruselIndex = ref(0);
  const pantallaCompleta = ref(false);
  const currentIndex = ref(0);
  
  const carruselStyle = computed(() => ({
    transform: `translateX(-${carruselIndex.value * 100}%)`,
    transition: 'transform 0.5s ease' // Añadir animación al movimiento del carrusel
  }));
  
  const anterior = () => {
    carruselIndex.value = (carruselIndex.value - 1 + imagenes.value.length) % imagenes.value.length;
  };
  
  const siguiente = () => {
    carruselIndex.value = (carruselIndex.value + 1) % imagenes.value.length;
  };
  
  const activarPantallaCompleta = () => {
    pantallaCompleta.value = true;
    currentIndex.value = carruselIndex.value; // Sincronizar el índice del carrusel con el modal
  };
  
  const desactivarPantallaCompleta = () => {
    pantallaCompleta.value = false;
  };
  
  let intervalId: number | undefined;
  
  onMounted(async () => {
    // Cambiar automáticamente las imágenes cada 7 segundos
    intervalId = setInterval(() => {
      siguiente();
    }, 7000); // 7000 ms = 7 segundos
  
    // Recuperar imágenes de Instagram después de 2 segundos
    setTimeout(async () => {
      await fetchImages();
    }, 2000);
  });
  
  onUnmounted(() => {
    // Limpiar el intervalo cuando el componente se desmonta
    clearInterval(intervalId);
  });
  
  const fetchImages = async () => {
    try {
      const fetchedImages = await getInstagramImages();
      imagenes.value = imagenes.value.concat(fetchedImages);
    } catch (error) {
      //console.error('Error al obtener imágenes de Instagram:', error);
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lora&display=swap');
  
  /* Estilos generales para todas las vistas */
  .fiesta {
    font-family: 'Playfair Display', serif;
    text-align: center;
    background-color: #f0eae5;
    color: #333;
    padding: 20px;
    border: 2px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: calc(100% - 10px);
    height: calc(100vh - 50px); /* Ajuste de altura */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    margin: 5px auto;
  }
  .fiesta-titulo, .fiesta-subtitulo {
    text-align: center;
  }
  
  .fiesta-titulo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5em; /* Reducido */
    margin-bottom: 5px; /* Reducido */
    color: #b98b4e;
  }
  
  
  .carrusel {
    position: relative;
    width: 60%; /* Mantener un ancho adecuado para pantallas grandes */
    height:80vh; /* Hace que el carrusel sea alto pero con proporciones originales */
    overflow: hidden;
  }
  
  .carrusel-contenedor {
    display: flex;
    transition: transform 0.5s ease;
  }
  
  .carrusel-item {
    min-width: 100%;
    box-sizing: border-box;
  }
  
  .carrusel-item img {
    width: 100%;
    height: auto; /* Mantiene las proporciones originales en web */
    border-radius: 10px;
    object-fit: cover; /* Asegura que la imagen cubra completamente el carrusel */
  }
  
  .carrusel-boton {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 1.5em;
    border-radius: 5px;
  }
  
  .carrusel-boton-anterior {
    left: 10px;
  }
  
  .carrusel-boton-siguiente {
    right: 10px;
  }
  
  .carrusel-boton:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  /* Estilos específicos para dispositivos móviles */
  @media (max-width: 768px) {
    .carrusel {
      width: 100%; /* Ocupar todo el ancho disponible */
      height: 90vh; /* Incrementar la altura para formato vertical en móvil */
    }
  
    .carrusel-item img {
      width: 100%;
      height: 100%; /* Asegura que la imagen ocupe el espacio vertical */
      object-fit: cover; /* Mantener la proporción vertical sin recortar */
    }
  
    .carrusel-boton {
      padding: 5px;
      font-size: 1em;
    }
  }
  
  </style>
  