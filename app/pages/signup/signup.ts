import '@diniz/webcomponents';
import './signup.css';
import template from './signup.html?raw';
import { getFormValues, http, queryElement, UIToast } from '@diniz/webcomponents';

export class SignupPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = template;
        const form = this.querySelector('#signupForm') as HTMLFormElement | null;
        const toast = this.querySelector('#signupToast') as UIToast;
        const submitBtn = this.querySelector('#submitBtn') as any;
        const errorEl = queryElement<HTMLDivElement>(this, '#errorMessage');

        if (!form) return;

        const showError = (msg: string) => {
            if (!errorEl) return;
            errorEl.textContent = msg;
            errorEl.classList.remove('visible');
            void errorEl.offsetWidth; // reflow to replay shake
            errorEl.classList.add('visible');
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const { name, email, password } = getFormValues(form);

            if (!email || !password) {
                showError('Email and password are required.');
                return;
            }

            if (submitBtn) submitBtn.loading = true;
            try {
                const result = await http.post<{ success: boolean }>('/api/signup', { name, email, password });
                if (result.success) {
                    toast.success('Account created! Redirecting...');
                    setTimeout(() => { window.location.href = '/'; }, 1200);
                } else {
                    showError('Signup failed. Please try again.');
                }
            } catch {
                showError('Something went wrong. Please try again.');
            } finally {
                if (submitBtn) submitBtn.loading = false;
            }
        });
    }
}

customElements.define('signup-page', SignupPage);