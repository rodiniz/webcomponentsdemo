import '@diniz/webcomponents';
import dashboardTemplate from './dashboard.html?raw';
import { createRouter, getIconSvg, UILayoutSidebar } from '@diniz/webcomponents';

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
			], {
				outlet:   '#dashboard-outlet', 
				basePath: '/dashboard',        
			});
		
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
