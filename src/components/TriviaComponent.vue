<template>
  <div class="trivia-container" :class="{ 'mobile': isMobile }">
    <div v-if="!gameStarted" class="start-screen">
      <h1>{{ tituloTrivia }}</h1>
      <p v-if="usandoPreguntasPorDefecto" class="warning-text">
        ⚠️ La trivia usa preguntas por defecto. Configurá preguntas personalizadas desde el panel de administración.
      </p>

      <input v-model="playerName" placeholder="Ingresa tu nombre" class="name-input" />
      <button @click="startGame" class="start-button">Comenzar Trivia</button>
    </div>

    <div v-else-if="!gameOver" class="game-screen">
      <div class="timer-container">
        <svg class="timer-circle" width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#ccc" stroke-width="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#FFD700"
            stroke-width="8"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="timeDashOffset"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <p class="time-text">{{ timeLeft }}</p>
      </div>

      <h2 class="question">{{ currentQuestion.question }}</h2>

      <ul class="options">
        <li v-for="(option, index) in currentQuestion.options" :key="index" class="option-item">
          <button
            @click="selectAnswer(option)"
            :disabled="answered"
            class="option-button"
            :class="getOptionClass(option)"
          >
            {{ option }}
          </button>
        </li>
      </ul>

      <p v-if="answered" :class="isCorrect ? 'correct' : 'incorrect'" class="feedback-text">
        {{ isCorrect ? '¡Correcto!' : 'Incorrecto' }}
      </p>
    </div>

    <div v-else class="end-screen">
      <h2>Juego terminado</h2>
      <p>Puntaje final: {{ finalScore }} / 10</p>
      <button @click="restartGame" class="restart-button">Jugar de nuevo</button>
    </div>
  </div>
</template>

<script setup>
import { db } from '@/firebase'
import { ref, computed, onMounted } from 'vue'
import {
  collection,
  getDocs,
  addDoc
} from 'firebase/firestore'

const questionsFromDB = ref([])
const usandoPreguntasPorDefecto = ref(false)

const props = defineProps({
  eventoId: { type: String, required: true },
  tituloTrivia: { type: String, default: '¿Cuánto conocés al protagonista?' }
})

const defaultQuestions = ref([
  {
    question: '¿Cuál es el color favorito?',
    options: ['Rosa', 'Celeste', 'Violeta', 'Negro'],
    answer: 'Violeta'
  },
  {
    question: '¿Qué comida le gusta más?',
    options: ['Pizza', 'Sushi', 'Hamburguesas', 'Pasta'],
    answer: 'Sushi'
  },
  {
    question: '¿Qué animal prefiere?',
    options: ['Perro', 'Gato', 'Conejo', 'Caballo'],
    answer: 'Perro'
  },
  {
    question: '¿Cuál es su postre favorito?',
    options: ['Helado', 'Tiramisú', 'Tarta de frutilla', 'Brownie'],
    answer: 'Helado'
  },
  {
    question: '¿Cuál es su red social favorita?',
    options: ['Instagram', 'TikTok', 'Facebook', 'YouTube'],
    answer: 'TikTok'
  },
  {
    question: '¿Qué estilo de música prefiere?',
    options: ['Pop', 'Reguetón', 'Rock', 'Cumbia'],
    answer: 'Pop'
  },
  {
    question: '¿Qué actividad le gusta más?',
    options: ['Bailar', 'Leer', 'Dibujar', 'Hacer deporte'],
    answer: 'Bailar'
  },
  {
    question: '¿Qué estación del año prefiere?',
    options: ['Primavera', 'Verano', 'Otoño', 'Invierno'],
    answer: 'Primavera'
  },
  {
    question: '¿Qué película podría ver una y otra vez?',
    options: ['Frozen', 'Barbie', 'Titanic', 'Harry Potter'],
    answer: 'Barbie'
  },
  {
    question: '¿Qué emoji usa más seguido?',
    options: ['😂', '❤️', '✨', '😎'],
    answer: '✨'
  },
  // NUEVAS 10
  {
    question: '¿Qué sabor de helado prefiere?',
    options: ['Chocolate', 'Frutilla', 'Dulce de leche', 'Limón'],
    answer: 'Dulce de leche'
  },
  {
    question: '¿Qué día de la semana le gusta más?',
    options: ['Lunes', 'Viernes', 'Sábado', 'Domingo'],
    answer: 'Sábado'
  },
  {
    question: '¿A qué hora suele dormirse?',
    options: ['Antes de las 22', 'Entre 22 y 23', 'Después de las 23', 'Muy tarde, tipo 2am'],
    answer: 'Después de las 23'
  },
  {
    question: '¿Qué superpoder elegiría?',
    options: ['Volar', 'Ser invisible', 'Leer mentes', 'Detener el tiempo'],
    answer: 'Volar'
  },
  {
    question: '¿Cuál es su bebida favorita?',
    options: ['Agua', 'Gaseosa', 'Jugo', 'Té'],
    answer: 'Gaseosa'
  },
  {
    question: '¿Qué serie prefiere?',
    options: ['Stranger Things', 'Merlina', 'Friends', 'Soy Luna'],
    answer: 'Merlina'
  },
  {
    question: '¿Qué prefiere usar?',
    options: ['Vestido', 'Jeans', 'Pijama', 'Shorts'],
    answer: 'Vestido'
  },
  {
    question: '¿Qué color tendría su habitación ideal?',
    options: ['Blanco', 'Rosa pastel', 'Turquesa', 'Lavanda'],
    answer: 'Lavanda'
  },
  {
    question: '¿Qué lugar soñaría visitar?',
    options: ['París', 'Nueva York', 'Tokio', 'Roma'],
    answer: 'París'
  },
  {
    question: '¿Qué prefiere para su fiesta?',
    options: ['Mucho baile', 'Photobooth', 'Karaoke', 'Decoración mágica'],
    answer: 'Mucho baile'
  }
])
const questions = ref([]) // Se va a llenar en onMounted
const currentIndex = ref(0)
const timeLeft = ref(15)
const timer = ref(null)
const score = ref(0)
const answered = ref(false)
const gameStarted = ref(false)
const gameOver = ref(false)
const playerName = ref('')
const selectedAnswer = ref('')
const isCorrect = ref(false)
const isMobile = window.innerWidth <= 768

