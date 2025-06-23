import { createApp } from 'vue'
import './vue-feature-flags';
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

// 🔁 Fallback por si falla un chunk (CSS o JS) cargado de forma dinámica
window.addEventListener('error', (e) => {
  const target = e.target as HTMLLinkElement | HTMLScriptElement;
  if (target?.tagName === 'LINK' || target?.tagName === 'SCRIPT') {
    console.warn('[Chunk error] Forzando recarga...');
    window.location.replace(window.location.origin + window.location.pathname);
  }
}, true);

// Ahora se inicializa la app
createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
