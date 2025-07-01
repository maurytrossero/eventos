<template>
  <div class="results-container" :class="{ mobile: isMobile }">
    <h1>Ranking de la Trivia</h1>

    <div v-if="filteredResults.length > 0" class="results-list">
      <div
        v-for="(result, index) in filteredResults"
        :key="result.id"
        class="result-item"
        :class="getPodiumClass(index)"
      >
        <div class="result-position">#{{ index + 1 }}</div>
        <div class="result-name">{{ result.playerName }}</div>
        <div class="result-score">{{ result.correctAnswers }} correctas</div>
        <div class="result-average">Promedio: {{ result.average.toFixed(2) }}</div>
      </div>
    </div>

    <div v-else>
      <p>No hay resultados aún.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const props = defineProps({
  eventoId: { type: String, required: true }
})

const results = ref([])
const isMobile = window.innerWidth <= 768

const filteredResults = computed(() => {
  return [...results.value].sort((a, b) => b.correctAnswers - a.correctAnswers)
})


function getPodiumClass(index) {
  if (index === 0) return 'podium-first'
  if (index === 1) return 'podium-second'
  if (index === 2) return 'podium-third'
  return ''
}

function fetchResultsRealtime() {
  const resultsRef = collection(db, 'eventos', props.eventoId, 'triviaResults')

  onSnapshot(resultsRef, (snapshot) => {
    results.value = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        playerName: data.playerName || 'Anónimo',
        correctAnswers: data.correctAnswers || 0,
        average: parseFloat(data.averageScore) || 0
      }
    })
  }, (error) => {
    console.error('Error al escuchar cambios en resultados:', error)
  })
}

onMounted(fetchResultsRealtime)

</script>

<style scoped>
.results-container {
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  font-family: 'Baloo', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.results-list {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}
.result-item {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center;
  animation: slideIn 0.5s ease-out;
  gap: 10px;
}
.result-position {
  font-size: 20px;
  font-weight: bold;
  min-width: 40px;
}
.result-name,
.result-score,
.result-average {
  flex: 1;
}

.podium-first {
  background-color: gold;
  color: black;
}
.podium-second {
  background-color: silver;
  color: black;
}
.podium-third {
  background-color: #cd7f32;
  color: black;
}
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