const currentQuestion = computed(() => questions.value[currentIndex.value])
const finalScore = computed(() => ((score.value / questions.value.length) * 10).toFixed(1))

const circumference = 2 * Math.PI * 45
const timeDashOffset = computed(() => circumference - (circumference * timeLeft.value) / 15)

// CARGA DE SONIDOS
const soundCorrect = new Audio('/sounds/correct.mp3')
const soundWrong = new Audio('/sounds/wrong.mp3')
const soundTimeout = new Audio('/sounds/timeout.mp3')

onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, 'eventos', props.eventoId, 'triviaQuestions'))
    if (!snapshot.empty) {
      // Cargar preguntas desde la BD
      const loadedQuestions = []
      snapshot.forEach((doc) => {
        loadedQuestions.push(doc.data())
      })
      questions.value = loadedQuestions
    } else {
      // Si no hay en BD, usar las por defecto
      questions.value = defaultQuestions
      usandoPreguntasPorDefecto.value = true
    }
  } catch (error) {
    console.error('Error al cargar preguntas:', error)
    // Fallback seguro
    questions.value = defaultQuestions
    usandoPreguntasPorDefecto.value = true
  }
})

function startGame() {
  if (!playerName.value.trim()) return
  gameStarted.value = true
  startTimer()
}

function startTimer() {
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      nextQuestion(false)
    }
  }, 1000)
}

function selectAnswer(option) {
  if (answered.value) return
  answered.value = true
  selectedAnswer.value = option
  isCorrect.value = option === currentQuestion.value.answer
  if (isCorrect.value) {
    soundCorrect.play()
    score.value++
  } else {
    soundWrong.play()
  }

  setTimeout(() => nextQuestion(true), 1000)
}

function nextQuestion(userAnswered) {
  clearInterval(timer.value)
  answered.value = false
  timeLeft.value = 15

  if (!userAnswered) {
    soundTimeout.play()
  }

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    if (userAnswered) startTimer()
  } else {
    gameOver.value = true
    saveGameResults()
  }
}

async function saveGameResults() {
  if (!playerName.value.trim()) return

  const gameData = {
    playerName: playerName.value,
    correctAnswers: score.value,
    averageScore: finalScore.value,
    eventoId: props.eventoId,
    timestamp: new Date()
  }

  try {
    await addDoc(collection(db, 'eventos', props.eventoId, 'triviaResults'), gameData)
    console.log('Resultados guardados exitosamente.')
  } catch (error) {
    console.error('Error al guardar los resultados: ', error)
  }
}

function restartGame() {
  currentIndex.value = 0
  score.value = 0
  gameStarted.value = false
  gameOver.value = false
  timeLeft.value = 15
}
function getOptionClass(option) {
  if (!answered.value) return ''
  if (option === currentQuestion.value.answer) return 'correct-answer'
  if (option === selectedAnswer.value && option !== currentQuestion.value.answer) return 'incorrect-answer'
  return ''
}
</script>

<style scoped>
.trivia-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  font-family: 'Baloo', sans-serif;
  padding: 1rem;
}
.start-screen, .game-screen, .end-screen {
  text-align: center;
  width: 90%;
  max-width: 600px;
}
.name-input {
  padding: 15px;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  text-align: center;
  width: calc(100% - 30px);
  margin-top: 10px;
}
.start-button, .option-button, .restart-button {
  background: #ffd700;
  color: black;
  padding: 10px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
  border: none;
  width: 100%;
  margin-top: 10px;
}
.options {
  list-style: none;
  padding: 0;
}
.option-item {
  margin: 10px 0;
}
.option-button {
  background: white;
  color: black;
  font-size: 20px;
  border-radius: 15px;
}
.correct-answer {
  background-color: green !important;
  color: white;
}
.incorrect-answer {
  background-color: red !important;
  color: white;
}
.feedback-text {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  animation: popUp 0.5s ease;
}
@keyframes popUp {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.warning-text {
  color: #b22222;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
