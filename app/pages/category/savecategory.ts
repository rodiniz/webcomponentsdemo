import { getFormValues, validateForm } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import template from './savecategory.html?raw';
import { clearFormError, showFormError } from '../shared/formErrorDisplay';
import { getFirstValidationError } from '../shared/formValidation';
import { readEntityId, setFormMode, bindFormCancel, setFieldValue } from '../shared/formPage';
import { apiGet, apiPost, apiPut } from '../shared/api';

type Category = { id: number; name: string; description?: string | null };

export class SaveCategoryPage extends HTMLElement {
    private categoryId: number | null = null;

    connectedCallback(): void {
        this.innerHTML = template;
        this.categoryId = readEntityId('/dashboard/categories/:id');
        setFormMode(this, '#categoryFormTitle', '#saveCategoryBtn', 'Category', this.categoryId !== null);
        bindFormCancel(this, '#cancelCategoryBtn', '/dashboard/categories');

        const form = this.querySelector('#categoryForm') as HTMLFormElement | null;
        if (form) {
            form.addEventListener('submit', (event) => void this.handleSubmit(event));
        }

        if (this.categoryId !== null) {
            void this.loadCategory(this.categoryId);
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        const form = this.querySelector('#categoryForm') as HTMLFormElement | null;
        if (!form) return;

        const validation = validateForm(form);
        if (!validation.isValid) {
            this.showError(getFirstValidationError(validation.errors));
            return;
        }

        const values = getFormValues(form, { includeEmpty: true });
        const name = typeof values.name === 'string' ? values.name.trim() : '';
        const description = typeof values.description === 'string' ? values.description.trim() : '';

        if (!name) {
            this.showError('Category name is required.');
            return;
        }

        this.clearError();

        const payload = { name, description: description || null };
        try {
            if (this.categoryId !== null) {
                await apiPut('/api/updatecategory', { id: this.categoryId, ...payload });
            } else {
                await apiPost('/api/createcategory', payload);
            }
            window.location.href = '/dashboard/categories';
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Unable to save category.');
        }
    }

    private async loadCategory(id: number): Promise<void> {
        try {
            const data = await apiGet<{ category?: Category }>(`/api/category/${id}`);
            const category = data.category;
            if (!category) {
                this.showError('Category not found.');
                return;
            }
            setFieldValue(this.querySelector('#categoryName'), category.name);
            setFieldValue(this.querySelector('#categoryDescription'), category.description ?? '');
        } catch {
            this.showError('Failed to load category details.');
        }
    }

    private showError(message: string): void {
        const error = this.querySelector('#categoryError') as HTMLDivElement | null;
        showFormError(error, message);
    }

    private clearError(): void {
        const error = this.querySelector('#categoryError') as HTMLDivElement | null;
        clearFormError(error);
    }
}
customElements.define('save-category-page', SaveCategoryPage);