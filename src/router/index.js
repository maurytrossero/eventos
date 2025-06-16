import { createRouter, createWebHistory } from 'vue-router';
import InvitationView from '../views/InvitationView.vue';
import AuthCallback from '@/components/AuthCallback.vue';
import SongsList from '@/views/SongsList.vue';
import EventosComponent from '../components/EventosComponent.vue';
import HomeView from '../views/HomeView.vue';
const routes = [
    {
        path: '/',
        name: 'Home-view',
        component: HomeView
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
        name: 'eventos-listado',
        component: () => import('@/components/ListaEventos.vue')
    },
    // Mantén solo una definición para la ruta de detalle del evento
    {
        path: '/eventos/:eventoId/invitacion',
        name: 'evento-invitacion',
        component: () => import('@/views/InvitationView.vue'),
        props: true
    },
    {
        path: '/eventos/:eventoId',
        name: 'EventoDetalle',
        component: () => import('@/components/EventoDetalle.vue')
    },
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
export default router;
//# sourceMappingURL=index.js.map