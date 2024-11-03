<template>
    <div class="salon">
      <div class="sector izquierda">
        <div class="columnas">
          <div class="columna">
            <div
              v-for="(mesa, index) in mesasIzquierda"
              :key="index"
              class="mesa"
              @click="toggleInvitados(index)"
              :class="{ seleccionado: mesaSeleccionada === index }"
            >
              <div class="icono-mesa">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="sector central">
        <div class="pista-bailar">Pista de Baile</div>
      </div>
      <div class="sector derecha">
        <div class="columnas">
          <div class="columna">
            <div
              v-for="(mesa, index) in mesasDerecha"
              :key="index"
              class="mesa"
              @click="toggleInvitados(index + 6)"
              :class="{ seleccionado: mesaSeleccionada === index + 6 }"
            >
              <div class="icono-mesa">{{ index + 7 }}</div>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="mesaSeleccionada !== null" class="invitados-overlay">
          <div class="invitados-modal">
            <button class="cerrar" @click="cerrarVentana">✖</button>
            <h4>Invitados en Mesa {{ mesaSeleccionada + 1 }}</h4>
            <ul>
              <li v-for="(invitado, i) in getInvitados(mesaSeleccionada)" :key="i">{{ invitado }}</li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  interface Mesa {
    abierta: boolean;
    invitados: string[];
  }
  
  const mesasIzquierda = ref<Mesa[]>([]);
  const mesasDerecha = ref<Mesa[]>([]);
  const mesaSeleccionada = ref<number | null>(null);
  
  // Indica si se deben cargar datos de la API o de prueba
  const usarApi = ref(false);
  
// Datos de prueba
const datosPrueba: Mesa[] = [
    {
        abierta: false,
        invitados: [
        'Diego García',
        'Tania Pérez',
        'Alfredo López',
        'Ignacio Torres',
        'Natalia Fernández',
        'Mauricio González',
        'Lucía Fernández',
        'Pablo Ruiz',
        'Sofía Pérez',
        'Juan López',
        'María Rodríguez',
        'Carlos Sánchez'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Fernando Martínez',
        'Camila Morales',
        'Hugo Fernández',
        'Isabel Vega',
        'Gabriel Castro',
        'Valeria Salinas',
        'José Romero',
        'Andrea Ruiz',
        'Arturo Gómez',
        'Claudia Mendoza',
        'Jorge Herrera',
        'Sabrina López'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Ricardo Díaz',
        'Julia Ramírez',
        'Samuel Carrillo',
        'Renata Torres',
        'Sebastián Cordero',
        'Paola Cortés',
        'Marco Polo',
        'Gina Mendoza',
        'Eduardo Ruiz',
        'Victoria Aguirre',
        'Omar Silva',
        'Valentina Castillo'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Lucas Gómez',
        'Paola Castillo',
        'Alberto Navarro',
        'Liliana Rojas',
        'Cristian Morales',
        'Mariana Sosa',
        'Alberto León',
        'Leticia Paredes',
        'Raúl Soto',
        'María Paz',
        'Adriana Pérez',
        'Andrés Delgado'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Fernando Ruiz',
        'Elena Martínez',
        'Julián López',
        'Ana Carolina',
        'Felipe Vázquez',
        'Carla Ríos',
        'Miguel Angel',
        'Fabiola Ortega',
        'Iván Silva',
        'Bianca Salinas',
        'Guillermo Arévalo',
        'Luisa Ortega'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Gustavo Espinosa',
        'Ángela Méndez',
        'Alejandro Vázquez',
        'Natalia Salcedo',
        'Julio Díaz',
        'Patricia Serrano',
        'Claudio Ruiz',
        'Francisca Ríos',
        'Esteban Valenzuela',
        'Monserrat Aguirre',
        'Nicolás Ibarra',
        'Luisa Orozco'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Javier Morales',
        'Fernanda López',
        'Silvio González',
        'Berenice Ruiz',
        'Esteban Andrade',
        'Beatriz Santos',
        'Ricardo Martínez',
        'Vanessa Pineda',
        'Leonardo Rojas',
        'Gina Salinas',
        'Emilio López',
        'Natalia Castro'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Victor Manrique',
        'Rosario Ortega',
        'Fernando Salas',
        'Laura Méndez',
        'Santiago Pérez',
        'Miriam López',
        'Carlos Álvarez',
        'Silvia Martínez',
        'Alejandro Torres',
        'Julián Reyes',
        'Carmen Huerta',
        'Jorge Sánchez'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Mariano Silva',
        'Lucía González',
        'Pablo Ramírez',
        'Florencia Paredes',
        'Esteban Morales',
        'Cynthia Ortega',
        'Daniela Cordero',
        'Eduardo Ramírez',
        'Sofía López',
        'Raúl Aguirre',
        'Andrea Hernández',
        'Cecilia Rojas'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Rafael Castañeda',
        'Luciana Romero',
        'Carlos Gómez',
        'Beatriz Salinas',
        'Salvador Pérez',
        'Laura Mendoza',
        'Ricardo López',
        'Susana Castillo',
        'Fernando Herrera',
        'Paola Ramírez',
        'Álvaro Salgado',
        'Gabriela Alarcón'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Emiliano Vargas',
        'Eliana Valdez',
        'Francisco López',
        'Estela Fernández',
        'Joaquín Salas',
        'Melisa Aguirre',
        'Santiago Carrillo',
        'Evelyn Suárez',
        'Carlos Martínez',
        'Cinthia Rojas',
        'Mario Córdova',
        'Nadia Benítez'
        ]
    },
    {
        abierta: false,
        invitados: [
        'Esteban Guzmán',
        'Cristina Parra',
        'Alfonso Mendoza',
        'Natalia Torres',
        'Rodrigo Castro',
        'Evelyn Guerrero',
        'Iván Salazar',
        'Marta Vargas',
        'José Zúñiga',
        'Flavia Morales',
        'Roberto Quiroz',
        'Carmen Córdova'
        ]
    }];
  
  const cargarDatos = async () => {
    if (usarApi.value) {
      try {
        const response = await axios.get('http://tu-api-laravel/invitados');
        const mesasData = response.data.mesas;
  
        mesasIzquierda.value = mesasData.slice(0, 6).map((mesa: any) => ({
          abierta: mesa.abierta,
          invitados: mesa.invitados
        }));
        mesasDerecha.value = mesasData.slice(6).map((mesa: any) => ({
          abierta: mesa.abierta,
          invitados: mesa.invitados
        }));
      } catch (error) {
        console.error('Error al cargar los datos de la API:', error);
        cargarDatosPrueba();
      }
    } else {
      cargarDatosPrueba();
    }
  };
  
  const cargarDatosPrueba = () => {
    mesasIzquierda.value = datosPrueba.slice(0, 6);
    mesasDerecha.value = datosPrueba.slice(6);
  };
  
  const toggleInvitados = (index: number): void => {
    if (mesaSeleccionada.value === index) {
      cerrarVentana();
    } else {
      mesaSeleccionada.value = index;
    }
  };
  
  const cerrarVentana = () => {
    mesaSeleccionada.value = null;
  };
  
  const getInvitados = (index: number): string[] => {
    if (index < 6) {
      return mesasIzquierda.value[index].invitados;
    } else {
      return mesasDerecha.value[index - 6].invitados;
    }
  };
  
  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatos();
  });
