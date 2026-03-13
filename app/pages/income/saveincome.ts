import { getFormValues, getPathParams, validateForm, UIDatePicker, type UIButton, type UIInput } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import template from './saveincome.html?raw';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';
import { getFirstValidationError } from '../shared/formValidation';

type Income = {
    id: number;
    amount: number;
    description?: string | null;
    date?: string | null;
};

export class SaveIncomePage extends HTMLElement {
    private incomeId: number | null = null;

    connectedCallback(): void {
        this.innerHTML = template;
        this.readRouteParams();
        this.updateFormMode();
        this.bindEvents();

        if (this.incomeId !== null) {
            void this.loadIncome(this.incomeId);
        }
    }

    private readRouteParams(): void {
        const params = getPathParams('/dashboard/incomes/:id', location.pathname);
        if (!params?.id || Number.isNaN(Number(params.id))) {
            this.incomeId = null;
            return;
        }

        this.incomeId = Number(params.id);
    }

    private updateFormMode(): void {
        const title = this.querySelector('#incomeFormTitle');
        const submitBtn = this.querySelector('#saveIncomeBtn') as UIButton | null;

        if (!title || !submitBtn) {
            return;
        }

        if (this.incomeId !== null) {
            title.textContent = 'Edit Income';
            submitBtn.textContent = 'Update Income';
            return;
        }

        title.textContent = 'Create Income';
        submitBtn.textContent = 'Save Income';
    }

    private bindEvents(): void {
        const form = this.querySelector('#incomeForm') as HTMLFormElement | null;
        const cancelBtn = this.querySelector('#cancelIncomeBtn') as UIButton | null;

        if (form) {
            form.addEventListener('submit', (event) => {
                void this.handleSubmit(event);
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                window.location.href = '/dashboard/incomes';
            });
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = this.querySelector('#incomeForm') as HTMLFormElement | null;
        if (!form) {
            return;
        }

        const validation = validateForm(form);
        if (!validation.isValid) {
            this.showError(getFirstValidationError(validation.errors));
            return;
        }

        const values = getFormValues(form, { includeEmpty: true });

        const amountRaw = values.amount;
        const amount = Number(amountRaw);
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

        const payload = {
            amount,
            description: description || null,
            date,
        };

        try {
            if (this.incomeId !== null) {
                const response = await fetch('/api/updateincome', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: this.incomeId,
                        ...payload,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.statusMessage || 'Failed to update income.');
                }
            } else {
                const response = await fetch('/api/createincome', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.statusMessage || 'Failed to create income.');
                }
            }

            window.location.href = '/dashboard/incomes';
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Unable to save income.');
        }
    }

    private async loadIncome(id: number): Promise<void> {
        try {
            const response = await fetch(`/api/income/${id}`);
            const data = await response.json() as { income?: Income };
            const income = data.income;

            if (!income) {
                this.showError('Income not found.');
                return;
            }

            const amountInput = this.querySelector('#incomeAmount') as UIInput | null;
            const dateInput = this.querySelector('#incomeDate') as UIDatePicker | null;
            const descriptionInput = this.querySelector('#incomeDescription') as UIInput | null;

            if (amountInput) {
                (amountInput as any).value = String(income.amount ?? '');
            }

            if (dateInput) {
                (dateInput as any).value = income.date ? new Date(income.date).toISOString().split('T')[0] : '';
            }

            if (descriptionInput) {
                (descriptionInput as any).value = income.description ?? '';
            }
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