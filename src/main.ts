import { createApp } from 'vue'
import './vue-feature-flags';
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

// Registrar íconos
library.add(faVolumeUp, faVolumeMute)

// Crear app
const app = createApp(App)

// Usar Pinia y Router
app.use(createPinia())
app.use(router)

// Registrar componente global
app.component('font-awesome-icon', FontAwesomeIcon)

// Listener para recarga si falla chunk
window.addEventListener('error', (e) => {
  const target = e.target as HTMLLinkElement | HTMLScriptElement;
  if (target?.tagName === 'LINK' || target?.tagName === 'SCRIPT') {
    console.warn('[Chunk error] Forzando recarga...');
    window.location.replace(window.location.origin + window.location.pathname);
  }
}, true);

// Montar app
app.mount('#app')