</script>
  

<style scoped>
    .salon {
    font-family: 'Playfair Display', serif;
    text-align: center;
    background-color: #f0eae5; /* Color de fondo */
    color: #333; /* Color del texto */
    padding: 20px;
    border: 2px solid #ccc; /* Borde del contenedor */
    border-radius: 10px; /* Borde redondeado */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra */
    width: calc(100% - 10px); /* Ajuste de ancho según lo solicitado */
    height: calc(100vh - 50px); /* Ajuste de alto según lo solicitado */
    display: flex;
    flex-direction: column; /* Cambiado a columna */
    justify-content: center; /* Centrar verticalmente */
    align-items: center; /* Centrar horizontalmente */
    box-sizing: border-box; /* Incluir padding y border en el tamaño total */
    position: relative;
    overflow: hidden; /* Evitar desbordamiento */
    margin: 5px auto; /* Mantener el componente centrado */
    }
    .sector {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1; /* Permite que los sectores se expandan adecuadamente */
    }

    .columnas {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center; /* Alinear las columnas al centro */
    width: 100%;
    }

    .columna {
    display: flex;
    flex-direction: column;
    align-items: center;
    }

    .central {
    justify-content: center;
    }

    .pista-bailar {
    width: 70%;
    height: 150px;
    background-color: #ffcc00;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }

    .mesa {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #e0e0e0;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    }

    .mesa:hover {
    transform: scale(1.1);
    }

    .icono-mesa {
    font-size: 1.2em;
    font-weight: bold;
    }

    .invitados-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .invitados-modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 500px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    animation: slide-down 0.3s ease-in-out;
    }

    .cerrar {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    }

    .fade-enter-active,
    .fade-leave-active {
    transition: opacity 0.5s;
    }
    .fade-enter,
    .fade-leave-to {
    opacity: 0;
    }

    .seleccionado {
    border: 2px solid #ff5722;
    background-color: #ffedcc;
    }

    /* Animación de entrada */
    @keyframes slide-down {
    from {
    transform: translateY(-20px);
    opacity: 0;
    }
    to {
    transform: translateY(0);
    opacity: 1;
    }
    }
</style>
  