<!-- components/UsersList.vue -->
<template>
  <div class="lista-eventos">
    <h1>Gestión de Usuarios</h1>

    <input
      type="text"
      v-model="filtro"
      placeholder="Buscar por nombre o email"
      class="filtro-input"
    />

    <ul class="eventos-lista">
      <li
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id"
        class="evento-item"
      >
        <template v-if="usuarioEditando && usuarioEditando.id === usuario.id">
          <input
            type="text"
            class="input-edicion"
            v-model="usuarioEditando.nombre"
            placeholder="Nombre"
          />
          <input
            type="email"
            class="input-edicion"
            v-model="usuarioEditando.email"
            placeholder="Email"
          />
          <button @click="guardarCambios">Guardar</button>
          <button @click="cancelarEdicion">Cancelar</button>
        </template>
        <template v-else>
          <h2>{{ usuario.nombre }}</h2>
          <p class="detalle"><strong>Email:</strong> {{ usuario.email }}</p>
          <button @click="iniciarEdicion(usuario)">Editar</button>
          <button @click="borrarUsuario(usuario.id)">Eliminar</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getUsuarios,
  eliminarUsuario,
  actualizarUsuario
} from '../services/userService'
import Swal from 'sweetalert2'

interface Usuario {
  id: string
  nombre: string
  email: string
}

const usuarios = ref<Usuario[]>([])
const filtro = ref('')
const usuarioEditando = ref<Usuario | null>(null)

const cargarUsuarios = async () => {
  try {
    const data = (await getUsuarios()) as Usuario[]
    console.log('Usuarios cargados:', data)
    usuarios.value = data
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  }
}

const usuariosFiltrados = computed(() => {
  if (!filtro.value) return usuarios.value
  return usuarios.value.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.value.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.value.toLowerCase())
  )
})

const iniciarEdicion = (usuario: Usuario) => {
  usuarioEditando.value = { ...usuario }
}

const cancelarEdicion = () => {
  usuarioEditando.value = null
}

const guardarCambios = async () => {
  if (usuarioEditando.value) {
    await actualizarUsuario(usuarioEditando.value)
    await cargarUsuarios()
    usuarioEditando.value = null
  }
}

const borrarUsuario = async (id: string) => {
  const resultado = await Swal.fire({
    title: '¿Eliminar usuario?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b98b4e',
    cancelButtonColor: '#aaa',
    background: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a3a50' : '#fff',
    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f5db8b' : '#1f2d3d'
  })

  if (resultado.isConfirmed) {
    try {
      await eliminarUsuario(id)
      await cargarUsuarios()
      Swal.fire({
        title: 'Eliminado',
        text: 'El usuario ha sido eliminado.',
        icon: 'success',
        confirmButtonColor: '#b98b4e',
        background: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a3a50' : '#fff',
        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f5db8b' : '#1f2d3d'
      })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el usuario.',
        icon: 'error',
        confirmButtonColor: '#b98b4e'
      })
    }
  }
}


onMounted(() => cargarUsuarios())
</script>

<style scoped>
.lista-eventos {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Poppins', sans-serif;
  background: #fefefe;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.1);
  color: #1f2d3d;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.filtro-input {
  display: block;
  margin: 0 auto 24px auto;
  padding: 12px 16px;
  width: 100%;
  max-width: 400px;
  font-size: 1.1rem;
  border: 2px solid #b98b4e;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  outline-offset: 2px;
  transition: border-color 0.3s ease;
}

.filtro-input:focus {
  border-color: #906f30;
  box-shadow: 0 0 6px #b98b4eaa;
}

.eventos-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.evento-item {
  background: #fff;
  border-radius: 10px;
  margin-bottom: 16px;
  padding: 16px 20px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.08);
  transition: box-shadow 0.3s ease;
}

.evento-item:hover {
  box-shadow: 0 6px 15px rgb(185 139 78 / 0.3);
}

.evento-item h2 {
  margin: 0 0 8px;
  font-weight: 700;
  font-size: 1.3rem;
  color: #b98b4e;
}

.detalle {
  font-size: 1rem;
  color: #444;
  margin-bottom: 12px;
}

/* Inputs de edición estilizados con clase dedicada */
.input-edicion {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #b98b4e;
  font-family: 'Poppins', sans-serif;
  outline-offset: 2px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  color: #1f2d3d;
  background-color: #fff;
}

.input-edicion:focus {
  border-color: #906f30;
  box-shadow: 0 0 6px #b98b4eaa;
  background-color: #fff;
}

button {
  margin-right: 10px;
  padding: 8px 18px;
  background-color: #b98b4e;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #906f30;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  .lista-eventos {
    background: #222d3a;
    color: #e0d8b0;
    box-shadow: 0 8px 25px rgb(185 139 78 / 0.4);
  }

  .filtro-input {
    background: #394659;
    color: #e0d8b0;
    border-color: #b98b4e;
  }

  .filtro-input:focus {
    border-color: #f5db8b;
    box-shadow: 0 0 8px #f5db8baa;
  }

  .evento-item {
    background: #2a3a50;
    box-shadow: 0 3px 10px rgb(185 139 78 / 0.3);
  }

  .evento-item:hover {
    box-shadow: 0 6px 18px rgb(185 139 78 / 0.6);
  }

  .evento-item h2 {
    color: #f5db8b;
  }

  .detalle {
    color: #cfc7a4;
  }

  .input-edicion {
    background-color: #3d4e6d;
    color: #f5db8b;
    border-color: #f5db8b;
  }

  .input-edicion:focus {
    border-color: #fff6c6;
    box-shadow: 0 0 8px #fff6c6aa;
    background-color: #3d4e6d;
  }

  button {
    background-color: #f5db8b;
    color: #2a3a50;
  }

  button:hover {
    background-color: #d4c472;
  }
}
</style>
