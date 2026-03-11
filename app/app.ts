import './assets/main.css';
import { createRouter, applyTheme } from '@diniz/webcomponents';

const router = createRouter([
  { path: '/', component: 'login-page', load: () => import('./pages/login') },
  { path: '/login', component: 'login-page', load: () => import('./pages/login') },
  { path: '/signup', component: 'signup-page', load: () => import('./pages/signup') },
]);
applyTheme('shadcn');
await router();