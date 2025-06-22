<!-- components/fifteen/InformationSetting.vue -->
<template>
  <div class="config-section">
    <h2 class="text-xl font-bold mb-4">Configuración de Información</h2>

    <!-- Texto invitación -->
    <div class="form-group">
      <label class="block text-sm font-medium mb-1">Texto invitación:</label>
      <textarea
        v-model="config.textoInvitacion"
        rows="3"
        class="input w-full"
        placeholder="El regalo es opcional,\nla asistencia es obligatoria"
      ></textarea>
    </div>

    <!-- Adorno superior -->
    <div class="form-group">
      <label class="block text-sm font-medium mb-1">Adorno superior (URL):</label>
      <input
        type="text"
        v-model="config.adornoSuperior"
        class="input w-full"
        placeholder="https://..."
      />
    </div>

    <!-- Adorno inferior -->
    <div class="form-group">
      <label class="block text-sm font-medium mb-1">Adorno inferior (URL):</label>
      <input
        type="text"
        v-model="config.adornoInferior"
        class="input w-full"
        placeholder="https://..."
      />
    </div>

    <!-- Tarjetas -->
    <div class="form-group">
      <label class="block text-sm font-medium mb-2">Tarjetas:</label>
      <div
        v-for="(tarjeta, index) in config.tarjetas"
        :key="index"
        class="modal-box border rounded p-4 mb-4"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold">Tarjeta {{ index + 1 }}</h3>
          <button class="text-red-500 text-sm" @click="removeTarjeta(index)">
            Eliminar
          </button>
        </div>

        <label class="block text-sm font-medium mb-1">Imagen frontal (URL):</label>
        <input
          v-model="tarjeta.frontImage"
          class="input w-full mb-2"
          type="text"
          placeholder="https://..."
        />

        <label class="block text-sm font-medium mb-1">Texto frontal:</label>
        <input v-model="tarjeta.frontText" class="input w-full mb-2" type="text" />

        <label class="block text-sm font-medium mb-1">Ícono frontal:</label>
        <input
          v-model="tarjeta.frontIcon"
          class="input w-full mb-2"
          type="text"
          placeholder="music, cake, etc."
        />

        <label class="block text-sm font-medium mb-1">Tipo de contenido:</label>
        <select
          v-model="tarjeta.backContent.type"
          class="input w-full mb-2"
          @change="actualizarTarjetaPorTipo(index, tarjeta.backContent.type)"
        >
          <option value="price">Precio</option>
          <option value="location">Ubicación</option>
          <option value="music">Música</option>
        </select>


        <!-- BackContent dinámico -->
        <div v-if="tarjeta.backContent.type === 'price'">
          <div
            v-for="(price, pIndex) in tarjeta.backContent.prices"
            :key="pIndex"
            class="pl-2 mb-2 flex items-center"
          >
            <input
              v-model="price.description"
              class="input mb-1 mr-2 w-1/2"
              placeholder="Descripción"
            />
            <input v-model="price.amount" class="input w-1/2" placeholder="Monto" />
            <button
              class="text-red-500 text-xs ml-2"
              @click="removePrice(index, pIndex)"
              type="button"
            >
              Eliminar
            </button>
          </div>
          <button class="text-blue-600 text-sm" @click="addPrice(index)" type="button">
            + Agregar precio
          </button>
        </div>

        <div v-if="tarjeta.backContent.type === 'location'" class="mt-2">
          <label class="block text-sm font-medium mb-1">Dirección:</label>
          <textarea
            v-model="tarjeta.backContent.address"
            class="input w-full mb-2"
            rows="2"
          ></textarea>
          <label class="block text-sm font-medium mb-1">URL de Google Maps:</label>
          <input v-model="tarjeta.backContent.googleMapsUrl" class="input w-full" />
        </div>

        <!-- No backContent editing needed for 'music' type -->
      </div>

      <button class="text-blue-600 text-sm" @click="addTarjeta" type="button">
        + Agregar tarjeta
      </button>
    </div>
    <!-- Botones guardar/restablecer -->
<div class="buttons mt-4">
  <button @click="guardarCambios">Guardar cambios</button>
  <button @click="restablecerCambios" class="text-blue-600">Restablecer</button>
</div>

  </div>
  
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
type TarjetaTipo = 'price' | 'location' | 'music'

const props = defineProps<{
  modelValue: {
    adornoSuperior: string
    adornoInferior: string
    textoInvitacion: string
    tarjetas: Array<{
      frontImage: string
      frontText: string
      frontIcon: string
      backContent: any
    }>
  }
}>()

const emit = defineEmits(['update:modelValue'])

const config = ref({ ...props.modelValue })

