import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import InvitationView from '../views/InvitationView.vue'
import AuthCallback from '@/components/AuthCallback.vue'
import SongsList from '@/views/SongsList.vue'
import EventosComponent from '../components/EventosComponent.vue'
import HomeView from '../views/HomeView.vue'
import { getAuth } from 'firebase/auth'

// ✅ NUEVAS IMPORTACIONES
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import PanelView from '@/views/PanelView.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home-view', component: HomeView },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/auth/instagram/callback', name: 'auth-callback', component: AuthCallback },
  { path: '/invitacion', name: 'invitacion-virtual', component: InvitationView },
  { path: '/musica', name: 'songs-list', component: SongsList },
  {
    path: '/eventos/:eventoId/canciones',
    name: 'eventos-canciones',
    component: SongsList
  },
  {
    path: '/evento/:eventoId',
    name: 'evento',
    component: EventosComponent,
    props: true
  },
  { path: '/eventos', name: 'Eventos', component: () => import('@/components/EventosComponent.vue') },
  { path: '/eventos/lista', name: 'eventos-listado', component: () => import('@/components/ListaEventos.vue') },
  {
    path: '/eventos/:eventoId/invitacion',
    name: 'evento-invitacion',
    component: () => import('@/views/InvitationView.vue'),
    props: true
  },
  {
    path: '/eventos/:eventoId/invitacion/galeria-interactiva',
    name: 'evento-galeria-interactiva',
    component: () => import('@/views/GalleryView.vue'),
    props: true
  },
  {
    path: '/eventos/:eventoId/invitacion/moderar-galeria-interactiva',
    name: 'evento-moderar-galeria-interactiva',
    component: () => import('@/views/ModerateView.vue'),
    props: true
  },
  {
    path: '/eventos/:eventoId',
    name: 'EventoDetalle',
    component: () => import('@/components/EventoDetalle.vue')
  },

  // ✅ RUTAS DE AUTENTICACIÓN
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },

  // ✅ PANEL PROTEGIDO
  {
    path: '/panel',
    name: 'panel',
    component: PanelView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// ✅ PROTECCIÓN DE RUTA
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthPage = ['/login', '/register'].includes(to.path)

  if (requiresAuth && !user) {
    // Usuario no autenticado quiere entrar a una ruta protegida
    next('/login')
  } else if (user && isAuthPage) {
    // Usuario autenticado quiere ir a login/register
    next('/panel')
  } else {
    // En cualquier otro caso, dejar pasar
    next()
  }
})


export default router
