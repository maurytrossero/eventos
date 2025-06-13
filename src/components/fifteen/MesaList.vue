<template>
  <div class="mesa-container">
    <div class="mesas-wrapper">
      <h2>Listado de Mesas</h2>

      <div class="buscador">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar invitado..."
        />
      </div>

      <div class="mesas-lista">
        <div
          v-for="(mesa, index) in mesasFiltradas"
          :key="mesa.id"
          class="mesa-card"
        >
          <h3>Mesa {{ mesa.numero }}</h3>

          <ul>
            <li
              v-for="a in mesa.asistentes || []"
              :key="a.id"
              :class="{ resaltado: esBuscado(a) }"
            >
              {{ a.nombre }} {{ a.apellido }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

const asistentes = ref([])
const mesas = ref([])
const busqueda = ref('')

async function cargarAsistentesDesdeFamilias() {
  const snapshot = await getDocs(collection(db, 'familias'))
  const todasLasFamilias = snapshot.docs.map(doc => doc.data())
  let contador = 0
  asistentes.value = todasLasFamilias.flatMap(f =>
    (f.asistentes || []).map(a => ({
      id: `${a.nombre}-${a.apellido}-${contador++}`,
      nombre: a.nombre,
      apellido: a.apellido
    }))
  )
}

async function cargarMesas() {
  const snapshot = await getDocs(collection(db, 'mesas'))
  mesas.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(() => {
  cargarMesas()
  cargarAsistentesDesdeFamilias()
})

const mesasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return mesas.value
  const texto = busqueda.value.toLowerCase()
  return mesas.value.filter(mesa =>
    (mesa.asistentes || []).some(a =>
      `${a.nombre} ${a.apellido}`.toLowerCase().includes(texto)
    )
  )
})

function esBuscado(a) {
  const texto = busqueda.value.toLowerCase()
  return `${a.nombre} ${a.apellido}`.toLowerCase().includes(texto)
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

.buscador {
  display: flex;
  justify-content: center;
}

.buscador input {
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  border: none;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
  min-width: 260px;
  font-size: 1rem;
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

.resaltado {
  font-weight: bold;
  color: #ffcc00;
}
</style>
