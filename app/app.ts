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
  { path: '/forgot-password', component: 'forgot-password-page', load: () => import('./pages/forgotpassword/forgotpassword') },
  { path: '/reset-password', component: 'reset-password-page', load: () => import('./pages/resetpassword/resetpassword') },
]);
applyTheme('shadcn');
await router();