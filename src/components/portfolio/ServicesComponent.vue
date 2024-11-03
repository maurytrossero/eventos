<template>
    <div class="services">
      <h2 class="services-title">Nuestros Servicios</h2>
      <div class="service-list">
        <div class="service-item" v-for="service in services" :key="service.id">
          <div class="icon-container">
            <img :src="service.icon" alt="" class="service-icon" />
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const services = [
    { 
      id: 1, 
      title: 'Fotografía de Eventos', 
      description: 'Capturamos los momentos más importantes de tu vida con un enfoque artístico y profesional.', 
      icon: 'https://example.com/icon1.png' 
    },
    { 
      id: 2, 
      title: 'Producción Audiovisual', 
      description: 'Creamos videos de alta calidad para tus proyectos personales o profesionales.', 
      icon: 'https://example.com/icon2.png' 
    },
    { 
      id: 3, 
      title: 'Fotografía de Productos', 
      description: 'Presenta tus productos de la mejor manera con imágenes profesionales que resaltan cada detalle.', 
      icon: 'https://example.com/icon3.png' 
    },
    { 
      id: 4, 
      title: 'Videos Institucionales', 
      description: 'Refleja la esencia de tu empresa con videos corporativos de alta calidad.', 
      icon: 'https://example.com/icon4.png' 
    },
    // Más servicios si es necesario
  ];
  </script>
  
  <style scoped>
  .services {
    padding: 60px 20px;
    background-color: #2a2a2a;
    color: #ffffff;
  }
  
  .services-title {
    text-align: center;
    color: #00b0ff; /* Azul eléctrico más suave */
    font-size: 2.5rem;
    margin-bottom: 40px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  
  .service-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .service-item {
    background-color: #333;
    border-radius: 10px;
    padding: 20px;
    width: 280px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  .service-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  }
  
  .icon-container {
    margin-bottom: 15px;
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
  }
  
  .service-title {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #00b0ff;
  }
  
  .service-description {
    font-size: 1rem;
    color: #cccccc;
  }
  
  @media (max-width: 768px) {
    .service-item {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  </style>
  