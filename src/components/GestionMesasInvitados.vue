<template>
    <div class="gestion" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="overlay">
        <h2>Gestión de Mesas e Invitados</h2>
  
        <!-- Formulario para agregar una mesa -->
        <div class="formulario">
          <h3>Agregar Mesa</h3>
          <input
            v-model="nuevaMesa"
            placeholder="Número de Mesa"
            class="input"
          />
          <div class="botones">
            <button @click="agregarMesa" class="btn agregar">Agregar Mesa</button>
          </div>
          <p v-if="mesaExistente" class="alert">El número de mesa ya existe.</p>
        </div>
  
        <button @click="mostrarMesas = !mostrarMesas" class="btn toggle">
          {{ mostrarMesas ? 'Ocultar' : 'Mostrar' }} Mesas
        </button>
  
        <div v-if="mostrarMesas">
          <h4>Mesas</h4>
          <ul class="lista">
            <li
              v-for="mesa in mesas.sort((a, b) => a.num_mesa - b.num_mesa)"
              :key="mesa.id"
              class="item"
            >
              Mesa {{ mesa.num_mesa }}
              <div class="botones">
                <button @click="eliminarMesa(mesa.id)" class="btn eliminar">Eliminar</button>
                <button @click="editarMesa(mesa.id)" class="btn editar">Editar</button>
              </div>
            </li>
          </ul>
        </div>
  
        <!-- Formulario para agregar un invitado -->
        <div class="formulario">
            <h3>Agregar Invitado</h3>
            <input
                v-model="nuevoInvitado.nombre"
                placeholder="Nombre del Invitado"
                class="input"
                required
            />
            <select v-model="nuevoInvitado.mesa" class="select" required>
                <option value="" disabled>Seleccionar Mesa</option>
                <option v-for="mesa in mesas" :key="mesa.id" :value="mesa.num_mesa">
                    Mesa {{ mesa.num_mesa }}
                </option>
            </select>
            <div class="botones">
                <button @click="crearNuevoInvitado" class="btn agregar">Agregar Invitado</button>
            </div>
        </div>

  
        <button @click="mostrarInvitados = !mostrarInvitados" class="btn toggle">
          {{ mostrarInvitados ? 'Ocultar' : 'Mostrar' }} Invitados
        </button>
  
        <div v-if="mostrarInvitados">
          <h4>Invitados</h4>
          <ul class="lista">
            <li
              v-for="invitado in invitados.sort((a, b) => a.nombre.localeCompare(b.nombre))"
              :key="invitado.id_invitado"
              class="item"
            >
              {{ invitado.nombre }} en Mesa {{ invitado.mesa }}
              <div class="botones">
                <button @click="eliminarInvitado(invitado.id_invitado)" class="btn eliminar">Eliminar</button>
                <button @click="editarInvitado(invitado.id_invitado)" class="btn editar">Editar</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
  
  <script>
  import { db } from "../firebase"; // Asegúrate de importar la configuración de Firebase
  import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, where, query } from "firebase/firestore";
  
  export default {
    data() {
      return {
        mesas: [],
        invitados: [],
        nuevaMesa: '',
        nuevoInvitado: {
          nombre: '',
          mesa: '',
        },
        mesaExistente: false,
        mostrarMesas: false, // Control para mostrar/ocultar mesas
        mostrarInvitados: false, // Control para mostrar/ocultar invitados
        backgroundImage: "", // Cambia esta URL por la de tu imagen
      };
    },
    methods: {
      async obtenerMesas() {
        const snapshot = await getDocs(collection(db, "mesas"));
        this.mesas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      },
      async obtenerInvitados() {
        const snapshot = await getDocs(collection(db, "invitados"));
        this.invitados = snapshot.docs.map(doc => ({ id_invitado: doc.id, ...doc.data() }));
      },
      async agregarMesa() {
        this.mesaExistente = this.mesas.some(mesa => mesa.num_mesa === this.nuevaMesa);
        if (!this.mesaExistente && this.nuevaMesa) {
          const mesaData = { num_mesa: this.nuevaMesa };
          const docRef = await addDoc(collection(db, "mesas"), mesaData);
          this.mesas.push({ id: docRef.id, ...mesaData });
          this.nuevaMesa = '';
        }
      },
      async eliminarMesa(mesaId) {
        // Verificar si hay invitados en la mesa
        const invitadosEnMesa = this.invitados.filter(inv => inv.mesa === this.mesas.find(m => m.id === mesaId).num_mesa);
        
        if (invitadosEnMesa.length > 0) {
        const confirmacion = confirm("Esta mesa tiene invitados. ¿Estás seguro de que deseas eliminarla y borrar los invitados asociados?");
        
        if (confirmacion) {
            // Eliminar los invitados de Firestore
            for (const invitado of invitadosEnMesa) {
            await deleteDoc(doc(db, "invitados", invitado.id_invitado));
            }
        } else {
            return; // Si no se acepta, salir del método
        }
        }

        // Ahora eliminar la mesa
        await deleteDoc(doc(db, "mesas", mesaId));
        this.mesas = this.mesas.filter(mesa => mesa.id !== mesaId);
    },
      async editarMesa(mesaId) {
        const nuevaNumMesa = prompt("Nuevo número de mesa:");
        if (nuevaNumMesa) {
          const mesaRef = doc(db, "mesas", mesaId);
          await updateDoc(mesaRef, { num_mesa: nuevaNumMesa });
          const mesa = this.mesas.find(m => m.id === mesaId);
          mesa.num_mesa = nuevaNumMesa;
        }
      },
        async verificarExistenciaInvitado(nombre, mesa) {
            const invitadosRef = collection(db, "invitados");
            const q = query(invitadosRef, where("nombre", "==", nombre));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty; // Devuelve true si el invitado ya existe en cualquier mesa
        },
        async crearNuevoInvitado() {
            const { nombre, mesa } = this.nuevoInvitado;

            // Verificar si el campo nombre está vacío o si la mesa no está seleccionada
            if (!nombre || !mesa) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            // Verificar si el invitado ya existe en la lista local o en Firestore
            const existeLocal = this.invitados.some(inv => inv.nombre === nombre);
            const existeFirestore = await this.verificarExistenciaInvitado(nombre);

            if (existeLocal || existeFirestore) {
                alert("Este invitado ya existe en otra mesa.");
                return; // Salir del método si existe el invitado
            }

            // Agregar el nuevo invitado si no existe
            await addDoc(collection(db, "invitados"), {
                nombre,
                mesa,
            });

            // Limpiar el formulario
            this.nuevoInvitado.nombre = "";
            this.nuevoInvitado.mesa = "";

            // Actualizar la lista de invitados
            await this.obtenerInvitados();
        },
        async eliminarInvitado(invitadoId) {
            await deleteDoc(doc(db, "invitados", invitadoId));
            this.invitados = this.invitados.filter(inv => inv.id_invitado !== invitadoId);
        },
        async editarInvitado(invitadoId) {
            const nuevoNombre = prompt("Nuevo nombre del invitado:");
            const nuevaMesa = prompt("Nueva mesa:");
            if (nuevoNombre) {
            const invitadoRef = doc(db, "invitados", invitadoId);
            await updateDoc(invitadoRef, { nombre: nuevoNombre, mesa: nuevaMesa });
            const invitado = this.invitados.find(inv => inv.id_invitado === invitadoId);
            invitado.nombre = nuevoNombre;
            invitado.mesa = nuevaMesa;
            }
        },
    },
    async mounted() {
      await this.obtenerMesas();
      await this.obtenerInvitados();
    },
  };
  </script>
  
