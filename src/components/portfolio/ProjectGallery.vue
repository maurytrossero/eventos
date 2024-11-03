<template>
  <div class="project-gallery">
    <div class="overlay">
      <h2 class="gallery-title">Mi Portafolio</h2>

      <!-- Sección: Eventos Sociales -->
      <div class="gallery-section">
        <h3 class="section-title">Eventos Sociales</h3>
        <div class="gallery">
          <div v-for="project in eventsProjects" :key="project.id" class="gallery-item" @click="openViewer(project.image)">
            <img :src="project.image" :alt="project.title" />
            <h4>{{ project.title }}</h4>
          </div>
        </div>
      </div>

      <!-- Sección: Fotografía de Productos -->
      <div class="gallery-section">
        <h3 class="section-title">Fotografía de Productos</h3>
        <div class="gallery">
          <div v-for="project in productProjects" :key="project.id" class="gallery-item" @click="openViewer(project.image)">
            <img :src="project.image" :alt="project.title" />
            <h4>{{ project.title }}</h4>
          </div>
        </div>
      </div>

      <!-- Sección: Videos Institucionales -->
      <div class="gallery-section">
        <h3 class="section-title">Videos Institucionales</h3>
        <div class="gallery">
          <div v-for="project in institutionalProjects" :key="project.id" class="gallery-item">
            <iframe
              :src="`https://www.youtube.com/embed/${project.videoId}`"
              frameborder="0"
              allowfullscreen
              class="video-frame"
            ></iframe>
            <h4>{{ project.title }}</h4>
          </div>
        </div>
      </div>

      <!-- Sección: Fotografía y Videos Aéreos -->
      <div class="gallery-section">
        <h3 class="section-title">Fotografía y Videos Aéreos</h3>
        <div class="gallery">
          <div v-for="project in aerialProjects" :key="project.id" class="gallery-item" @click="openViewer(project.image)">
            <img :src="project.image" :alt="project.title" />
            <h4>{{ project.title }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Visor de Imagen -->
    <div v-if="isViewerOpen" class="image-viewer" @click.self="closeViewer">
      <span class="close-btn" @click="closeViewer">&times;</span>
      <img
        :src="currentImage"
        class="viewer-image"
        ref="viewerImage"
        @wheel="zoomImage"
        @mouseover="startZoom"
        @mouseleave="stopZoom"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const eventsProjects = [
  { id: 1, title: 'Bodas', image: 'https://www.dropbox.com/scl/fi/d7o2s2gijpxbqmyaggb1s/DSC_2841.jpg?rlkey=dn4dq7yonbhb7hxjvh65zojkr&st=trs9ulfz&raw=1' },
  { id: 2, title: 'Fiesta de 15 Años', image: 'https://www.dropbox.com/scl/fi/eqfsqr0v5syzcn90s1p1o/quince-a-os.jpg?rlkey=gjw3azk9prno5uafh6ztrv9np&st=tmwq8l82&raw=1' },
  { id: 3, title: 'Egresos', image: 'https://www.dropbox.com/scl/fi/mgrx0kadoywuc75vjz7xw/egreso1.jpg?rlkey=pv0b16n9k4cwf8yix7nmxf51a&st=c6534wlc&raw=1' }
];

const productProjects = [
  { id: 3, title: 'Fotografía de Producto', image: 'https://www.dropbox.com/scl/fi/gkkuk6j67vptnv43idd7r/DSC_1510.jpg?rlkey=ewry4iydjf7tg6sy8isl9vzn2&st=oz1kvhl5&raw=1' },
  { id: 4, title: 'Fotografía de Producto', image: 'https://www.dropbox.com/scl/fi/q6k3l195aiudsmaaiz73i/DSC_1376.jpg?rlkey=c8o8kms6k7x3g2r4wr3sys392&st=nip8ooxq&raw=1' },
  { id: 5, title: 'Fotografía de Producto', image: 'https://www.dropbox.com/scl/fi/l84krppwbdos8rc2q2j30/DSC_1262.jpg?rlkey=684ablwnqa0o1jp6jhua06fjo&st=m5ygfccp&raw=1' },
  { id: 6, title: 'Fotografía Gastronómica', image: 'https://www.dropbox.com/scl/fi/z2yxgmx2xt5n2whhb7sy5/producto1.jpg?rlkey=ayjrutn4p7gfs2rledee1o2dq&st=2a3pi8xa&raw=1' },
  { id: 7, title: 'Fotografía Gastronómica', image: 'https://www.dropbox.com/scl/fi/wh1bu25ym74riue12oufy/producto4.jpg?rlkey=903d1ly3bjmhp77nmv3c57hrb&st=x8wehih5&raw=1' },
  { id: 8, title: 'Fotografía Gastronómica', image: 'https://www.dropbox.com/scl/fi/pd55s3a779u230e0k6plp/producto3.jpg?rlkey=0b224l07iyx7lsmdl200234nl&st=7621hirg&raw=1' }


];

const institutionalProjects = [
  { id: 1, title: 'Video Publicitario', videoId: 'Erne885LLwU' },
  { id: 2, title: 'Video Entrevista', videoId: 'AauokHOTBvs' }
];

const aerialProjects = [
  { id: 7, title: 'Axion Freyre', image: 'https://www.dropbox.com/scl/fi/d56ik6joirj0ns0d80s0m/axion2.jpg?rlkey=byfn0uncipahmaj3isq2hhpuq&st=jz4kkta7&raw=1' },
  { id: 8, title: 'Estadio Mario Alberto Kempes', image: 'https://www.dropbox.com/scl/fi/g6yvj29gbtymue8hcr8mq/estadio-kempes.jpg?rlkey=napgyqztr2x1lxo5b8pkectxo&st=4108guai&raw=1' },
  { id: 9, title: 'Miramar de Ansenuza', image: 'https://www.dropbox.com/scl/fi/ubxehtsgkhfiu6wth1il9/miramar.jpg?rlkey=cck7x4ph09ktssbef22s4tvho&st=ax1h0te1&raw=1' }

];

const isViewerOpen = ref(false);
const currentImage = ref('');
const isZooming = ref(false);

function openViewer(imageSrc) {
  currentImage.value = imageSrc;
  isViewerOpen.value = true;
}

function closeViewer() {
  isViewerOpen.value = false;
}

function zoomImage(event) {
  event.preventDefault();
  const img = event.target;
  const scale = event.deltaY > 0 ? 0.9 : 1.1;
  img.style.transform = `scale(${(parseFloat(img.style.transform.replace('scale(', '').replace(')', '')) || 1) * scale})`;
}

function startZoom() {
  isZooming.value = true;
}

function stopZoom() {
  isZooming.value = false;
}

</script>

<style scoped>
.project-gallery {
  position: relative;
  padding: 40px;
  background-color: #000;
  background-image: url('https://www.dropbox.com/scl/fi/55ffixug06bri6e1pcx3j/imagen-de-fondo.jpg?rlkey=yhxxjdb9hekuu9hoy1nj4q3bi&st=h2liln5y&raw=1'); /* Cambia esta URL por la de tu imagen de fondo */
  background-size: cover;
  background-position: center;
  margin-top: 80px; /* Añade margen superior para evitar solapamiento */
  margin-bottom: 80px; /* Añade margen inferior para evitar solapamiento */
}

.overlay {
  background: rgba(0, 0, 0, 0.9); /* Fondo con opacidad para overlay */
  border-radius: 15px; /* Bordes redondeados para el overlay */
  padding: 20px;
  border: 2px solid #00f;

}

.gallery-title {
  text-align: center;
  color: #00f;
  font-size: 2.5rem;
  margin-bottom: 50px;
}

.gallery-section {
  margin-bottom: 50px;
}

.section-title {
  text-align: center;
  color: #00f;
  font-size: 2rem;
  margin-bottom: 20px;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.gallery-item {
  margin: 15px;
  width: 300px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  transition: transform 0.2s ease;
}

.video-frame {
  width: 100%;
  height: 315px;
  border: none;
}

.gallery-item h4 {
  margin-top: 10px;
  color: #fff;
}

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.viewer-image {
  max-width: 90%;
  max-height: 90%;
  transition: transform 0.2s ease;
}

.viewer-image:hover {
  transform: scale(1.05);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 768px) {
  .project-gallery {
    margin-top: 60px; /* Ajustar margen superior para dispositivos móviles */
    margin-bottom: 60px; /* Ajustar margen inferior para dispositivos móviles */
  }

  .gallery-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .gallery-item {
    width: 100%; /* Ajustar el tamaño en pantallas pequeñas */
  }

  .gallery-item img {
    height: auto;
  }
}
</style>
