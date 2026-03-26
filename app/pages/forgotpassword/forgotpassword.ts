import '@diniz/webcomponents';
import '../login/login.css';
import './forgotpassword.css';
import { getFormValues, http, queryElement, validateForm, type UIButton, type UIInput } from '@diniz/webcomponents';
import template from './forgotpassword.html?raw';
import { getFirstValidationError } from '../shared/formValidation';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';

type ForgotResult = { success: true } | { success: false; error: string };

export class ForgotPasswordPage extends HTMLElement {
    connectedCallback(): void {
        this.innerHTML = template;

        customElements.whenDefined('ui-input').then(() => {
            this.bindEvents();
        });
    }

    private bindEvents(): void {
        const form = queryElement<HTMLFormElement>(this, '#forgotForm');
        const emailInput = queryElement<UIInput>(this, '#email');

        form?.addEventListener('submit', (e) => this.handleSubmit(e));
        emailInput?.addEventListener('input', () => this.clearError());
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const form = queryElement<HTMLFormElement>(this, '#forgotForm');
        const submitBtn = queryElement<UIButton>(this, '#submitBtn');
        const errorMessage = queryElement<HTMLDivElement>(this, '#errorMessage');

        if (!form || !submitBtn || !errorMessage) return;

        const validation = validateForm(form);
        if (!validation.isValid) {
            showFormError(errorMessage, getFirstValidationError(validation.errors), { mode: 'class', className: 'visible' });
            return;
        }

        const values = getFormValues(form);
        const email = typeof values.email === 'string' ? values.email.trim() : '';

        if (!email) {
            showFormError(errorMessage, 'Please enter your email address', { mode: 'class', className: 'visible' });
            return;
        }

        submitBtn.isProcessing = true;

        try {
            const result = await http.post<ForgotResult>('/api/forgotpassword', { email });

            if (result.success) {
                this.showSuccess();
            } else {
                showFormError(errorMessage, (result as any).error || 'Something went wrong. Please try again.', { mode: 'class', className: 'visible' });
            }
        } catch {
            showFormError(errorMessage, 'Something went wrong. Please try again.', { mode: 'class', className: 'visible' });
        } finally {
            submitBtn.isProcessing = false;
        }
    }

    private showSuccess(): void {
        queryElement<HTMLElement>(this, '#formSection')!.style.display = 'none';
        queryElement<HTMLElement>(this, '#successSection')!.style.display = '';
    }

    private clearError(): void {
        const errorMessage = queryElement<HTMLDivElement>(this, '#errorMessage');
        if (errorMessage) {
            clearFormError(errorMessage, { mode: 'class', className: 'visible' });
        }
    }
}

customElements.define('forgot-password-page', ForgotPasswordPage);
