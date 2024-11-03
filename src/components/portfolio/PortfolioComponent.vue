<template>
    <div class="portfolio">
      <HeaderLogo />
      <Introduction id="introduction" />
      <ProjectGallery id="project-gallery" />
      <Services id="services" />
      <Testimonials id="testimonials" />
      <ContactForm id="contact-form" />
      <div class="scroll-buttons">
        <button @click="scrollToSection('introduction')" class="scroll-button up">
          <i class="fas fa-chevron-up"></i>
        </button>
        <button @click="scrollToSection('contact-form')" class="scroll-button down">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import HeaderLogo from '@/components/HeaderLogo.vue'
  import Introduction from '@/components/Introduction.vue'
  import ProjectGallery from '@/components/ProjectGallery.vue'
  import Services from '@/components/Services.vue'
  import Testimonials from '@/components/Testimonials.vue'
  import ContactForm from '@/components/ContactForm.vue'
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  </script>
  
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
  
  .portfolio {
    font-family: 'Arial', sans-serif;
    color: #fff;
    background-color: #000; /* Fondo negro */
    padding: 0;
    margin: 0;
    position: relative;
  }
  
  .scroll-buttons {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
  }
  
  .scroll-button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 15px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .scroll-button i {
    margin: 0;
  }
  
  .scroll-button:hover {
    background-color: #555;
  }
  
  @media (max-width: 768px) {
    .scroll-buttons {
      bottom: 10px;
      gap: 5px;
    }
  
    .scroll-button {
      padding: 10px;
      font-size: 20px;
    }
  }
  </style>
  