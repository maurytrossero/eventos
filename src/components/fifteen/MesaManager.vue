<!-- components/fifteen/MesaManager.vue -->
<template>
  <div class="mesa-container">
    <div class="mesas-wrapper">
      <h2>Gestión de Mesas</h2>

      <div class="crear-mesa">
        <input v-model="nuevoNumeroMesa" type="number" placeholder="Número de mesa" />
        <button @click="crearMesa">Crear Mesa</button>
      </div>

      <div class="mesas-lista">
        <div v-for="(mesa, index) in mesas" :key="mesa.id" class="mesa-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">Mesa {{ mesa.numero }}</h3>
            <button @click="eliminarMesa(mesa.id)" style="background-color: crimson; border-color: white;">🗑️</button>
          </div>

          <ul>
<li v-for="a in mesa.asistentes || []" :key="a.id">
              {{ a.nombre }} {{ a.apellido }}
              <button @click="quitarAsistenteDeMesa(index, a)">❌</button>
            </li>
          </ul>

          <select
            v-model="asistenteSeleccionado[index]"
            :disabled="asistentesDisponibles.length === 0"
          >
            <option disabled value="">
              {{ asistentesDisponibles.length === 0 ? 'Todos los asistentes ya tienen mesa' : 'Agregar asistente...' }}
            </option>
            <option
              v-for="asistente in asistentesDisponibles"
              :key="asistente.id"
              :value="asistente"
            >
              {{ asistente.nombre }} {{ asistente.apellido }}
            </option>
          </select>

          <button @click="asignarAsistente(index)">Agregar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from 'vue';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

interface Asistente {
  id: string;
  nombre: string;
  apellido: string;
}

interface Mesa {
  id: string;
  numero: number;
  asistentes: Asistente[];
}

const props = defineProps({
  eventoId: {
    type: String,
    required: true
  }
});

// Tipamos los refs con las interfaces definidas
const asistentes = ref<Asistente[]>([]);
const mesas = ref<Mesa[]>([]);
const nuevoNumeroMesa = ref('');
// Tipamos asistenteSeleccionado como un objeto con claves numéricas y valores Asistente o undefined
const asistenteSeleccionado = ref<Record<number, Asistente | undefined>>({});

onMounted(() => {
  cargarMesas();
  cargarAsistentesDesdeFamilias();
});

async function cargarAsistentesDesdeFamilias() {
  const familiasSnapshot = await getDocs(collection(db, 'eventos', props.eventoId, 'familias'));
  const todasLasFamilias = familiasSnapshot.docs.map(doc => doc.data());
  let contador = 0;
  asistentes.value = todasLasFamilias.flatMap(f =>
    (f.asistentes || []).map((a: any) => ({
      id: `${a.nombre}-${a.apellido}-${contador++}`, // ID temporal único
      nombre: a.nombre,
      apellido: a.apellido,
    }))
  );
}

async function cargarMesas() {
  const mesasSnapshot = await getDocs(collection(db, 'eventos', props.eventoId, 'mesas'));
  mesas.value = mesasSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      numero: data.numero,
      asistentes: data.asistentes || [],
    } as Mesa;
  });
}

async function crearMesa() {
  const numero = parseInt(nuevoNumeroMesa.value);
  if (!numero || isNaN(numero)) {
    alert('Número inválido');
    return;
  }

  const yaExiste = mesas.value.some(m => m.numero === numero);
  if (yaExiste) {
    alert('Ese número de mesa ya existe.');
    return;
  }

  try {
    await addDoc(collection(db, 'eventos', props.eventoId, 'mesas'), {
      numero,
      asistentes: [],
    });
    nuevoNumeroMesa.value = '';
    await cargarMesas();
  } catch (err) {
    console.error('Error al crear mesa:', err);
    alert('No se pudo crear la mesa.');
  }
}

async function eliminarMesa(id: string) {
  if (!confirm('¿Estás seguro de eliminar esta mesa?')) return;

  try {
    await deleteDoc(doc(db, 'eventos', props.eventoId, 'mesas', id));
    await cargarMesas();
  } catch (err) {
    console.error('Error al eliminar mesa:', err);
  }
}

const asistentesDisponibles = computed(() => {
  const usados = mesas.value.flatMap(m => (m.asistentes || []).map(a => a.id));
  return asistentes.value.filter(a => !usados.includes(a.id));
});

async function asignarAsistente(index: number) {
  const mesa = mesas.value[index];
  const asistente = asistenteSeleccionado.value[index];
  if (!asistente) return;
  if (mesa.asistentes.find(a => a.id === asistente.id)) return;

  mesa.asistentes.push(asistente);
  asistenteSeleccionado.value[index] = undefined;
  await guardarMesa(mesa);
}

async function quitarAsistenteDeMesa(index: number, asistente: Asistente) {
  const mesa = mesas.value[index];
  mesa.asistentes = mesa.asistentes.filter(a => a.id !== asistente.id);
  await guardarMesa(mesa);
}

async function guardarMesa(mesa: Mesa) {
  try {
    const mesaRef = doc(db, 'eventos', props.eventoId, 'mesas', mesa.id);
    await updateDoc(mesaRef, {
      asistentes: mesa.asistentes,
    });
  } catch (err) {
    console.error('Error al actualizar mesa:', err);
  }
}
</script>





<style scoped>
@font-face {
  font-family: 'Bahnschrift';
  src: url('@/assets/fonts/Bahnschrift.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.mesa-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-image: url('https://blog.hiltoncolombia.com/hs-fs/hubfs/1%20(66).jpg?width=5568&name=1%20(66).jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
  font-family: 'Bahnschrift', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.mesa-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 0;
}

.mesa-container > * {
  position: relative;
  z-index: 1;
}

.mesas-wrapper {
  max-width: 1000px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: white;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
}

.crear-mesa {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

input {
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  border: none;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
  min-width: 160px;
}

button {
  font-family: 'Bahnschrift', sans-serif;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.95rem;
  transition: 0.3s ease all;
  cursor: pointer;
  white-space: nowrap;
}

button:hover {
  background-color: white;
  color: black;
  transform: scale(1.05);
}

.mesas-lista {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.mesa-card {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mesa-card h3 {
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
}

.mesa-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
}

.mesa-card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.mesa-card select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  font-family: 'Bahnschrift', sans-serif;
  text-align: center;
  font-size: 0.9rem;
}

</style>
