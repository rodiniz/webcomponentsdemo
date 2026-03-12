import '@diniz/webcomponents';
import './signup.css';
import template from './signup.html?raw';
import { getFormValues, http, UIToast } from '@diniz/webcomponents';

export class SignupPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = template;
        const form = this.querySelector('#signupForm') as HTMLFormElement | null;
        const toast = this.querySelector('#signupToast') as UIToast;
        if (!form) {
            toast.error('Signup form not found in template.');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const { email, password } = getFormValues(form);
            const result = await http.post('/api/signup', { email, password });
            if (result.success) {
                toast.success('Signup successful! Redirecting to login...');
                window.location.href = '/login';
            }
        });
    }
}

customElements.define('signup-page', SignupPage);