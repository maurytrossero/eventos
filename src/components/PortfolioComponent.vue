<template>
    <div class="portfolio">
      <header class="portfolio-header">
        <h1>{{ developer.name }}</h1>
        <p>{{ developer.description }}</p>
      </header>
      <section class="portfolio-info">
        <h2>Información Personal</h2>
        <div class="info-container">
          <img :src="developer.profileImage" alt="Foto de perfil" class="profile-image" />
          <ul>
            <li><strong>Nombre:</strong> {{ developer.name }}</li>
            <li><strong>Edad:</strong> {{ developer.age }} años</li>
            <li><strong>Ubicación:</strong> {{ developer.location }}</li>
            <li><strong>Educación:</strong> {{ developer.education }}</li>
          </ul>
        </div>
      </section>
      <section class="portfolio-skills">
        <h2>Habilidades</h2>
        <ul>
          <li v-for="skill in developer.skills" :key="skill">{{ skill }}</li>
        </ul>
      </section>
      <section class="portfolio-experience">
        <h2>Experiencia</h2>
        <div class="experience-container">
          <div v-for="experience in developer.experience" :key="experience.id" class="experience-card">
            <h3>{{ experience.role }}</h3>
            <p><strong>Empresa:</strong> {{ experience.company }}</p>
            <p><strong>Período:</strong> {{ experience.period }}</p>
            <p>{{ experience.description }}</p>
          </div>
        </div>
      </section>
      <section class="portfolio-projects">
        <h2>Proyectos</h2>
        <div class="projects-container">
          <div v-for="project in developer.projects" :key="project.id" class="project-card">
            <img :src="project.image" :alt="project.title" />
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <a :href="project.link" target="_blank">Ver proyecto</a>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: "PortfolioComponent",
    data() {
      return {
        developer: {
          name: "Mauricio Trossero",
          age: 32,
          location: "Freyre, Córdoba, Argentina",
          education: "Ingeniería en Sistemas de Información, UTN Facultad Regional San Francisco",
          description: "Desarrollador web con experiencia en frontend y backend, apasionado por crear aplicaciones modernas y eficientes.",
          profileImage: "https://scontent.fcor3-1.fna.fbcdn.net/v/t1.6435-9/32924359_10213574185642989_3996897115413413888_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeE2J39ylYjG2-AP_j9DqltwcrBKqmSGEcBysEqqZIYRwOx_2ej6c9gM60pTR7Jc1ZM&_nc_ohc=uMZjeG9iOUgQ7kNvgEdB1b2&_nc_ht=scontent.fcor3-1.fna&gid=AUX-i_uBsPFGNg0fJs5wUZk&oh=00_AYCseAtqtr5jr7bZSqYtKflT5ZVlxrehZeVzFcmNca9qfA&oe=66D30F11", // URL de la foto de perfil
          skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Vue.js",
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "MySQL",
            "Git",
            "Docker",
            // Añadir más habilidades según sea necesario
          ],
          experience: [
            {
              id: 1,
              role: "Desarrollador Full Stack",
              company: "Tech Solutions",
              period: "Enero 2020 - Actualidad",
              description: "Desarrollo de aplicaciones web utilizando tecnologías modernas como Vue.js y Node.js, trabajando tanto en el frontend como en el backend.",
            },
            {
              id: 2,
              role: "Desarrollador Frontend",
              company: "Web Creatives",
              period: "Junio 2017 - Diciembre 2019",
              description: "Creación de interfaces de usuario atractivas y responsivas utilizando HTML, CSS y JavaScript.",
            },
            // Añadir más experiencias según sea necesario
          ],
          projects: [
            {
              id: 1,
              title: "Proyecto A",
              description: "Descripción del Proyecto A.",
              image: "https://via.placeholder.com/300",
              link: "https://example.com/proyecto-a",
            },
            {
              id: 2,
              title: "Proyecto B",
              description: "Descripción del Proyecto B.",
              image: "https://via.placeholder.com/300",
              link: "https://example.com/proyecto-b",
            },
            // Añadir más proyectos según sea necesario
          ],
        },
      };
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  
  .portfolio {
    font-family: 'Roboto', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f7fa;
  }
  
  .portfolio-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .portfolio-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  .portfolio-header p {
    font-size: 1.2rem;
    color: #666;
  }
  
  .portfolio-info,
  .portfolio-skills,
  .portfolio-experience,
  .portfolio-projects {
    margin-bottom: 40px;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .portfolio-info h2,
  .portfolio-skills h2,
  .portfolio-experience h2,
  .portfolio-projects h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #007bff;
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 3px solid #007bff;
    margin-bottom: 20px;
  }
  
  .portfolio-info ul,
  .portfolio-skills ul {
    list-style-type: none;
    padding: 0;
  }
  
  .portfolio-info ul li,
  .portfolio-skills ul li {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  .experience-container,
  .projects-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .experience-card,
  .project-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    width: 300px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .experience-card:hover,
  .project-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .experience-card h3,
  .project-card h3 {
    font-size: 1.5rem;
    margin-top: 15px;
    color: #333;
  }
  
  .experience-card p,
  .project-card p {
    font-size: 1rem;
    color: #666;
  }
  
  .project-card img {
    width: 100%;
    border-radius: 8px;
    transition: transform 0.3s;
  }
  
  .project-card img:hover {
    transform: scale(1.05);
  }
  
  .project-card a {
    display: inline-block;
    margin-top: 10px;
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
  
  .project-card a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .info-container {
      flex-direction: column;
      text-align: center;
    }
  
    .experience-card,
    .project-card {
      width: 100%;
    }
  }
  </style>
  