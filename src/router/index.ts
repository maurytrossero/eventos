import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'

// Vistas principales
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import PanelView from '@/views/PanelView.vue'

// Autenticación
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import AuthCallback from '@/components/AuthCallback.vue'

// Eventos
import EventosComponent from '@/components/EventosComponent.vue'
import ListaEventos from '@/components/ListaEventos.vue'
import EventoDetalle from '@/components/EventoDetalle.vue'

// Música y multimedia
import SongsList from '@/views/SongsList.vue'
import GalleryView from '@/views/GalleryView.vue'
import ModerateView from '@/views/ModerateView.vue'
import InvitationView from '@/views/InvitationView.vue'
import TriviaView from '@/views/TriviaView.vue'

// E-commerce
import PricingView from '@/views/PricingView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import AccountView from '@/views/AccountView.vue'
import HelpView from '@/views/HelpView.vue'

// Vista de acceso denegado
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },

  // Autenticación
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/auth/instagram/callback', name: 'auth-callback', component: AuthCallback },

  // Panel
  { path: '/panel', name: 'panel', component: PanelView, meta: { requiresAuth: true } },

  // Eventos
  { path: '/eventos', name: 'eventos-crear', component: EventosComponent, meta: { requiresAuth: true } },
  { path: '/eventos/lista', name: 'eventos-lista', component: ListaEventos, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/evento/:eventoId/detalle', name: 'evento-detalle', component: EventoDetalle, props: true },
  { path: '/evento/:eventoId/editar', name: 'evento-editar', component: EventoDetalle, props: true,   meta: { requiresAuth: true } },
  { path: '/evento/:eventoId/moderar', name: 'evento-moderar', component: ModerateView, props: true },
  { path: '/evento/:eventoId/trivia', name: 'evento-trivia', component: TriviaView, props: true },
  { path: '/evento/:eventoId/galeria', name: 'evento-galeria', component: GalleryView, props: true },

  // Música
  { path: '/evento/:eventoId/canciones', name: 'evento-canciones', component: SongsList, props: true },

  // Invitación
  { path: '/evento/:eventoId/invitacion', name: 'evento-invitacion', component: InvitationView, props: true },
  { path: '/evento/:eventoId/invitacion/galeria-interactiva', name: 'evento-galeria-interactiva', component: GalleryView, props: true },
  { path: '/evento/:eventoId/invitacion/moderar-galeria-interactiva', name: 'evento-moderar-galeria-interactiva', component: ModerateView, props: true },
  { path: '/invitacion/:slug', name: 'invitacion-slug', component: InvitationView, props: true },

  // E-commerce
  { path: '/precios', name: 'precios', component: PricingView },
  { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/cuenta', name: 'cuenta', component: AccountView, meta: { requiresAuth: true } },
  { path: '/ayuda', name: 'ayuda', component: HelpView, meta: { requiresAuth: true } },

  // Acceso denegado
  { path: '/no-autorizado', name: 'no-autorizado', component: UnauthorizedView },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Protección de rutas con roles y login
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Esperar a que cargue el estado de usuario
  if (authStore.loadingUser) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(
        () => authStore.loadingUser,
        (loaded) => {
          if (!loaded) {
            unwatch()
            resolve()
          }
        }
      )
    })
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // Redirigir a login si no está logueado
  if (requiresAuth && !authStore.isLoggedIn) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Redirigir si no es admin
  if (requiresAdmin && !authStore.isAdmin) {
    return next('/no-autorizado')
  }

  // Redirigir a /panel si ya está logueado y va a login o register
  if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return next('/panel')
  }

  next()
})

export default router
