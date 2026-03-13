import { getPathParams, UIDatePicker, type UIButton, type UIInput, type UISelect, type UITextarea } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import template from './saveexpense.html?raw';

type Category = {
	id: number;
	name: string;
};

type Expense = {
	id: number;
	amount: number;
	description?: string | null;
	categoryId?: number | null;
    date?: string | null;
};

type ListCategoriesResponse = {
	categories?: Category[];
};

export class SaveExpensePage extends HTMLElement {
	private expenseId: number | null = null;

	connectedCallback(): void {
		this.innerHTML = template;
		this.readRouteParams();
		this.updateFormMode();
		this.bindEvents();
		void this.loadCategories().then(() => {
			if (this.expenseId !== null) {
				void this.loadExpense(this.expenseId);
			}
		});
	}

	private readRouteParams(): void {
		const params = getPathParams('/dashboard/expenses/:id', location.pathname);
		if (!params?.id || Number.isNaN(Number(params.id))) {
			this.expenseId = null;
			return;
		}

		this.expenseId = Number(params.id);
	}

	private updateFormMode(): void {
		const title = this.querySelector('#expenseFormTitle');
		const submitBtn = this.querySelector('#saveExpenseBtn') as UIButton | null;

		if (!title || !submitBtn) {
			return;
		}

		if (this.expenseId !== null) {
			title.textContent = 'Edit Expense';
			submitBtn.textContent = 'Update Expense';
			return;
		}

		title.textContent = 'Create Expense';
		submitBtn.textContent = 'Save Expense';
	}

	private bindEvents(): void {
		const form = this.querySelector('#expenseForm') as HTMLFormElement | null;
		const cancelBtn = this.querySelector('#cancelExpenseBtn') as UIButton | null;

		if (form) {
			form.addEventListener('submit', (event) => {
				void this.handleSubmit(event);
			});
		}

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				window.location.href = '/dashboard/expenses';
			});
		}
	}

	private async loadCategories(): Promise<void> {
		const categorySelect = this.querySelector('#expenseCategory') as UISelect | null;
		if (!categorySelect) {
			return;
		}

		try {
			const response = await fetch('/api/listcategories?limit=100&top=0');
			const data = await response.json() as ListCategoriesResponse;
			const categories = data.categories ?? [];

			(categorySelect as any).options = [
				{ value: '', label: 'No category' },
				...categories.map((category) => ({
					value: String(category.id),
					label: category.name,
				})),
			];
		} catch {
			this.showError('Failed to load categories.');
		}
	}

	private async handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const amountInput = this.querySelector('#expenseAmount') as UIInput | null;
		const dateInput = this.querySelector('#expenseDate') as UIDatePicker | null;
		const categorySelect = this.querySelector('#expenseCategory') as UISelect | null;
		const descriptionInput = this.querySelector('#expenseDescription') as UITextarea | null;

		const amountRaw = (amountInput as any)?.value;
		const amount = Number(amountRaw);
		const categoryRaw = (categorySelect as any)?.value;
		const description = (descriptionInput as any)?.value?.trim();
		const date = (dateInput as any)?.value;

		if (!Number.isFinite(amount) || amount <= 0) {
			this.showError('Amount must be greater than zero.');
			return;
		}

		const parsedCategoryId = categoryRaw ? Number(categoryRaw) : null;
		if (parsedCategoryId !== null && (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0)) {
			this.showError('Invalid category selected.');
			return;
		}

		if (!date || typeof date !== 'string') {
			this.showError('Date is required.');
			return;
		}

		this.clearError();

		const payload = {
			amount,
			categoryId: parsedCategoryId,
			description: description || null,
			date,
		};

		try {
			if (this.expenseId !== null) {
				const response = await fetch('/api/updateexpense', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: this.expenseId,
						...payload,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.statusMessage || 'Failed to update expense.');
				}
			} else {
				const response = await fetch('/api/createexpense', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.statusMessage || 'Failed to create expense.');
				}
			}

			window.location.href = '/dashboard/expenses';
		} catch (error) {
			this.showError(error instanceof Error ? error.message : 'Unable to save expense.');
		}
	}

	private async loadExpense(id: number): Promise<void> {
		try {
			const response = await fetch(`/api/expense/${id}`);
			const data = await response.json() as { expense?: Expense };
			const expense = data.expense;

			if (!expense) {
				this.showError('Expense not found.');
				return;
			}

			const amountInput = this.querySelector('#expenseAmount') as UIInput;
			const dateInput = this.querySelector('#expenseDate') as UIDatePicker;
			const categorySelect = this.querySelector('#expenseCategory') as UISelect;
			const descriptionInput = this.querySelector('#expenseDescription') as UITextarea;

			if (amountInput) {
				(amountInput as any).value = String(expense.amount ?? '');
			}

			if (dateInput) {
				(dateInput as any).value = expense.date ? new Date(expense.date).toISOString().split('T')[0] : '';
			}

			if (categorySelect) {
				(categorySelect as any).value = expense.categoryId ? String(expense.categoryId) : '';
			}

			if (descriptionInput) {
				(descriptionInput as any).value = expense.description ?? '';
			}
		} catch {
			this.showError('Failed to load expense details.');
		}
	}

	private showError(message: string): void {
		const error = this.querySelector('#expenseError') as HTMLDivElement | null;
		if (!error) {
			return;
		}

		error.textContent = message;
		error.style.display = 'block';
	}

	private clearError(): void {
		const error = this.querySelector('#expenseError') as HTMLDivElement | null;
		if (!error) {
			return;
		}

		error.textContent = '';
		error.style.display = 'none';
	}
}

customElements.define('save-expense-page', SaveExpensePage);
