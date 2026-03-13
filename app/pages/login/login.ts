import '@diniz/webcomponents';
import './login.css';
import { getFormValues, http, queryElement, validateForm, type UIButton, type UIInput } from '@diniz/webcomponents';
import template from './login.html?raw';
import { getFirstValidationError } from '../shared/formValidation';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';
type AuthResult = { success: true; message: string, token: string } | { success: false; error: string };

interface FormElements {
  form: HTMLFormElement;
  emailInput: UIInput;
  passwordInput: UIInput;
  submitBtn: UIButton;
  errorMessage: HTMLDivElement;
}

export class LoginPage extends HTMLElement {
  private elements: FormElements | null = null;

  connectedCallback(): void {
    this.innerHTML = template;

    customElements.whenDefined('ui-input').then(() => {
      this.elements = this.getFormElements();
      if (!this.elements) {
        console.error('Failed to initialize login page: required markup not found.');
        return;
      }
      this.bindEvents();
    });
  }

  private getFormElements(): FormElements | null {
    const form = queryElement<HTMLFormElement>(this, '#loginForm');
    const emailInput = queryElement<UIInput>(this, '#email');
    const passwordInput = queryElement<UIInput>(this, '#password');
    const submitBtn = queryElement<UIButton>(this, '#submitBtn');
    const errorMessage = queryElement<HTMLDivElement>(this, '#errorMessage');

    if (!form || !emailInput || !passwordInput || !submitBtn || !errorMessage) {
      return null;
    }

    return { form, emailInput, passwordInput, submitBtn, errorMessage };
  }

  private bindEvents(): void {
    if (!this.elements) return;

    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.elements.emailInput.addEventListener('input', () => this.clearError());
    this.elements.passwordInput.addEventListener('input', () => this.clearError());
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.elements) return;

    const validation = validateForm(this.elements.form);
    if (!validation.isValid) {
      this.showError(getFirstValidationError(validation.errors));
      return;
    }

    const values = getFormValues(this.elements.form);
    const email = typeof values.email === 'string' ? values.email.trim() : '';
    const password = typeof values.password === 'string' ? values.password.trim() : '';

    if (!email || !password) {
      this.showError('Please enter email and password');
      return;
    }

    this.setSubmitLoading(true);

    try {
      const result = await this.authenticateUser({ email, password });
      
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        window.location.href = '/dashboard';
      } else {
        this.showError(result.error);
      }
    } finally {
      this.setSubmitLoading(false);
    }
  }

  private async authenticateUser(credentials: { email: string; password: string }): Promise<AuthResult> {
    return await  http.post<AuthResult>('/api/signin', credentials);    
  }

  private showError(message: string): void {
    if (!this.elements) return;
    showFormError(this.elements.errorMessage, message, { mode: 'class', className: 'visible' });
  }

  private clearError(): void {
    if (!this.elements) return;
    clearFormError(this.elements.errorMessage, { mode: 'class', className: 'visible' });
  }

  private setSubmitLoading(loading: boolean): void {
    if (!this.elements) return;
    this.elements.submitBtn.isProcessing = loading;
  }
}

customElements.define('login-page', LoginPage);
