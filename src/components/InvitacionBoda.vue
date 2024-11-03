<template>
  <div class="invitacion">
    <h1>Fiesta</h1>
    <p>Sábado 23 de Noviembre de 2024</p>
    <h2>Agendar fecha</h2>
    <!-- Botón para agendar la fecha en Google Calendar -->
    <a :href="googleCalendarLink" target="_blank" class="agendar-boton">Añadir a Google Calendar</a>
  </div>
</template>

<script lang="ts" setup>
const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Fiesta&dates=20241123T180000Z/20241123T210000Z&details=No+te+pierdas+nuestra+fiesta&location=Dirección+de+la+fiesta&sf=true&output=xml`;
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

.invitacion {
  font-family: 'Playfair Display', serif;
  text-align: center;
  background-color: #f0eae5;
  color: #333;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: calc(100% - 10px); /* Ajuste de ancho según lo solicitado */
  height: calc(100vh - 50px); /* Ajuste de alto según lo solicitado */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 5px auto; /* Márgenes pequeños para mantener el estilo centrado */
}

.invitacion::before, .invitacion::after {
  content: '';
  position: absolute;
  background-size: cover;
  background-repeat: no-repeat;
  width: 25vw; /* Ajuste en relación al ancho del viewport */
  height: 25vh; /* Ajuste en relación a la altura del viewport */
  max-width: 150px; /* Tamaño máximo para evitar imágenes muy grandes */
  max-height: 150px; /* Tamaño máximo para evitar imágenes muy grandes */
  background-image: url('@/../public/images/flor.png'); /* Imagen decorativa */
}

.invitacion::before {
  top: 0;
  left: 0;
  background-position: top left; /* Imagen decorativa en esquina superior izquierda */
}

.invitacion::after {
  bottom: 0;
  right: 0;
  background-position: bottom right; /* Imagen decorativa en esquina inferior derecha */
  transform: rotate(180deg); /* Rotación para darle estilo a la imagen */
}

.agendar-boton {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #b98b4e; /* Color dorado */
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-family: 'Playfair Display', serif;
  transition: background-color 0.3s;
}

.agendar-boton:hover {
  background-color: #9a733b; /* Color dorado oscuro al hacer hover */
}

h1, h2, h3 {
  margin: 0;
  padding: 10px 0;
}

p {
  margin: 10px 0;
}

@media (max-width: 768px) {
  .invitacion {
    padding: 10px;
    border-width: 1px;
    margin: 10px auto; /* Ajuste de márgenes en móvil */
    width: calc(100% - 10px); /* Ajuste de ancho en móvil */
    height: calc(100vh - 50px); /* Mantiene la relación de alto en móvil */
  }
  
  h1 {
    font-size: 1.5em;
  }
  
  h2 {
    font-size: 1.2em;
  }
  
  h3 {
    font-size: 1em;
  }
  
  p {
    font-size: 0.9em;
  }
}
</style>
