import '@diniz/webcomponents';
import dashboardTemplate from './dashboard.html?raw';
import './dashboard.css';
import { createRouter, getIconSvg } from '@diniz/webcomponents';

export class DashboardPage extends HTMLElement {
	connectedCallback(): void {
		this.expandToViewport();

		if (!this.hasChildNodes()) this.innerHTML = dashboardTemplate;

		const rootLayout = this.querySelector('ui-layout');
		if (rootLayout instanceof HTMLElement) {
			rootLayout.style.width = '100%';
			rootLayout.style.height = '100%';
			rootLayout.style.minHeight = '100vh';
		}
		
		 const icons = this.querySelectorAll('[data-feather]');
		 icons.forEach(icon => {
			 const name = icon.getAttribute('data-feather');	
			 if (name) {
				 const svg =getIconSvg(name);
				 if (svg) {
					 icon.innerHTML = svg;
				 } else {
					 console.warn(`Feather icon "${name}" not found.`);
				 }
				}
			});

		
		 createRouter([
			 { path: '/categories', component: 'list-categories-page', load: () => import('../category/listCategories') },		
			 { path: '/categories/save', component: 'save-category-page', load: () => import('../category/savecategory') },
			 { path: '/categories/:id', component: 'save-category-page', load: () => import('../category/savecategory') },
			 { path: '/expenses', component: 'list-expenses-page', load: () => import('../expenses/listexpenses') },
			 { path: '/expenses/save', component: 'save-expense-page', load: () => import('../expenses/saveexpense') },
			 { path: '/expenses/:id', component: 'save-expense-page', load: () => import('../expenses/saveexpense') },
			 { path: '/incomes', component: 'list-income-page', load: () => import('../income/listincome') },
			 { path: '/incomes/save', component: 'save-income-page', load: () => import('../income/saveincome') },
			 { path: '/incomes/:id', component: 'save-income-page', load: () => import('../income/saveincome') }
			], {
				outlet:   '#dashboard-outlet', 
				basePath: '/dashboard',        
			});

		const updateActiveLinks = () => {
			this.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach(link => {
				const isActive = window.location.pathname.startsWith(link.getAttribute('href') ?? '');
				link.classList.toggle('active', isActive);
			});
		};
		updateActiveLinks();
		window.addEventListener('popstate', updateActiveLinks);
		
	}

	private expandToViewport(): void {
		this.style.display = 'block';
		this.style.width = '100vw';
		this.style.height = '100vh';
		this.style.maxWidth = 'none';

		const appRoot = document.getElementById('app');
		if (appRoot) {
			appRoot.style.width = '100vw';
			appRoot.style.height = '100vh';
			appRoot.style.maxWidth = 'none';
			appRoot.style.padding = '0';
			appRoot.style.margin = '0';
			appRoot.style.textAlign = 'left';
		}

		document.body.style.display = 'block';
		document.body.style.minHeight = '100vh';
		document.body.style.margin = '0';
	}
}

customElements.define('dashboard-page', DashboardPage);
