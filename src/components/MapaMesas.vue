<template>
    <div class="centro-pantalla">
      <div class="mapa-mesas">
        <h1>Mapa de Mesas</h1>
  
        <!-- Buscador de invitados -->
        <div class="buscador">
          <input v-model="nombreInvitado" placeholder="Buscar invitado..." />
          <button @click="buscarInvitado">Buscar</button>
        </div>
  
        <!-- Mapa de mesas -->
        <div class="mesas-grid">
          <div
            v-for="mesa in mesas"
            :key="mesa.id"
            class="mesa"
            @click="mostrarInvitados(mesa.id)"
          >
            <div class="icono-mesa">
              <i class="fas fa-utensils"></i>
              <span class="numero-mesa">{{ mesa.num_mesa }}</span>
            </div>
          </div>
        </div>
  
        <!-- Modal de invitados -->
        <ModalInvitados :invitados="invitadosMesa" v-if="mostrarModal" @close="mostrarModal = false" />
      </div>
    </div>
</template>
  
<script>
import ModalInvitados from './ModalInvitados.vue';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  components: {
    ModalInvitados,
  },
  data() {
    const nombres = [
      'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'José', 'Lucía', 'Miguel', 'Sofía',
      'Luis', 'Marta', 'Jorge', 'Elena', 'Fernando', 'Isabel', 'Manuel', 'Cristina', 'Diego', 'Raquel'
    ];

    const apellidos = [
      'González', 'Rodríguez', 'López', 'Martínez', 'Pérez', 'Gómez', 'Sánchez', 'Ramírez', 'Torres', 'Vázquez',
      'Castro', 'Suárez', 'Morales', 'Domínguez', 'Hernández', 'Medina', 'Ortiz', 'Ríos', 'Silva', 'Núñez'
    ];

    function generarNombreAleatorio() {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
      return `${nombre} ${apellido}`;
    }

    return {
      mesas: [],
      invitadosMesa: [],
      mostrarModal: false,
      mesaSeleccionada: null,
      nombreInvitado: '',
      invitados: Array.from({ length: 200 }, (_, index) => ({
        id_invitado: `inv${index + 1}`,
        nombre: generarNombreAleatorio(),
      })),
    };
  },
  methods: {
    async obtenerMesasYInvitados() {
      const mesasCollection = collection(db, 'mesas');
      const invitadosCollection = collection(db, 'invitados');

      try {
        const mesasSnapshot = await getDocs(mesasCollection);
        const invitadosSnapshot = await getDocs(invitadosCollection);

        if (!mesasSnapshot.empty && !invitadosSnapshot.empty) {
          // Cargar mesas desde Firebase y ordenarlas por número de mesa
          this.mesas = mesasSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.num_mesa - b.num_mesa);

          // Cargar invitados desde Firebase
          this.invitados = invitadosSnapshot.docs.map(doc => ({
            id_invitado: doc.id,
            ...doc.data(),
          }));

          console.log("Mesas:", this.mesas); // Mensaje para verificar mesas
          console.log("Invitados:", this.invitados); // Mensaje para verificar invitados

          // Asignar invitados a cada mesa de acuerdo a `lista_invitados`
          this.mesas.forEach(mesa => {
            mesa.invitados = this.invitados.filter(inv =>
              mesa.lista_invitados && mesa.lista_invitados.includes(inv.id_invitado)
            );
          });

          // Verificar qué invitados tiene cada mesa
          this.mesas.forEach(mesa => {
            console.log(`Mesa ${mesa.num_mesa} tiene invitados:`, mesa.invitados);
          });
        } else {
          console.warn("No se encontraron mesas o invitados en Firebase. Generando datos de prueba.");
          this.generarDatosDePrueba();
        }
      } catch (error) {
        console.error("Error al obtener datos de Firebase:", error);
        this.generarDatosDePrueba();
      }
    },

    generarDatosDePrueba() {
      const cantidadMesas = Math.ceil(this.invitados.length / 12);
      this.mesas = Array.from({ length: cantidadMesas }, (_, index) => {
        const inicio = index * 12;
        const lista_invitados = this.invitados.slice(inicio, inicio + 12).map(inv => inv.id_invitado);
        return {
          id: `mesa${index + 1}`,
          num_mesa: index + 1,
          lista_invitados,
          invitados: this.invitados.slice(inicio, inicio + 12),
        };
      });
    },

    mostrarInvitados(idMesa) {
      const mesa = this.mesas.find(m => m.id === idMesa);
      if (mesa && mesa.invitados) {
        this.invitadosMesa = mesa.invitados;
        this.mesaSeleccionada = mesa; // Asigna la mesa seleccionada
        this.mostrarModal = true;
        console.log(`Invitados de la Mesa ${mesa.num_mesa}:`, this.invitadosMesa);
      } else {
        alert("No se encontraron invitados para esta mesa o la mesa no existe.");
      }
    },

    buscarInvitado() {
      const invitadoBuscado = this.invitados.find(inv => inv.nombre.toLowerCase().includes(this.nombreInvitado.toLowerCase()));
      if (invitadoBuscado) {
        const mesaAsignada = this.mesas.find(mesa => mesa.lista_invitados.includes(invitadoBuscado.id_invitado));
        alert(`El invitado ${invitadoBuscado.nombre} está en la mesa ${mesaAsignada.num_mesa}.`);
      } else {
        alert("No se encontró el invitado o no está asignado a ninguna mesa.");
      }
    },
  },
  mounted() {
    this.obtenerMesasYInvitados();
  },
};
</script>


  
  
<style scoped>
  /* Aseguramos que el contenedor esté centrado */
  body, html {
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .centro-pantalla {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh; /* Toda la altura de la pantalla */
  }
  
  .mapa-mesas {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    max-width: 800px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 2rem;
    color: #3c3c3c;
    margin-bottom: 20px;
  }
  
  .buscador {
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
  }
  
  .buscador input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 250px;
  }
  
  .buscador button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .buscador button:hover {
    background-color: #0056b3;
  }
  
  .mesas-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    width: 100%;
    justify-items: center;
  }
  
  .mesa {
    background-color: #ffebcd;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .mesa:hover {
    background-color: #ffe4b5;
    transform: scale(1.05);
  }
  
  .icono-mesa {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .numero-mesa {
    margin-top: 5px;
    font-size: 1rem;
    color: #3c3c3c;
  }
  
  .mesa i {
    font-size: 1.5rem;
    color: #3c3c3c;
  }
  
  /* Vista móvil: ajustar a 2 columnas */
  @media (max-width: 600px) {
    .mesas-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
  