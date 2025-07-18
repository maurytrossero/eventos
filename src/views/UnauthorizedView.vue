<template>
  <div class="unauthorized-contenedor">
    <h1 class="titulo">🚫 Acceso no autorizado</h1>
    <p class="mensaje">No tenés permisos para acceder a esta sección.</p>
    <router-link to="/" class="boton-volver">Volver al inicio</router-link>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica en este componente simple
</script>

<style scoped>
.unauthorized-contenedor {
  max-width: 600px;
  margin: 100px auto;
  padding: 30px;
  background-color: #ffffff;
  border: 2px solid #ccc;
  border-radius: 10px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.08);
}

.titulo {
  font-size: 2em;
  color: #c0392b;
  margin-bottom: 10px;
}

.mensaje {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 20px;
}

.boton-volver {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.boton-volver:hover {
  background-color: #0056b3;
}
</style>
