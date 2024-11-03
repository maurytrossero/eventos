<template>
  <div class="fiesta-contenedor">
    <h1 class="fiesta-titulo">Fiesta</h1>
    <h2 class="fiesta-subtitulo">Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.</h2>
    <div class="fiesta">
      <div class="tarjeta" v-for="(detalle, index) in detalles" :key="index">
        <div class="tarjeta-contenido">
          <h2>{{ detalle.titulo }}</h2>
          <p>{{ detalle.descripcion }}</p>
          <button @click="abrirModal(detalle)">{{ detalle.botonTexto }}</button>
        </div>
      </div>
    </div>
    <ModalDialog 
      :isVisible="mostrarModal" 
      :title="modalTitulo" 
      :message="modalMensaje" 
      :showInputs="isMusica" 
      @onClose="cerrarModal" 
      @enviarSugerencia="enviarSugerencia"
    />
  </div>
</template>

<script lang="ts" setup>
import ModalDialog from './ModalDialog.vue';
import { ref } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { addData } from '../services/firestoreService';

interface Detalle {
  titulo: string;
  descripcion: string;
  botonTexto: string;
  mensaje: string;
}

const mostrarModal = ref(false);
const modalTitulo = ref('');
const modalMensaje = ref('');
const isMusica = ref(false); // Variable para controlar si se trata de música

const detalles: Detalle[] = [
  {
    titulo: "Música",
    descripcion: "¿Cuál es la canción que no debe faltar en la PlayList de la noche?",
    botonTexto: "Sugerir canción",
    mensaje: "Envíanos tus sugerencias de canciones que quieres escuchar.",
  },
  {
    titulo: "Código de Vestimenta",
    descripcion: "Te orientamos para tu vestuario",
    botonTexto: "Ver más",
    mensaje: "Para que estés acorde con el ambiente festivo se recomienda vestimenta elegante de fiesta.<br /> <br />Te hacemos una pequeña solicitud: evitar vestidos blancos. <br />Gracias",
  },
  {
    titulo: "Valor Tarjeta",
    descripcion: "Conocé los valores de las tarjetas y los datos para el pago",
    botonTexto: "Ver información",
    mensaje: `Precio tarjeta<br />
      - Mayores $32.000<br />
      - Menores $15.000<br /><br />
      Tel. Cel. para enviar comprobante de pago (aclarar nombre, apellido y cantidad):<br />
      <br /><br />
      Para transferencias.<br /><br />
      Alias: `,
  }

];

// Función para abrir el modal con el contenido adecuado
const abrirModal = (detalle: Detalle) => {
  modalTitulo.value = detalle.titulo;
  modalMensaje.value = detalle.mensaje;
  mostrarModal.value = true;

  isMusica.value = detalle.titulo === "Música"; // Comprobar si el detalle es de música
};

// Función para cerrar el modal
const cerrarModal = () => {
  mostrarModal.value = false;
  // Limpiar el estado de música si es necesario
  isMusica.value = false;
};

// Función para enviar sugerencias a Firestore
const enviarSugerencia = async (nombreCancion: string, artista: string) => {
  try {
    // Crear el objeto con la estructura adecuada
    const nuevaCancion = {
      nombre: nombreCancion,
      interprete: artista,
    };
    
    // Llamar a la función addData para guardar en Firestore
    const id = await addData(nuevaCancion);
    console.log('Canción guardada con ID:', id);
    
    cerrarModal(); // Cerrar el modal después de enviar la sugerencia
  } catch (error) {
    console.error('Error al guardar la canción:', error);
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Lora&display=swap');

.fiesta-contenedor {
  font-family: 'Playfair Display', serif;
  text-align: center;
  background-color: #f0eae5;
  color: #333;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: calc(100% - 10px); /* Ajuste de ancho según lo solicitado */
  height: calc(100vh - 50px); /* Ajuste de alto según lo solicitado */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 5px auto; /* Márgenes pequeños para mantener el estilo centrado */
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

.fiesta-subtitulo {
  font-family: 'Lora', serif;
  font-size: 1.2em; /* Reducido */
  margin-bottom: 10px; /* Reducido */
  color: #333;
}

.fiesta {
  display: flex;
  justify-content: center; /* Centra las tarjetas en el contenedor */
  align-items: flex-start; /* Alinea las tarjetas en la parte superior */
  flex-wrap: wrap; /* Permite que las tarjetas se envuelvan en varias filas si es necesario */
  width: 100%;
  max-width: 1920px;
  padding: 0 20px; /* Reduce el espacio superior e inferior, ajusta el espacio lateral */
  box-sizing: border-box;
}

.tarjeta {
  width: 20%; /* Mantiene el ancho de las tarjetas */
  height: auto; /* Cambiado para que el contenido ajuste automáticamente */
  margin: 10px; /* Aumentado para mayor separación entre tarjetas */
}



.tarjeta-contenido {
  width: 100%;
  background-color: #f5e6cc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px; /* Reducido */
  box-sizing: border-box;
  text-align: center;
}

.tarjeta-contenido h2 {
  font-family: 'Lora', serif;
  font-size: 1.2em; /* Reducido */
  margin: 5px 0; /* Reducido */
}

.tarjeta-contenido p {
  font-family: 'Lora', serif;
  font-size: 0.9em; /* Reducido */
  margin-bottom: 10px; /* Reducido */
}

.tarjeta-contenido button {
  background-color: #b98b4e;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px; /* Reducido */
  font-family: 'Lora', serif;
  font-size: 0.9em; /* Reducido */
  cursor: pointer;
}

.tarjeta-contenido button:hover {
  background-color: #9a733b;
}

/* Ajustes generales para móviles en portrait */
@media (max-width: 768px) and (orientation: portrait) {
  .fiesta {
    flex-direction: column; /* Tarjetas apiladas verticalmente */
    align-items: center;
  }

  .tarjeta {
    width: 90%; /* Reducido para dejar más espacio en pantalla */
    margin-bottom: 10px; /* Margen pequeño para separación */
    height: auto; /* Ajusta la altura automáticamente */
  }

  .tarjeta-contenido {
    padding: 10px; /* Reducido el padding interno */
  }

  .tarjeta-contenido h2 {
    font-size: 0.85em; /* Reducido el tamaño del título */
    margin: 3px 0; /* Margen ajustado */
  }

  .tarjeta-contenido p {
    font-size: 0.75em; /* Reducido el tamaño del texto */
    margin-bottom: 5px; /* Margen ajustado */
  }

  .tarjeta-contenido button {
    font-size: 0.75em; /* Tamaño reducido del botón */
    padding: 6px 10px; /* Ajuste de padding para el botón */
  }
}

/* Ajustes específicos para landscape en móviles */
@media (max-width: 768px) and (orientation: landscape) {
  .fiesta {
    flex-direction: row; /* Tarjetas alineadas en fila */
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 5px;
    height: auto;
  }

  .tarjeta {
    width: 30%; /* Asegura que las tres tarjetas sean visibles en una fila */
    height: auto;
    margin: 5px;
  }

  .tarjeta-contenido {
    padding: 10px;
  }

  .tarjeta-contenido h2 {
    font-size: 0.85em; /* Reducido el tamaño del título */
    margin: 3px 0;
  }

  .tarjeta-contenido p {
    font-size: 0.75em;
    margin-bottom: 5px;
  }

  .tarjeta-contenido button {
    font-size: 0.75em;
    padding: 5px 10px;
  }
}



</style>

