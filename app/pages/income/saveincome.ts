import { getFormValues, validateForm } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import template from './saveincome.html?raw';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';
import { getFirstValidationError } from '../shared/formValidation';
import { readEntityId, setFormMode, bindFormCancel, setFieldValue, formatDateValue } from '../shared/formPage';
import { apiGet, apiPost, apiPut } from '../shared/api';

type Income = { id: number; amount: number; description?: string | null; date?: string | null };

export class SaveIncomePage extends HTMLElement {
    private incomeId: number | null = null;

    connectedCallback(): void {
        this.innerHTML = template;
        this.incomeId = readEntityId('/dashboard/incomes/:id');
        setFormMode(this, '#incomeFormTitle', '#saveIncomeBtn', 'Income', this.incomeId !== null);
        bindFormCancel(this, '#cancelIncomeBtn', '/dashboard/incomes');

        const form = this.querySelector('#incomeForm') as HTMLFormElement | null;
        if (form) {
            form.addEventListener('submit', (event) => void this.handleSubmit(event));
        }

        if (this.incomeId !== null) {
            void this.loadIncome(this.incomeId);
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        const form = this.querySelector('#incomeForm') as HTMLFormElement | null;
        if (!form) return;

        const validation = validateForm(form);
        if (!validation.isValid) {
            this.showError(getFirstValidationError(validation.errors));
            return;
        }

        const values = getFormValues(form, { includeEmpty: true });
        const amount = Number(values.amount);
        const description = typeof values.description === 'string' ? values.description.trim() : '';
        const date = values.date;

        if (!Number.isFinite(amount) || amount <= 0) {
            this.showError('Amount must be greater than zero.');
            return;
        }
        if (!date || typeof date !== 'string') {
            this.showError('Date is required.');
            return;
        }

        this.clearError();

        const payload = { amount, description: description || null, date };
        try {
            if (this.incomeId !== null) {
                await apiPut('/api/updateincome', { id: this.incomeId, ...payload });
            } else {
                await apiPost('/api/createincome', payload);
            }
            window.location.href = '/dashboard/incomes';
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Unable to save income.');
        }
    }

    private async loadIncome(id: number): Promise<void> {
        try {
            const data = await apiGet<{ income?: Income }>(`/api/income/${id}`);
            const income = data.income;
            if (!income) {
                this.showError('Income not found.');
                return;
            }
            setFieldValue(this.querySelector('#incomeAmount'), String(income.amount ?? ''));
            setFieldValue(this.querySelector('#incomeDate'), formatDateValue(income.date));
            setFieldValue(this.querySelector('#incomeDescription'), income.description ?? '');
        } catch {
            this.showError('Failed to load income details.');
        }
    }

    private showError(message: string): void {
        const error = this.querySelector('#incomeError') as HTMLDivElement | null;
        showFormError(error, message);
    }

    private clearError(): void {
        const error = this.querySelector('#incomeError') as HTMLDivElement | null;
        clearFormError(error);
    }
}

customElements.define('save-income-page', SaveIncomePage);