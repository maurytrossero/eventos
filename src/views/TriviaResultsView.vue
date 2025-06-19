<template>
  <div class="results-container" :class="{ 'mobile': isMobile }">
    <h1>Resultados de la Trivia</h1>
    <div v-if="results.length > 0" class="results-list">
      <div v-for="(result, index) in sortedResults" :key="result.id" class="result-item" :class="getPodiumClass(index)">
        <div class="result-position">{{ index + 1 }}</div>
        <div class="result-name">{{ result.playerName }}</div>
        <div class="result-score">{{ result.correctAnswers }} Correctas</div>
        <div class="result-average">Promedio: {{ result.average.toFixed(2) }}</div>
      </div>
    </div>
    <div v-else>
      <p>No hay resultados disponibles.</p>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase'; // Asegúrate de importar correctamente tu instancia de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importa las funciones correctas

export default {
  data() {
    return {
      results: [],
      isMobile: window.innerWidth <= 768
    };
  },
  computed: {
    sortedResults() {
      return this.results.slice().sort((a, b) => b.correctAnswers - a.correctAnswers); // Ordenar de mayor a menor respuestas correctas
    }
  },
  methods: {
    async fetchResults() {
      try {
        const resultsRef = collection(db, "triviaResults"); // Obtener la colección de resultados
        const snapshot = await getDocs(resultsRef); // Obtener los documentos
        this.results = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            playerName: data.playerName, // Nombre del jugador
            correctAnswers: data.correctAnswers, // Respuestas correctas
            average: (data.correctAnswers / 5), // Calcular el promedio de respuestas correctas
          };
        });
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
      }
    },
    getPodiumClass(index) {
      if (index === 0) return "podium-first"; // Primer lugar
      if (index === 1) return "podium-second"; // Segundo lugar
      if (index === 2) return "podium-third"; // Tercer lugar
      return "";
    }
  },
  mounted() {
    this.fetchResults();
  }
};
</script>

<style scoped>
.results-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #6A11CB, #2575FC);
  color: white;
  font-family: 'Baloo', sans-serif;
}

.results-list {
  width: 90%;
  max-width: 600px;
  margin-top: 20px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.3);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

.result-position {
  font-size: 24px;
  font-weight: bold;
}

.result-name, .result-score, .result-average {
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
