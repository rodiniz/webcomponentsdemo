import './assets/main.css';
import { createRouter, applyTheme } from '@diniz/webcomponents';

const router = createRouter([
 
  { path: '/home', component: 'dashboard-page', load: () => import('./pages/dashboard/dashboard'),
    guard: () => {
      const token = localStorage.getItem('authToken');
      return token ? true : false;
    }
  },
  { path: '/', component: 'login-page', load: () => import('./pages/login/login') },
  { path: '/signup', component: 'signup-page', load: () => import('./pages/signup/signup') },
]);
applyTheme('shadcn');
await router();