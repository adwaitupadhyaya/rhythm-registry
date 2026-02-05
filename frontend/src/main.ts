import './styles/main.css';
import Router from './utils/router';
import { renderLogin } from './pages/login';
import { renderRegister } from './pages/register';
import { renderDashboard } from './pages/dashboard';
import type { Route } from './types';

const routes: Route[] = [
  {
    path: '/',
    component: renderLogin,
    requiresAuth: false,
    redirectIfAuth: '/dashboard',
  },
  {
    path: '/register',
    component: renderRegister,
    requiresAuth: false,
    redirectIfAuth: '/dashboard',
  },
  {
    path: '/dashboard',
    component: renderDashboard,
    requiresAuth: true,
    allowedRoles: ['super_admin', 'artist_manager', 'artist'],
  },
];

// Initialize router
const router = new Router(routes);

// Handle auth logout event
window.addEventListener('auth:logout', () => {
  router.navigate('/');
});

console.log('🎵 Rhythm Registry initialized');
