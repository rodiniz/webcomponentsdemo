import { getFormValues, validateForm, type UISelect } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import template from './saveexpense.html?raw';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';
import { getFirstValidationError } from '../shared/formValidation';
import { readEntityId, setFormMode, bindFormCancel, setFieldValue, formatDateValue } from '../shared/formPage';
import { apiGet, apiPost, apiPut } from '../shared/api';

type Category = { id: number; name: string };
type Expense = { id: number; amount: number; description?: string | null; categoryId?: number | null; date?: string | null };
type ListCategoriesResponse = { categories?: Category[] };

export class SaveExpensePage extends HTMLElement {
	private expenseId: number | null = null;

	connectedCallback(): void {
		this.innerHTML = template;
		this.expenseId = readEntityId('/dashboard/expenses/:id');
		setFormMode(this, '#expenseFormTitle', '#saveExpenseBtn', 'Expense', this.expenseId !== null);
		bindFormCancel(this, '#cancelExpenseBtn', '/dashboard/expenses');

		const form = this.querySelector('#expenseForm') as HTMLFormElement | null;
		if (form) {
			form.addEventListener('submit', (event) => void this.handleSubmit(event));
		}

		void this.loadCategories().then(() => {
			if (this.expenseId !== null) {
				void this.loadExpense(this.expenseId);
			}
		});
	}

	private async loadCategories(): Promise<void> {
		const categorySelect = this.querySelector('#expenseCategory') as UISelect | null;
		if (!categorySelect) return;
		try {
			const data = await apiGet<ListCategoriesResponse>('/api/listcategories?limit=100&top=0');
			const categories = data.categories ?? [];
			(categorySelect as any).options = [
				{ value: '', label: 'No category' },
				...categories.map((c) => ({ value: String(c.id), label: c.name })),
			];
		} catch {
			this.showError('Failed to load categories.');
		}
	}

	private async handleSubmit(event: Event): Promise<void> {
		event.preventDefault();
		const form = this.querySelector('#expenseForm') as HTMLFormElement | null;
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
		const parsedCategoryId = values.categoryId ? Number(values.categoryId) : null;

		if (!Number.isFinite(amount) || amount <= 0) {
			this.showError('Amount must be greater than zero.');
			return;
		}
		if (parsedCategoryId !== null && (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0)) {
			this.showError('Invalid category selected.');
			return;
		}
		if (!date || typeof date !== 'string') {
			this.showError('Date is required.');
			return;
		}

		this.clearError();

		const payload = { amount, categoryId: parsedCategoryId, description: description || null, date };
		try {
			if (this.expenseId !== null) {
				await apiPut('/api/updateexpense', { id: this.expenseId, ...payload });
			} else {
				await apiPost('/api/createexpense', payload);
			}
			window.location.href = '/dashboard/expenses';
		} catch (error) {
			this.showError(error instanceof Error ? error.message : 'Unable to save expense.');
		}
	}

	private async loadExpense(id: number): Promise<void> {
		try {
			const data = await apiGet<{ expense?: Expense }>(`/api/expense/${id}`);
			const expense = data.expense;
			if (!expense) {
				this.showError('Expense not found.');
				return;
			}
			setFieldValue(this.querySelector('#expenseAmount'), String(expense.amount ?? ''));
			setFieldValue(this.querySelector('#expenseDate'), formatDateValue(expense.date));
			setFieldValue(this.querySelector('#expenseCategory'), expense.categoryId ? String(expense.categoryId) : '');
			setFieldValue(this.querySelector('#expenseDescription'), expense.description ?? '');
		} catch {
			this.showError('Failed to load expense details.');
		}
	}

	private showError(message: string): void {
		const error = this.querySelector('#expenseError') as HTMLDivElement | null;
		showFormError(error, message);
	}

	private clearError(): void {
		const error = this.querySelector('#expenseError') as HTMLDivElement | null;
		clearFormError(error);
	}
}

customElements.define('save-expense-page', SaveExpensePage);
