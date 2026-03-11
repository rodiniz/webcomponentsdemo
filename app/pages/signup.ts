import '@diniz/webcomponents';
import './signup.css';
import template from './signup.html?raw';
import { getFormValues, http } from '@diniz/webcomponents';

export class SignupPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = template;
        const form = this.querySelector('#signupForm') as HTMLFormElement | null;
        if (!form) {
            console.error('Signup form not found in template.');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const { email, password } = getFormValues(form);
            const result = await http.post('/api/signup', { email, password });
            if (result.success) {
                alert('Signup successful! You can now log in.');
            }
        });
    }
}

customElements.define('signup-page', SignupPage);