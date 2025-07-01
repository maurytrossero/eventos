<template>
  <div class="question-form">
    <h2>Configuración de Preguntas de la Trivia</h2>

    <label class="toggle-trivia">
      <input type="checkbox" v-model="triviaActiva" />
      Activar trivia para este evento
    </label>

    <template v-if="questions.length === 0">
      <p class="empty-message">Aún no se han cargado preguntas para este evento.</p>
      <button @click="addQuestion" class="add-question">➕ Añadir primera pregunta</button>
    </template>

    <template v-else>
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="question-block"
      >
        <input
          v-model="question.question"
          placeholder="Escribí la pregunta"
          class="question-input"
        />

        <div class="options">
          <div
            v-for="(option, i) in question.options"
            :key="i"
            class="option-item"
          >
            <input
              v-model="question.options[i]"
              placeholder="Opción"
              class="option-input"
            />
            <input
              type="radio"
              :name="'correct-' + index"
              :value="question.options[i]"
              v-model="question.answer"
              class="radio-correct"
            />
            Correcta
            <button
              @click="removeOption(index, i)"
              class="remove"
              :disabled="question.options.length <= 4"
              title="Cada pregunta debe tener siempre 4 opciones"
            >
              ❌
            </button>
          </div>
          <button
            @click="addOption(index)"
            class="add"
            :disabled="question.options.length >= 4"
            title="Cada pregunta debe tener siempre 4 opciones"
          >
            ➕ Añadir opción
          </button>
        </div>

        <button @click="removeQuestion(index)" class="remove-question">
          Eliminar pregunta ❌
        </button>
        <hr />
      </div>

      <button @click="addQuestion" class="add-question">➕ Añadir pregunta</button>
    </template>

    <button
      v-if="questions.length > 0"
      @click="saveQuestions"
      class="save"
    >
      💾 Guardar preguntas
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc
} from 'firebase/firestore'


const props = defineProps({
  eventoId: { type: String, required: true }
})

const questions = ref([])
const triviaActiva = ref(false)

const questionsCollectionRef = collection(db, 'eventos', props.eventoId, 'triviaQuestions')
const eventoDocRef = doc(db, 'eventos', props.eventoId)

onMounted(async () => {
  try {
    // Cargar preguntas desde la subcolección
    const querySnapshot = await getDocs(questionsCollectionRef)
    const loadedQuestions = []
    querySnapshot.forEach((docSnap) => {
      loadedQuestions.push(docSnap.data())
    })
    questions.value = loadedQuestions

    // Cargar triviaActiva del documento del evento
    const eventoSnap = await getDoc(eventoDocRef)
    if (eventoSnap.exists()) {
      triviaActiva.value = eventoSnap.data().triviaActiva || false
    }
  } catch (e) {
    console.error('Error al cargar preguntas:', e)
  }
})

function addQuestion() {
  questions.value.push({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  })
}

function removeQuestion(index) {
  questions.value.splice(index, 1)
}

function addOption(qIndex) {
  if (questions.value[qIndex].options.length < 4) {
    questions.value[qIndex].options.push('')
  }
}

function removeOption(qIndex, oIndex) {
  if (questions.value[qIndex].options.length <= 4) return
  if (questions.value[qIndex].answer === questions.value[qIndex].options[oIndex]) {
    questions.value[qIndex].answer = ''
  }
  questions.value[qIndex].options.splice(oIndex, 1)
}

async function saveQuestions() {
  for (const q of questions.value) {
    if (!q.question.trim()) {
      alert('Por favor, completá todas las preguntas antes de guardar.')
      return
    }
    if (q.options.length !== 4) {
      alert('Cada pregunta debe tener exactamente cuatro opciones.')
      return
    }
    if (!q.answer) {
      alert('Seleccioná la opción correcta para cada pregunta.')
      return
    }
  }

  try {
    // Eliminar preguntas existentes
    const existingDocs = await getDocs(questionsCollectionRef)
    for (const d of existingDocs.docs) {
      await deleteDoc(d.ref)
    }

    // Guardar nuevas preguntas
    for (let i = 0; i < questions.value.length; i++) {
      const questionDocRef = doc(questionsCollectionRef)
      await setDoc(questionDocRef, {
        ...questions.value[i],
        index: i
      })
    }

    // Guardar el estado de triviaActiva dentro del evento
    await setDoc(eventoDocRef, {
      triviaActiva: triviaActiva.value
    }, { merge: true })

    alert('Preguntas guardadas correctamente')
  } catch (e) {
    console.error('Error al guardar preguntas:', e)
    alert('Hubo un error al guardar las preguntas')
  }
}
</script>


<style scoped>
.question-form {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 10px;
  font-family: sans-serif;
}
.question-block {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
}
.question-input,
.option-input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.radio-correct {
  margin-left: 0.5rem;
}
button {
  cursor: pointer;
}
.add,
.remove,
.remove-question,
.add-question,
.save {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
}
.add,
.add-question {
  background-color: #4caf50;
  color: white;
}
.remove,
.remove-question {
  background-color: #f44336;
  color: white;
}
.save {
  background-color: #2196f3;
  color: white;
  margin-top: 1rem;
}
.empty-message {
  text-align: center;
  margin: 1rem 0;
  font-style: italic;
  color: #666;
}
.toggle-trivia {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
