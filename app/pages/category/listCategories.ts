import type { UIButton, UITable } from "@diniz/webcomponents";
import '@diniz/webcomponents';
import listCategoriesTemplate from './listCategories.html?raw';
export class ListCategoriesPage extends HTMLElement {
    connectedCallback(): void {
        this.innerHTML = listCategoriesTemplate;
        this.style.padding = '20px';
        this.style.boxSizing = 'border-box';
         (this.querySelector('ui-table') as UITable).style.width = '70%';
         (this.querySelector('ui-table') as UITable).style.height = '400px';
         (this.querySelector('ui-table') as UITable).style.maxHeight = '400px';
        
        this.fetchCategories();
        const createBtn = this.querySelector('ui-button');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                window.location.href = '/dashboard/categories/save';
            });
        }
    }

    private async fetchCategories(): Promise<void> {
        const table = document.querySelector('ui-table') as UITable;
        table.columns = [
                { key: 'id', label: 'ID', sortable: true ,visible: false},
                { key: 'name', label: 'Name', sortable: true },
                { key: 'description', label: 'Description', sortable: true },
                { key: 'actions', label: 'Actions', sortable: false, template: (row) => {
                    const editBtn = document.createElement('ui-button');
                    editBtn.textContent = 'Edit';
                    editBtn.addEventListener('click', () => {
                        window.location.href = `/dashboard/categories/save?id=${row.id}`;
                    });
                    const deleteBtn = document.createElement('ui-button') as UIButton;
                    deleteBtn.variant = 'danger';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.addEventListener('click', async () => {
                        if (confirm(`Are you sure you want to delete category "${row.name}"?`)) {
                            try {   
                                const response = await fetch(`/api/deletecategory?id=${row.id}`, { method: 'DELETE' });
                                if (response.ok) {
                                    alert('Category deleted successfully');
                                    this.fetchCategories();
                                } else {
                                    alert('Failed to delete category');
                                }  
                            } catch (error) {
                                console.error('Error deleting category:', error);
                                alert('An error occurred while deleting the category');
                            }
                        }
                    });
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.gap = '10px';
                    container.appendChild(editBtn);
                    container.appendChild(deleteBtn);
                    return container;                  
                }}
        ];

        try {
            const response = await fetch('/api/listcategories');
            const data = await response.json();
            this.renderCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    private renderCategories(categories: { id: number; name: string; description: string }[]): void {
        const table = document.querySelector('ui-table') as UITable;
        if (table) {
            table.rows = categories;
        }
    }
}
customElements.define('list-categories-page', ListCategoriesPage);