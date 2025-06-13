<template>
  <div
    class="container"
    :style="{
      backgroundImage: `url('https://blog.hiltoncolombia.com/hs-fs/hubfs/1%20(66).jpg?width=5568&name=1%20(66).jpg')`
    }"
  >
    <div class="overlay">
      <div class="contenido">
        <p class="mensaje">
          Podés confirmar y realizar el pago hasta el <strong>05/08</strong>
        </p>

        <div class="botones" v-if="!formVisible">
          <button class="boton" @click="formVisible = true">Sí, asistiré</button>
          <button class="boton">No podré asistir</button>
        </div>

        <div v-if="formVisible" class="formulario">
          <div class="campos">
            <input v-model="nombre" type="text" placeholder="Nombre" />
            <input v-model="apellido" type="text" placeholder="Apellido" />
            <input v-model="telefono" type="tel" placeholder="Teléfono (ej: 1123456789)" />
            <button @click="agregarAsistente" class="boton">Agregar</button>
  <button @click="cancelarFormulario" class="boton cancelar">Cancelar</button>

          </div>

          <ul class="lista">
            <li v-for="(a, i) in asistentes" :key="i">{{ a.nombre }} {{ a.apellido }}</li>
          </ul>

          <button @click="confirmarAsistencia" class="boton confirmar">Confirmar asistencia</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const formVisible = ref(false)
const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const asistentes = ref([])

// Genera un código de familia alfanumérico de 6 caracteres en mayúscula
function generarCodigoFamilia() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function agregarAsistente() {
  if (!nombre.value || !apellido.value) {
    alert('Por favor completá nombre y apellido del asistente.')
    return
  }
  asistentes.value.push({ nombre: nombre.value, apellido: apellido.value })
  nombre.value = ''
  apellido.value = ''
}

// Validación básica para teléfono: debe tener al menos 7 dígitos numéricos
function validarTelefono(tel) {
  const soloNumeros = tel.replace(/\D/g, '')
  return soloNumeros.length >= 7
}

function cancelarFormulario() {
  formVisible.value = false
  nombre.value = ''
  apellido.value = ''
  telefono.value = ''
  asistentes.value = []
}


async function confirmarAsistencia() {
  if (asistentes.value.length === 0) {
    alert('Agregá al menos un asistente.')
    return
  }
  if (!validarTelefono(telefono.value)) {
    alert('Por favor ingresá un teléfono válido (al menos 7 dígitos).')
    return
  }

  const codigoFamilia = generarCodigoFamilia()

  try {
    await addDoc(collection(db, 'familias'), {
      codigoFamilia,
      telefono: telefono.value,
      asistentes: asistentes.value,
      confirmacion: true,
      timestamp: new Date()
    })
    alert(
      `¡Asistencia confirmada!\n\nTu código de familia es: ${codigoFamilia}\nGuardalo para futuras consultas.`
    )
    formVisible.value = false
    asistentes.value = []
    telefono.value = ''
  } catch (e) {
    alert('Hubo un error al confirmar: ' + e.message)
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
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.mensaje {
  font-size: 1.125rem;
  font-weight: 300;
  font-style: italic;
  margin: 0;
  font-family: 'Constantia', serif;
}

@media (min-width: 768px) {
  .mensaje {
    font-size: 1.25rem;
  }
}

.botones {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.boton {
  font-family: 'Bahnschrift', sans-serif;
  flex: 1 1 auto;
  min-width: 120px;
  max-width: 180px;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  transition: transform 0.2s ease, background-color 0.3s, color 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.boton:hover {
  background-color: white;
  color: black;
  transform: scale(1.05);
}

@media (max-width: 400px) {
  .botones {
    flex-direction: column;
  }
  .boton {
    max-width: 100%;
    font-size: 1rem;
  }
}

.tarjeta {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  width: 90vw;
  max-width: 11rem;
  aspect-ratio: 11 / 8;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.imagen-tarjeta {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icono-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}
.formulario {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.campos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.campos input {
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  text-align: center;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
  color: white;
}

.confirmar {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
}
.cancelar {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-weight: normal;
}

.cancelar:hover {
  background-color: rgba(255, 255, 255, 0.3);
  color: black;
}

</style>
