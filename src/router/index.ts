import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PortfolioView from '../views/PortfolioView.vue';
import InvitationView from '../views/InvitationView.vue';
import AuthCallback from '@/components/AuthCallback.vue';
import SongsList from '@/views/SongsList.vue';
import MapaDeMesasView from '@/views/MapaDeMesasView.vue';
import GestionMesasInvitados from '../components/GestionMesasInvitados.vue';
import EventosComponent from '../components/EventosComponent.vue';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home-view',
    component: HomeView
  },
  {
    path: '/inicio',
    name: 'Inicio',
    component: PortfolioView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/auth/instagram/callback',
    name: 'auth-callback',
    component: AuthCallback
  },
  {
    path: '/invitacion',
    name: 'invitacion-virtual',
    component: InvitationView
  },
  {
    path: '/musica',
    name: 'songs-list',
    component: SongsList
  },
  {
    path: '/eventos/:eventoId/canciones',
    name: 'eventos-canciones', // Asegúrate de tener un nombre único aquí
    component: SongsList // Componente que se renderizará
  },
  
  {
    path: '/mesas',
    name: 'MapaDeMesas',
    component: MapaDeMesasView
  },
  {
    path: '/gestion',
    component: GestionMesasInvitados
  },
  {
    path: '/evento/:eventoId',
    name: 'evento',
    component: EventosComponent,
    props: true
  },
  {
    path: '/eventos',
    name: 'Eventos',
    component: () => import('@/components/EventosComponent.vue')
  },
  {
    path: '/eventos/lista',
    name: 'ListaEventos',
    component: () => import('@/components/ListaEventos.vue')
  },
  // Mantén solo una definición para la ruta de detalle del evento
  {
    path: '/eventos/:eventoId',
    name: 'EventoDetalle',
    component: () => import('@/components/EventoDetalle.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
