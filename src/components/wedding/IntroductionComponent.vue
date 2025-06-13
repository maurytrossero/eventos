<template>
  <div class="cuenta-regresiva">
    <div class="overlay">
      <h2 class="playfair">NUESTRA BODA</h2>
      <h1 class="playball">Noe & Cristian</h1>
      <h2 class="playfair">23/11/2024</h2>
      <h3 class="playball thin">"Los esperamos para compartir un momento especial para nosotros lleno de emoción y alegría"</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playball&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');

.cuenta-regresiva {
position: relative;
height: calc(100vh - 50px);
margin: 5px;
background: url('https://dl.dropboxusercontent.com/scl/fi/9g1d33zmsluyxrfn9k8te/imagen-propuestaW.jpg?rlkey=8affm2g65hlulgq62vmg0lfsy&st=50ii6141') no-repeat center center;
background-size: cover;
overflow: hidden;
border: 2px solid white;
border-radius: 15px;
box-sizing: border-box;
display: flex;
justify-content: center;
align-items: center;
}
.cuenta-regresiva::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Negro con 50% de opacidad */
  z-index: 1;
}

.overlay {
  position: relative;
  z-index: 2; /* Asegura que el texto esté por encima de la capa oscura */
}


.overlay {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 100%;
text-align: center;
color: white;
padding: 20px;
}

h1.playball {
font-size: 3em;
margin: 0;
line-height: 1.3;
text-align: center;
font-family: 'Playball', cursive;
}

h2.playfair {
font-size: 2em;
font-family: 'Playfair Display', serif;
margin: 15px 0;
line-height: 1.4;
text-align: center;
}

h3.playball {
font-size: 1.8em;
font-family: 'Playball', cursive;
font-weight: 300;
margin: 20px 0;
padding: 0 10px;
line-height: 1.6;
color: #f0f0f0;
text-align: center;
}

@media (max-width: 768px) {
.cuenta-regresiva {
  background: url('https://dl.dropboxusercontent.com/scl/fi/dimcffvy2ur8av5hgu7ep/imagen-propuesta.jpg?rlkey=siike27l0gaybd0l9gs6iadq9&st=qvgvksv2') no-repeat center center;
}

.overlay {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1.playball {
  font-size: 2.5em;
  line-height: 1.2;
}

h2.playfair {
  font-size: 1.7em;
  margin: 10px 0;
  line-height: 1.3;
}

h3.playball {
  font-size: 1.5em;
  margin: 10px 0;
  line-height: 1.4;
}
}
</style>
