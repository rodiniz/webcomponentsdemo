import '@diniz/webcomponents';
import dashboardTemplate from './dashboard.html?raw';

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

		void import('../home').then(() => {
			const outlet = this.querySelector('#dashboardOutlet');
			if (outlet) outlet.innerHTML = '<home-page></home-page>';
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
