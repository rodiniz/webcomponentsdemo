import { getPathParams, type UIButton, type UIInput } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import template from "./savecategory.html?raw";

type Category = {
    id: number;
    name: string;
    description?: string | null;
};

export class SaveCategoryPage extends HTMLElement {
    private categoryId: number | null = null;

    connectedCallback(): void {
        this.innerHTML = template;       
        this.readRouteParams();
        this.updateFormMode();
        this.bindEvents();
        if (this.categoryId !== null) {
            this.loadCategory(this.categoryId);
        }
    }

    private readRouteParams(): void {
      
        const params = getPathParams('/dashboard/categories/:id', location.pathname);
        if(isNaN(Number(params?.id))){
            this.categoryId = null;
            return;
        }
        this.categoryId = params?.id ? Number(params.id) : null;
    }

    private updateFormMode(): void {
        const title = this.querySelector('#categoryFormTitle');
        const submitBtn = this.querySelector('#saveCategoryBtn') as UIButton | null;

        if (!title || !submitBtn) {
            return;
        }

        if (this.categoryId !== null) {
            title.textContent = 'Edit Category';
            submitBtn.textContent = 'Update Category';
            return;
        }

        title.textContent = 'Create Category';
        submitBtn.textContent = 'Save Category';
    }

    private bindEvents(): void {
        const form = this.querySelector('#categoryForm') as HTMLFormElement | null;
        const cancelBtn = this.querySelector('#cancelCategoryBtn') as UIButton | null;

        if (form) {
            form.addEventListener('submit', (event) => this.handleSubmit(event));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                window.location.href = '/dashboard/categories';
            });
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const nameInput = this.querySelector('#categoryName') as UIInput | null;
        const descriptionInput = this.querySelector('#categoryDescription') as UIInput | null;

        const name = (nameInput as any)?.value?.trim();
        const description = (descriptionInput as any)?.value?.trim();

        if (!name) {
            this.showError('Category name is required.');
            return;
        }

        this.clearError();

        try {
            if (this.categoryId !== null) {
                const response = await fetch('/api/updatecategory', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: this.categoryId,
                        name,
                        description: description || null,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.statusMessage || 'Failed to update category.');
                }
            } else {
                const response = await fetch('/api/createcategory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        description: description || null,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.statusMessage || 'Failed to create category.');
                }
            }

            window.location.href = '/dashboard/categories';
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Unable to save category.');
        }
    }

    private async loadCategory(id: number): Promise<void> {
        try {
            debugger;
            const response = await fetch(`/api/category/${id}`);
            const data = await response.json() as { category?: Category };
            const category = data.category;

            if (!category) {
                this.showError('Category not found.');
                return;
            }

            const nameInput = this.querySelector('#categoryName') as UIInput | null;
            const descriptionInput = this.querySelector('#categoryDescription') as UIInput | null;

            if (nameInput) {
                (nameInput as any).value = category.name;
            }

            if (descriptionInput) {
                (descriptionInput as any).value = category.description ?? '';
            }
        } catch {
            this.showError('Failed to load category details.');
        }
    }

    private showError(message: string): void {
        const error = this.querySelector('#categoryError') as HTMLDivElement | null;
        if (!error) {
            return;
        }

        error.textContent = message;
        error.style.display = 'block';
    }

    private clearError(): void {
        const error = this.querySelector('#categoryError') as HTMLDivElement | null;
        if (!error) {
            return;
        }

        error.textContent = '';
        error.style.display = 'none';
    }
}
customElements.define('save-category-page', SaveCategoryPage);