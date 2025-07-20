<!-- components/fifteen/InformationSetting.vue -->
<template>
  <section class="carousel-settings">
    <h2 class="titulo">📝 Configuración de Información</h2>

    <!-- Texto invitación -->
    <div class="form-group">
      <label>Texto invitación:</label>
      <textarea
        v-model="config.textoInvitacion"
        rows="3"
        placeholder="El regalo es opcional,\nla asistencia es obligatoria"
      ></textarea>
    </div>

    <!-- Adorno superior -->
    <div class="form-group">
      <label>Adorno superior:</label>
      <div class="custom-file-input">
        <label for="adornoSuperiorUpload">📁 Seleccionar imagen</label>
        <input
          id="adornoSuperiorUpload"
          type="file"
          accept="image/*"
          @change="handleImageUpload($event, 'adornoSuperior')"
        />
      </div>
      <div v-if="config.adornoSuperior" class="preview-box">
        <img :src="config.adornoSuperior" alt="Adorno superior" width="120" />
      </div>
      <input
        v-model="config.adornoSuperior"
        type="text"
        readonly
        placeholder="URL subida..."
        style="margin-top: 0.5rem;"
      />
    </div>

    <!-- Adorno inferior -->
    <div class="form-group">
      <label>Adorno inferior:</label>
      <div class="custom-file-input">
        <label for="adornoInferiorUpload">📁 Seleccionar imagen</label>
        <input
          id="adornoInferiorUpload"
          type="file"
          accept="image/*"
          @change="handleImageUpload($event, 'adornoInferior')"
        />
      </div>
      <div v-if="config.adornoInferior" class="preview-box">
        <img :src="config.adornoInferior" alt="Adorno inferior" width="120" />
      </div>
      <input
        v-model="config.adornoInferior"
        type="text"
        readonly
        placeholder="URL subida..."
        style="margin-top: 0.5rem;"
      />
    </div>

    <!-- Tarjetas -->
    <div class="form-group">
      <label>Tarjetas:</label>
      <div
        v-for="(tarjeta, index) in config.tarjetas"
        :key="index"
        class="card-box"
      >
        <div class="card-header">
          <h3 class="font-semibold">Tarjeta {{ index + 1 }}</h3>
          <div>
            <button class="toggle-btn" @click="toggleCard(index)">
              {{ collapsedCards[index] ? '➕' : '➖' }}
            </button>
            <button class="btn-danger text-sm" @click="removeTarjeta(index)">Eliminar</button>
          </div>
        </div>

        <div v-if="!collapsedCards[index]">
          <label>Imagen frontal:</label>
          <div class="custom-file-input mb-2">
            <label :for="'tarjetaFrontImageUpload' + index">📁 Seleccionar imagen</label>
            <input
              :id="'tarjetaFrontImageUpload' + index"
              type="file"
              accept="image/*"
              @change="handleTarjetaImageUpload($event, index)"
            />
          </div>
          <input
            v-model="tarjeta.frontImage"
            type="text"
            readonly
            placeholder="URL subida automáticamente"
            class="mb-2"
          />

          <label>Texto frontal:</label>
          <input v-model="tarjeta.frontText" type="text" class="mb-2" />

          <label>Icono frontal:</label>
          <input
            v-model="tarjeta.frontIcon"
            type="text"
            placeholder="music, cake, etc."
            class="mb-2"
          />

          <label>Tipo de contenido:</label>
          <select
            v-model="tarjeta.backContent.type"
            class="mb-2"
            @change="actualizarTarjetaPorTipo(index, tarjeta.backContent.type)"
          >
            <option value="price">Precio</option>
            <option value="location">Ubicación</option>
            <option value="music">Música</option>
          </select>

          <!-- BackContent -->
          <div v-if="tarjeta.backContent.type === 'price'">
            <div
              v-for="(price, pIndex) in tarjeta.backContent.prices"
              :key="pIndex"
              class="pl-2 mb-2 flex items-center"
              style="gap: 0.5rem;"
            >
              <input
                v-model="price.description"
                placeholder="Descripción"
                style="flex: 1;"
              />
              <input
                v-model="price.amount"
                placeholder="Monto"
                style="flex: 1;"
              />
              <button
                class="btn-danger text-xs"
                @click="removePrice(index, pIndex)"
                style="padding: 0.25rem 0.5rem;"
              >
                Eliminar
              </button>
            </div>
            <button class="btn-link text-sm" @click="addPrice(index)">+ Agregar precio</button>
          </div>

          <div v-if="tarjeta.backContent.type === 'location'" class="mt-2">
            <label>Dirección:</label>
            <textarea v-model="tarjeta.backContent.address" rows="2"></textarea>
            <label>URL de Google Maps:</label>
            <input v-model="tarjeta.backContent.googleMapsUrl" type="text" />
          </div>
        </div>
      </div>

      <button class="btn-link text-sm" @click="addTarjeta">+ Agregar tarjeta</button>
    </div>

    <!-- Botones guardar/restablecer -->
    <div class="buttons mt-4">
      <button @click="guardarCambios">💾 Guardar </button>
      <button class="danger" @click="restablecerCambios">♻️ Reestablecer</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
type TarjetaTipo = 'price' | 'location' | 'music'
import { uploadImageToCloudinary } from '@/services/invitacionService'

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

const collapsedCards = ref<boolean[]>(config.value.tarjetas.map(() => false))

watch(
  () => config.value.tarjetas.length,
  () => {
    collapsedCards.value = config.value.tarjetas.map(() => false)
  },
  { immediate: true }
)

function toggleCard(index: number) {
  collapsedCards.value[index] = !collapsedCards.value[index]
}

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

async function handleImageUpload(event: Event, field: 'adornoSuperior' | 'adornoInferior') {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  try {
    const imageUrl = await uploadImageToCloudinary(file)
    config.value[field] = imageUrl
  } catch (err) {
    alert('Error subiendo la imagen: ' + (err as Error).message)
  }
}

async function handleTarjetaImageUpload(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  try {
    const imageUrl = await uploadImageToCloudinary(file)
    config.value.tarjetas[index].frontImage = imageUrl
  } catch (err) {
    alert('Error subiendo imagen de tarjeta: ' + (err as Error).message)
  }
}
</script>

<style scoped>
.carousel-settings {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.titulo {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

textarea,
input[type="text"],
input[type="datetime-local"] {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background: white;
  color: #333;
  resize: vertical;
  box-sizing: border-box;
}

.custom-file-input {
  position: relative;
  display: inline-block;
}

.custom-file-input input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.custom-file-input label {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #e0e0e0;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.custom-file-input label:hover {
  background-color: #d0d0d0;
}

.preview-box {
  margin-top: 0.5rem;
  text-align: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  color: white;
  background-color: #4a90e2;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: 'Poppins', sans-serif;
  min-width: 130px;
}

button:hover {
  background-color: #357ac4;
}

button.danger {
  background-color: #b22222;
}

button.danger:hover {
  background-color: #8b1a1a;
}

.btn-danger {
  background: none;
  color: #b22222;
  font-weight: 600;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background-color: #fddede;
}

.btn-link {
  background: none;
  color: #4a90e2;
  font-weight: 600;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-link:hover {
  background-color: #d7e4fc;
}

.card-box {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  margin-right: 0.5rem;
  color: #4a90e2;
  font-weight: 700;
}

.toggle-btn:hover {
  color: #357ac4;
}

@media (max-width: 500px) {
  .buttons {
    flex-direction: column;
    gap: 0.8rem;
  }

  button {
    width: 100%;
  }
}
</style>
