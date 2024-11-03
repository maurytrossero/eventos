<template>
  <div class="home">
    <h1>Bienvenido al Sistema Gestor de Eventos</h1>
    <h2>Categorías</h2>
    <div class="categories">
      <div class="category">
        <h3>Eventos</h3>
        <ul>
          <li><router-link to="/eventos">Agregar un Nuevo Evento</router-link></li>
          <li><router-link to="/eventos/lista">Lista de Eventos</router-link></li>
        </ul>
      </div>

      <div class="category">
        <h3>Inicio</h3>
        <ul>
          <li><router-link to="/inicio">Ir a Inicio</router-link></li>
        </ul>
      </div>

      <div class="category">
        <h3>Acerca de</h3>
        <ul>
          <li><router-link to="/about">Sobre Nosotros</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView'
});
</script>

<style scoped>
.home {
  max-width: 100%; /* Occupy full width */
  min-height: 100vh; /* Ensure it occupies full height */
  margin: 0;
  text-align: center;
  font-family: 'Arial', sans-serif; /* Use a pleasant font */
  color: #333; /* Text color for better readability */
  background-color: #f8f9fa; /* Light background for contrast */
  padding: 20px; /* Padding for spacing */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

h1 {
  font-size: 2.5em; /* Increase main title size */
  color: #2c3e50; /* Darker color for title */
}

h2 {
  font-size: 2em; /* Increase subtitle size */
  color: #34495e; /* Slightly lighter color for subtitle */
}

.categories {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category {
  width: 60%; /* Set fixed width for categories */
  margin: 20px 0;
  padding: 15px; /* Padding inside each category */
  border: 2px solid #ccc; /* Increase border width */
  border-radius: 8px; /* Rounded corners for elegance */
  background-color: #ffffff; /* White background for categories */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Slight shadow for categories */
  transition: box-shadow 0.3s ease; /* Smooth transition for hover effect */
}

.category:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Darker shadow on hover */
}

.category h3 {
  margin-bottom: 10px;
  font-size: 1.5em; /* Increase category title size */
  color: #2c3e50; /* Darker color for category titles */
}

.category ul {
  list-style: none;
  padding: 0;
}

.category li {
  margin: 5px 0;
}

.category li a {
  text-decoration: none; /* Remove underline from links */
  color: #2980b9; /* Link color */
  font-size: 1.2em; /* Increase link size */
  transition: color 0.3s ease; /* Smooth color transition */
}

.category li a:hover {
  color: #3498db; /* Lighter color on hover */
  text-decoration: underline; /* Underline on hover */
}

/* Responsive styles */
@media (max-width: 768px) {
  h1 {
    font-size: 2em; /* Adjust size for smaller screens */
  }

  h2 {
    font-size: 1.5em; /* Adjust size for smaller screens */
  }

  .category {
    width: 80%; /* Adjust category width for smaller screens */
  }

  .category h3 {
    font-size: 1.3em; /* Adjust size for smaller screens */
  }

  .category li a {
    font-size: 1em; /* Adjust size for smaller screens */
  }
}
</style>
