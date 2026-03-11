import '@diniz/webcomponents';
import homeTemplate from './home.html?raw';
import { http, queryElement, UIButton } from '@diniz/webcomponents';

export class HomePage extends HTMLElement {
  connectedCallback() {
    if (!this.hasChildNodes()) {
      this.innerHTML = homeTemplate;
    }
    const saveBtn = queryElement<UIButton>(this, 'ui-button');

    saveBtn?.addEventListener('click', async (event: MouseEvent) => {
      const response = await http.get('/api/hello');
      console.log('API response:', response);     
    });
  }
}   

customElements.define('home-page', HomePage);