watch(
  config,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

function addTarjeta() {
  const defaultType = 'price'

  const defaultDataByType: Record<string, { frontText: string, frontIcon: string, frontImage: string, backContent: any }> = {
    price: {
      frontText: 'Precio',
      frontIcon: 'cake',
      frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0h0CMgMLU-zuXvv31t2jhUWKhY2HwJCrhA&s',
      backContent: {
        type: 'price',
        prices: []
      }
    },
    location: {
      frontText: 'Lugar',
      frontIcon: 'gift',
      frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUPnVDxHNIJTBlHK9JwfncsixbV8SwKb5Fvg&s',
      backContent: {
        type: 'location',
        address: '',
        googleMapsUrl: ''
      }
    },
    music: {
      frontText: 'Música',
      frontIcon: 'music',
      frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb54uUvljGEDIhS6QTp1I-JrL4PDd6xKOjfQ&s',
      backContent: {
        type: 'music'
      }
    }
  }

  const nuevaTarjeta = {
    frontText: defaultDataByType[defaultType].frontText,
    frontIcon: defaultDataByType[defaultType].frontIcon,
    frontImage: defaultDataByType[defaultType].frontImage,
    backContent: JSON.parse(JSON.stringify(defaultDataByType[defaultType].backContent)) // evitar referencia
  }

  config.value.tarjetas.push(nuevaTarjeta)
}


function removeTarjeta(index: number) {
  config.value.tarjetas.splice(index, 1)
}

function addPrice(tarjetaIndex: number) {
  if (!config.value.tarjetas[tarjetaIndex].backContent.prices) {
    config.value.tarjetas[tarjetaIndex].backContent.prices = []
  }
  config.value.tarjetas[tarjetaIndex].backContent.prices.push({
    description: '',
    amount: ''
  })
}

function removePrice(tarjetaIndex: number, priceIndex: number) {
  config.value.tarjetas[tarjetaIndex].backContent.prices.splice(priceIndex, 1)
}
const original = ref(JSON.parse(JSON.stringify(config.value))) // copia profunda

function guardarCambios() {
  original.value = JSON.parse(JSON.stringify(config.value))
  emit('update:modelValue', config.value)
  alert('Cambios guardados')
}

function restablecerCambios() {
  config.value = JSON.parse(JSON.stringify(original.value))
}

function actualizarTarjetaPorTipo(index: number, tipo: TarjetaTipo) {
  const defaults: Record<TarjetaTipo, {
    frontText: string
    frontIcon: string
    frontImage: string
    backContent: any
  }> = {
    price: {
      frontText: 'Precio',
      frontIcon: 'cake',
      frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0h0CMgMLU-zuXvv31t2jhUWKhY2HwJCrhA&s',
      backContent: {
        type: 'price',
        prices: []
      }
    },
    location: {
      frontText: 'Lugar',
      frontIcon: 'gift',
      frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUPnVDxHNIJTBlHK9JwfncsixbV8SwKb5Fvg&s',
      backContent: {
        type: 'location',
        address: '',
        googleMapsUrl: ''
      }
    },
    music: {
      frontText: 'Música',
      frontIcon: 'music',
      frontImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb54uUvljGEDIhS6QTp1I-JrL4PDd6xKOjfQ&s',
      backContent: {
        type: 'music'
      }
    }
  }

  const tarjeta = config.value.tarjetas[index]
  tarjeta.frontText = defaults[tipo].frontText
  tarjeta.frontIcon = defaults[tipo].frontIcon
  tarjeta.frontImage = defaults[tipo].frontImage
  tarjeta.backContent = JSON.parse(JSON.stringify(defaults[tipo].backContent))
}



</script>

<style scoped>
.config-section {
  background: #fafafa;
  padding: 1rem;
  border-radius: 10px;
  max-width: 700px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden; /* 👈 Evita desborde horizontal */
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-sizing: border-box;
}

label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: block;
  font-size: 0.9rem;
}

.input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-width: 100%; /* 👈 Asegura que nunca se desborde */
}

textarea.input {
  resize: vertical;
  min-height: 60px;
  max-width: 100%;
}

.modal-box {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  box-sizing: border-box;
  overflow-x: hidden; /* 👈 Previene que el contenido interno desborde */
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  background-color: #6a5acd;
  border-radius: 6px;
  cursor: pointer;
  min-width: 120px;
  text-align: center;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
  font-weight: 600;
}

button:hover {
  background-color: #5747c0;
}

button.text-red-500 {
  background: none;
  color: #b22222;
  padding: 0.2rem 0.5rem;
  font-weight: 600;
  border-radius: 4px;
  min-width: auto;
}

button.text-red-500:hover {
  background-color: #fddede;
}

button.text-blue-600 {
  background: none;
  color: #6a5acd;
  padding: 0.3rem 0.6rem;
  font-weight: 600;
  border-radius: 4px;
  min-width: auto;
}

button.text-blue-600:hover {
  background-color: #e0d9fc;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  max-width: 100%;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.pl-2 {
  padding-left: 0.5rem;
}

.w-full {
  width: 100%;
  max-width: 100%;
}

.w-1\/2 {
  width: 50%;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.text-red-500 {
  color: #b22222;
}

.text-blue-600 {
  color: #6a5acd;
}

/* Responsive mobile adjustments */
@media (max-width: 500px) {
  .config-section {
    max-width: 100%;
    width: 95vw;
  }

  .buttons {
    flex-direction: column;
    gap: 0.7rem;
  }

  button {
    min-width: 100%;
  }
}
.config-section {
  background: #fafafa;
  padding: 1rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-sizing: border-box;
}

/* Aplicar estilo general a inputs y textarea */
input,
textarea,
select {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
}

/* Estilos para las tarjetas individuales */
.modal-box {
  background: #ffffff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

/* Botones dentro del form */
button {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #6a5acd;
  color: white;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5747c0;
}

button.text-red-500:hover {
  color: #a30000;
}

button.text-blue-600:hover {
  color: #2c2cb2;
}

/* Responsivo para móviles */
@media (max-width: 500px) {
  .config-section {
    padding: 0.8rem;
    width: 95vw;
  }
}

</style>
