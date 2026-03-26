import '@diniz/webcomponents';
import '../login/login.css';
import '../forgotpassword/forgotpassword.css';
import './resetpassword.css';
import { getFormValues, http, queryElement, validateForm, type UIButton, type UIInput } from '@diniz/webcomponents';
import template from './resetpassword.html?raw';
import { getFirstValidationError } from '../shared/formValidation';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';

type ResetResult = { success: true } | { success: false; error: string };

export class ResetPasswordPage extends HTMLElement {
    private token: string | null = null;

    connectedCallback(): void {
        this.innerHTML = template;

        const params = new URLSearchParams(window.location.search);
        this.token = params.get('token');

        customElements.whenDefined('ui-input').then(() => {
            if (!this.token) {
                this.showInvalidToken();
                return;
            }
            this.bindEvents();
        });
    }

    private bindEvents(): void {
        const form = queryElement<HTMLFormElement>(this, '#resetForm');
        const passwordInput = queryElement<UIInput>(this, '#password');
        const confirmInput = queryElement<UIInput>(this, '#confirmPassword');

        form?.addEventListener('submit', (e) => this.handleSubmit(e));
        passwordInput?.addEventListener('input', () => this.clearError());
        confirmInput?.addEventListener('input', () => this.clearError());
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const form = queryElement<HTMLFormElement>(this, '#resetForm');
        const submitBtn = queryElement<UIButton>(this, '#submitBtn');
        const errorMessage = queryElement<HTMLDivElement>(this, '#errorMessage');

        if (!form || !submitBtn || !errorMessage || !this.token) return;

        const validation = validateForm(form);
        if (!validation.isValid) {
            showFormError(errorMessage, getFirstValidationError(validation.errors), { mode: 'class', className: 'visible' });
            return;
        }

        const values = getFormValues(form);
        const password = typeof values.password === 'string' ? values.password : '';
        const confirmPassword = typeof values.confirmPassword === 'string' ? values.confirmPassword : '';

        if (password.length < 8) {
            showFormError(errorMessage, 'Password must be at least 8 characters', { mode: 'class', className: 'visible' });
            return;
        }

        if (password !== confirmPassword) {
            showFormError(errorMessage, 'Passwords do not match', { mode: 'class', className: 'visible' });
            return;
        }

        submitBtn.isProcessing = true;

        try {
            const result = await http.post<ResetResult>('/api/resetpassword', {
                token: this.token,
                password,
            });

            if (result.success) {
                this.showSuccess();
            } else {
                showFormError(errorMessage, (result as any).error || 'Failed to reset password. The link may have expired.', { mode: 'class', className: 'visible' });
            }
        } catch {
            showFormError(errorMessage, 'Failed to reset password. The link may have expired.', { mode: 'class', className: 'visible' });
        } finally {
            submitBtn.isProcessing = false;
        }
    }

    private showSuccess(): void {
        queryElement<HTMLElement>(this, '#formSection')!.style.display = 'none';
        queryElement<HTMLElement>(this, '#successSection')!.style.display = '';
    }

    private showInvalidToken(): void {
        queryElement<HTMLElement>(this, '#formSection')!.style.display = 'none';
        queryElement<HTMLElement>(this, '#invalidTokenSection')!.style.display = '';
    }

    private clearError(): void {
        const errorMessage = queryElement<HTMLDivElement>(this, '#errorMessage');
        if (errorMessage) {
            clearFormError(errorMessage, { mode: 'class', className: 'visible' });
        }
    }
}

customElements.define('reset-password-page', ResetPasswordPage);
