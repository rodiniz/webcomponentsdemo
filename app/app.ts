import './assets/main.css';
import { createRouter, applyTheme } from '@diniz/webcomponents';

const authGuard = () => {
  const token = localStorage.getItem('authToken');
  return token ? true : false;
}
const router = createRouter([
 
  { path: '/dashboard/*', component: 'dashboard-page', load: () => import('./pages/dashboard/dashboard'),
    guard: authGuard
  },
  { path: '/', component: 'login-page', load: () => import('./pages/login/login') },
  { path: '/signup', component: 'signup-page', load: () => import('./pages/signup/signup') },
]);
applyTheme('shadcn');
await router();