<style scoped>
  .gestion {
    padding: 20px;
    background-color: rgba(249, 249, 249, 0.8); /* Color de fondo con opacidad */
    border-radius: 8px;
    max-width: 600px;
    margin: auto;
    font-family: 'Arial', sans-serif;
    position: relative;
    background-size: cover; /* Asegura que la imagen cubra el contenedor */
    background-position: center; /* Centra la imagen */
  }
  
  .overlay {
    background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco con opacidad para los contenidos */
    padding: 20px;
    border-radius: 8px;
  }
  
  h2, h3, h4 {
    color: #333;
    text-align: center;
  }
  
  .formulario {
    margin-bottom: 20px;
  }
  
  .input,
  .select {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border 0.3s;
  }
  
  .input:focus,
  .select:focus {
    border-color: #66afe9;
    outline: none;
  }
  
  .botones {
    display: flex;
    justify-content: flex-end; /* Alinear botones a la derecha */
  }
  
  .btn {
    padding: 10px 15px;
    color: white;
    border: none;
    border-radius: 4px;
    margin-left: 10px;
    cursor: pointer;
  }
  
  .agregar {
    background-color: #28a745; /* Verde */
  }
  
  .eliminar {
    background-color: #dc3545; /* Rojo */
  }
  
  .editar {
    background-color: #007bff; /* Azul */
  }
  
  .toggle {
    background-color: #007bff; /* Azul */
    width: 100%; /* Botón ocupa todo el ancho */
  }
  
  .lista {
    list-style-type: none;
    padding: 0;
  }
  
  .item {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between; /* Espacio entre el texto y los botones */
  }
</style>
  