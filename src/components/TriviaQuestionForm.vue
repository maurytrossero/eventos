<!-- src/components/TriviaQuestionForm.vue -->
<template>
  <div class="trivia-settings">
    <h2 class="titulo">📝 Configuración de Preguntas de la Trivia</h2>

    <div class="form-group toggle-trivia">
      <label>
        <input type="checkbox" v-model="triviaActiva" />
        Activar trivia para este evento
      </label>
    </div>

    <template v-if="questions.length === 0">
      <p class="empty-message">Aún no se han cargado preguntas para este evento.</p>
      <div class="buttons">
        <button @click="addQuestion" class="btn add-question" type="button">
          ➕ Añadir primera pregunta
        </button>
      </div>
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
              class="btn remove"
              :disabled="question.options.length <= 4"
              title="Cada pregunta debe tener siempre 4 opciones"
              type="button"
            >
              ❌
            </button>
          </div>
          <button
            @click="addOption(index)"
            class="btn add"
            :disabled="question.options.length >= 4"
            title="Cada pregunta debe tener siempre 4 opciones"
            type="button"
          >
            ➕ Añadir opción
          </button>
        </div>

        <button @click="removeQuestion(index)" class="btn remove-question" type="button">
          Eliminar pregunta ❌
        </button>
        <hr />
      </div>

      <div class="buttons">
        <button @click="addQuestion" class="btn add-question" type="button">
          ➕ Añadir pregunta
        </button>

        <button
          v-if="questions.length > 0"
          @click="saveQuestions"
          class="btn save"
          type="button"
        >
          💾 Guardar preguntas
        </button>
      </div>
    </template>
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
    const querySnapshot = await getDocs(questionsCollectionRef)
    const loadedQuestions = []
    querySnapshot.forEach((docSnap) => {
      loadedQuestions.push(docSnap.data())
    })
    questions.value = loadedQuestions

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
    const existingDocs = await getDocs(questionsCollectionRef)
    for (const d of existingDocs.docs) {
      await deleteDoc(d.ref)
    }

    for (let i = 0; i < questions.value.length; i++) {
      const questionDocRef = doc(questionsCollectionRef)
      await setDoc(questionDocRef, {
        ...questions.value[i],
        index: i
      })
    }

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
.trivia-settings {
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
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toggle-trivia label {
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
}

input[type='text'],
input[type='checkbox'],
textarea,
.question-input,
.option-input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background: white;
  color: #333;
  box-sizing: border-box;
}

.question-input {
  margin-bottom: 1rem;
  width: 100%;
}

.option-input {
  flex: 1;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-correct {
  margin-left: 0.5rem;
  cursor: pointer;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 200px; /* ancho fijo */
  color: white;
  box-sizing: border-box;
  white-space: nowrap;
}


.btn.add-question {
  background-color: #4a90e2;
}

.btn.add-question:hover {
  background-color: #357ac4;
}

.btn.add {
  background-color: #4a90e2;
}

.btn.add:hover {
  background-color: #357ac4;
}

.btn.remove,
.btn.remove-question {
  background-color: #b22222;
}

.btn.remove:hover,
.btn.remove-question:hover {
  background-color: #8b1a1a;
}

.btn.save {
  background-color: #4caf50;
  margin-top: 1.5rem;
}

.btn.save:hover {
  background-color: #388e3c;
}

.empty-message {
  text-align: center;
  margin: 1rem 0;
  font-style: italic;
  color: #666;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 500px) {
  .btn {
    width: 100%;
  }

  .option-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .buttons {
    flex-direction: column;
    gap: 0.8rem;
  }
}
@media (prefers-color-scheme: dark) {
  .trivia-settings {
    background: #1e1e1e;
    color: #f0f0f0;
  }

  .titulo {
    color: #f0f0f0;
  }

  .toggle-trivia label {
    color: #f0f0f0;
  }

  .question-input,
  .option-input,
  input[type='text'],
  textarea,
  select {
    background-color: #2b2b2b;
    color: #f0f0f0;
    border: 1px solid #444;
  }

  .radio-correct {
    accent-color: #4a90e2;
  }

  .empty-message {
    color: #aaa;
  }

  .btn.add-question,
  .btn.add {
    background-color: #357ac4;
  }

  .btn.add-question:hover,
  .btn.add:hover {
    background-color: #2463a8;
  }

  .btn.remove,
  .btn.remove-question {
    background-color: #8b1a1a;
  }

  .btn.remove:hover,
  .btn.remove-question:hover {
    background-color: #a94444;
  }

  .btn.save {
    background-color: #2e7d32;
  }

  .btn.save:hover {
    background-color: #1b5e20;
  }

  hr {
    border-top: 1px solid #444;
  }
}

</style>
