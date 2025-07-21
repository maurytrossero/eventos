<!-- components/fifteen/InvitadosComponent.vue -->
<template>
  <div
    class="container"
    :style="{ backgroundImage: `url('https://blog.hiltoncolombia.com/hs-fs/hubfs/1%20(66).jpg?width=5568&name=1%20(66).jpg')` }"
  >
    <div class="overlay">
      <div class="contenido">
        <h2>Lista de asistentes confirmados</h2>
        <ul class="familias-lista grid-familias">
          <li v-for="(familia, i) in familias" :key="i" class="familia-item">
            <div class="card-header">
              <div class="icono"><i class="fas fa-users"></i></div>
              <div><strong>Familia {{ i + 1 }}</strong></div>
            </div>

            <div class="detalle-linea">
              <i class="fas fa-id-badge"></i>
              <small><strong>Código:</strong> {{ familia.codigoFamilia || 'N/A' }}</small>
            </div>

            <div class="detalle-linea" v-if="familia.telefono">
              <i class="fas fa-phone"></i>
              <small>
                <strong>Teléfono:</strong>
                <template v-if="esTelefonoValido(familia.telefono)">
                  <a
                    :href="`https://wa.me/${formatearTelefonoWA(familia.telefono)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="whatsapp-link"
                  >
                    {{ familia.telefono }}
                  </a>
                </template>
                <template v-else>
                  {{ familia.telefono }}
                </template>
              </small>
            </div>

            <div class="titulo-asistentes">
              <i class="fas fa-user-friends"></i> Asistentes
            </div>
            <ul class="asistentes-lista">
              <li v-for="(a, j) in familia.asistentes" :key="j">
                <i class="fas fa-user"></i> {{ a.nombre }} {{ a.apellido }}
              </li>
            </ul>

            <div class="botones-acciones">
              <button @click="editarFamilia(familia)" class="btn-editar">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button @click="eliminarFamilia(i)" class="btn-eliminar">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <EditfamilyModal
      v-if="mostrarModal"
      :familia="familiaSeleccionada"
      @cerrar="mostrarModal = false"
      @guardado="cargarFamilias"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  CollectionReference,
} from 'firebase/firestore';
import { useRoute } from 'vue-router';

import EditfamilyModal from './EditfamilyModal.vue';

// Definición tipos
interface Asistente {
  nombre: string;
  apellido: string;
  [key: string]: any;
}

interface Familia {
  id: string;
  nombre?: string;
  telefono?: string;
  codigoFamilia?: string;
  asistentes?: Asistente[];  // Ahora es arreglo de asistentes
  [key: string]: any;
}

// Router
const route = useRoute();
const eventoId = route.params.eventoId as string;

// Refs
const familias = ref<Familia[]>([]);
const mostrarModal = ref(false);
const familiaSeleccionada = ref<Familia | null>(null);

// Cargar familias del evento específico
onMounted(async () => {
  await cargarFamilias();
});

async function cargarFamilias() {
  try {
    const familiasRef = collection(db, 'eventos', eventoId, 'familias') as CollectionReference;
    const querySnapshot = await getDocs(familiasRef);
    familias.value = querySnapshot.docs.map((doc): Familia => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error al cargar familias:', error);
  }
}

async function eliminarFamilia(index: number) {
  const familia = familias.value[index];
  const confirmado = window.confirm(`¿Estás seguro de eliminar la Familia ${index + 1}?`);
  if (confirmado) {
    try {
      await deleteDoc(doc(db, 'eventos', eventoId, 'familias', familia.id));
      familias.value.splice(index, 1);
    } catch (error) {
      console.error('Error al eliminar familia:', error);
      alert('Hubo un error al intentar eliminar la familia.');
    }
  }
}

function editarFamilia(familia: Familia) {
  familiaSeleccionada.value = { ...familia };
  mostrarModal.value = true;
}

function esTelefonoValido(tel: string): boolean {
  const limpio = tel.replace(/\D/g, '');
  return limpio.length === 10 && !limpio.startsWith('0') && !limpio.startsWith('15');
}

function formatearTelefonoWA(tel: string): string {
  let limpio = tel.replace(/\D/g, '');
  if (limpio.startsWith('0')) limpio = limpio.substring(1);
  if (limpio.startsWith('15')) limpio = limpio.substring(2);
  return '54' + limpio;
}
</script>


<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

@font-face {
  font-family: "Bahnschrift";
  src: url("@/assets/fonts/Bahnschrift.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow-x: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
  text-align: center;
  color: white;
  backdrop-filter: blur(4px);
}

.contenido {
  max-width: 500px;
  width: 100%;
  background: rgba(255 255 255 / 0.1);
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
  font-family: "Bahnschrift", sans-serif;
}

h2 {
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-family: "Bahnschrift", sans-serif;
}

/* Aplicar fuente Bahnschrift a todo */
* {
  font-family: "Bahnschrift", sans-serif;
}

/* Mejora visual de tarjetas */
.familia-item {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

/* Encabezado "Familia n" */
.card-header {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

/* Línea de detalle */
.detalle-linea {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  color: #ddd;
}

/* Lista de asistentes */
.asistentes-lista li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #eee;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

/* Encabezado asistentes */
.titulo-asistentes {
  font-size: 1.05rem;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: #fff;
}

/* Botones */
.botones-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btn-editar,
.btn-eliminar {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.btn-editar {
  background-color: #4fc3f7;
  color: white;
}
.btn-editar:hover {
  background-color: #039be5;
}

.btn-eliminar {
  background-color: #ef5350;
  color: white;
}
.btn-eliminar:hover {
  background-color: #d32f2f;
}


@media (min-width: 768px) {
  .grid-familias {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 400px) {
  .contenido {
    padding: 1rem 1.5rem;
  }
  h2 {
    font-size: 1.4rem;
  }
  .familia-item {
    padding: 0.75rem 1rem;
  }
  .card-header,
  .detalle-linea,
  .asistentes-lista li {
    font-size: 0.9rem;
  }
  .btn-eliminar {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
