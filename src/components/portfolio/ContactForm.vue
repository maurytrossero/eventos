<template>
  <div class="contact-section">
    <div class="contact-form">
      <h2>Contáctanos</h2>
      <form ref="contactForm" @submit.prevent="handleSubmit">
        <label for="name">Nombre:</label>
        <input type="text" id="name" v-model="form.name" required />

        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="form.email" required />

        <label for="message">Mensaje:</label>
        <textarea id="message" v-model="form.message" required></textarea>

        <button type="submit">Enviar</button>
      </form>
    </div>

    <div class="social-icons">
      <a href="https://www.facebook.com/mtproduccioneshd/" target="_blank" class="social-icon facebook"></a>
      <a href="https://www.instagram.com/mtproducciones.ok/" target="_blank" class="social-icon instagram"></a>
      <a href="https://wa.me/3564607490?text=Hola, quisiera más información" target="_blank" class="social-icon whatsapp"></a>
      <a href="https://www.tiktok.com/@mauritrossero" target="_blank" class="social-icon tiktok"></a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import emailjs from 'emailjs-com';

const form = ref({
  name: '',
  email: '',
  message: ''
});

const contactForm = ref(null);

const handleSubmit = () => {
  const templateParams = {
    from_name: form.value.name,
    from_email: form.value.email,
    message: form.value.message
  };

  emailjs.send('service_0r6axze', 'template_qltwbpm', templateParams, '7xvunViHmNAoSKloK')
    .then(() => {
      alert('Correo enviado con éxito!');
      form.value.name = '';
      form.value.email = '';
      form.value.message = '';
    })
    .catch((error) => {
      console.error('Error al enviar el correo:', error);
      alert(`Hubo un problema al enviar el correo. Detalles: ${error.text || 'No se puede mostrar más detalles del error'}`);
    });
};

</script>

<style scoped>
.contact-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f0f0f0; /* Fondo más claro para mejor contraste */
  min-height: 100vh;
  box-sizing: border-box;
}

.contact-form {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

.contact-form h2 {
  margin-bottom: 20px;
  color: #333; /* Contraste más alto para los encabezados */
  font-family: 'Arial', sans-serif; /* Fuente diferente para encabezados */
}

.contact-form label {
  display: block;
  margin: 10px 0 5px;
  color: #555;
  font-family: 'Arial', sans-serif;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px; /* Espaciado más amplio */
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.contact-form textarea {
  resize: vertical;
  height: 150px;
}

.contact-form button {
  width: 100%;
  padding: 12px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.contact-form button:hover {
  background-color: #0056b3;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 2rem;
  margin-top: 20px;
}

.social-icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.2); /* Aumenta el brillo al pasar el ratón */
}

.facebook {
  background-image: url('https://e7.pngegg.com/pngimages/335/1001/png-clipart-social-media-facebook-computer-icons-social-network-linkedin-text-logo-internet.png');
}

.whatsapp {
  background-image: url('https://e7.pngegg.com/pngimages/347/373/png-clipart-computer-icons-whatsapp-whatsapp-text-trademark-thumbnail.png');
}

.instagram {
  background-image: url('https://e7.pngegg.com/pngimages/722/1011/png-clipart-logo-icon-instagram-logo-instagram-logo-purple-violet-thumbnail.png');
}

.tiktok {
  background-image: url('https://e7.pngegg.com/pngimages/449/200/png-clipart-tiktok-icon-tech-companies-thumbnail.png');
}

@media (max-width: 768px) {
  .contact-section {
    padding: 20px;
  }

  .contact-form {
    padding: 20px;
    margin-bottom: 20px;
  }

  .contact-form input,
  .contact-form textarea {
    padding: 8px;
  }

  .contact-form button {
    padding: 10px;
  }

  .social-icons {
    margin-top: 20px;
  }
}
</style>
