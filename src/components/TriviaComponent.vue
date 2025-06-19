<template>
  <div class="trivia-container" :class="{ 'mobile': isMobile }">
    <div v-if="!gameStarted" class="start-screen">
      <h1>¿Cuánto conoces a Andrea?</h1>
      <input v-model="playerName" placeholder="Ingresa tu nombre" class="name-input" />
      <button @click="startGame" class="start-button">Comenzar Trivia</button>

      <!-- Nuevo botón para redirigir a la ruta de resultados -->
      <router-link to="/invitacion-andrea-giron/resultados-trivia">
        <button class="view-results-button">Ver Resultados</button>
      </router-link>
    </div>
    
    <div v-else-if="!gameOver" class="game-screen">
      
      <div class="timer-container">
        <svg class="timer-circle" width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#ccc" stroke-width="8" fill="none" />
          <circle cx="50" cy="50" r="45" stroke="#FFD700" stroke-width="8" fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="timeDashOffset"
            transform="rotate(-90 50 50)"/>
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
            :class="getOptionClass(option)">
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

<script>
import { db } from '@/firebase'; // Asegúrate de importar correctamente la instancia de Firebase
import { collection, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      questions: [
        { question: "¿Cuál es el color favorito de Andrea?", options: ["Azul", "Rojo", "Verde", "Negro"], answer: "Azul" },
        { question: "¿Cuál es la comida favorita de Andrea?", options: ["Sushi", "Pizza", "Tacos", "Pasta"], answer: "Sushi" },
        { question: "¿Cuál es el deporte favorito de Andrea?", options: ["Fútbol", "Baloncesto", "Natación", "Correr"], answer: "Fútbol" },
        { question: "¿Qué animal le gusta más a Andrea?", options: ["Perro", "Gato", "Conejo", "Tigre"], answer: "Perro" },
        { question: "¿Dónde nació Andrea?", options: ["México", "Argentina", "Colombia", "España"], answer: "México" }
      ],
      currentIndex: 0,
      timeLeft: 15,
      timer: null,
      score: 0,
      answered: false,
      gameStarted: false,
      gameOver: false,
      playerName: "",
      selectedAnswer: "",
      isMobile: window.innerWidth <= 768,
      isCorrect: false
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    finalScore() {
      return ((this.score / this.questions.length) * 10).toFixed(1);
    }
  },
  methods: {
    
    startGame() {
      if (!this.playerName.trim()) return;
      this.gameStarted = true;
      this.startTimer();
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.nextQuestion(false);
        }
      }, 1000);
    },
    selectAnswer(option) {
      if (this.answered) return;

      this.answered = true;
      this.selectedAnswer = option;
      this.isCorrect = option === this.currentQuestion.answer;
      if (this.isCorrect) this.score++;

      setTimeout(() => this.nextQuestion(true), 1000);
    },
    nextQuestion(userAnswered) {
      clearInterval(this.timer);
      this.answered = false;
      this.timeLeft = 15;

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        if (userAnswered) this.startTimer();
      } else {
        this.gameOver = true;
        this.saveGameResults();
      }
    },
    async saveGameResults() {
      if (!this.playerName.trim()) return;

    const gameData = {
      playerName: this.playerName,    // Nombre del jugador
      correctAnswers: this.score,     // Cantidad de respuestas correctas
      averageScore: this.finalScore,  // Puntaje final
      timestamp: new Date()           // Marca de tiempo cuando se guardan los resultados
    };

    try {
      // Guardar los datos en la colección "triviaResults"
      await addDoc(collection(db, "triviaResults"), gameData);
      console.log("Resultados guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los resultados: ", error);
    }
    },
    restartGame() {
      this.currentIndex = 0;
      this.score = 0;
      this.gameStarted = false;
      this.gameOver = false;
      this.timeLeft = 15;
    },
    getOptionClass(option) {
      if (!this.answered) return '';
      if (option === this.currentQuestion.answer) return 'correct-answer';
      if (option === this.selectedAnswer && option !== this.currentQuestion.answer) return 'incorrect-answer';
      return '';
    }
  }
};
</script>

<style scoped>
.trivia-container {
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
  background: #FFD700;
  color: black;
  padding: 10px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
  border: none;
  width: 100%;
  margin-top: 10px;
}
.start-button:hover {
  background: #f79437; /* Color al pasar el ratón */
}
.view-results-button {
  background: #2575FC;  /* Cambié el color de fondo a un tono azul */
  color: white;         /* Texto en color blanco */
  padding: 10px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
  border: none;
  width: 100%;
  margin-top: 10px;
}

.view-results-button:hover {
  background: #6A11CB; /* Color al pasar el ratón */
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
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  animation: popUp 0.5s ease;
}

@keyframes popUp {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
