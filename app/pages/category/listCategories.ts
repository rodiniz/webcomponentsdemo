import type { UIButton, UIModal, UITable, UIToast } from "@diniz/webcomponents";
import '@diniz/webcomponents';
import listCategoriesTemplate from './listCategories.html?raw';

export class ListCategoriesPage extends HTMLElement {
    deleteModal:UIModal | null = null;
    categoryIdToDelete: number | null = null;
    toast: UIToast | null = null;
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

        const cancelBtn = this.querySelector('#cancel-action') as UIButton | null;
        const confirmBtn = this.querySelector('#confirm-action') as UIButton | null;
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelForm());
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmDeletion());
        }

        this.deleteModal = this.querySelector('ui-modal') as UIModal;       
        this.toast = this.querySelector('ui-toast') as UIToast;

    }

    private async fetchCategories(): Promise<void> {
        const table = document.querySelector('ui-table') as UITable;
        table.columns = [
                { key: 'id', label: 'ID', sortable: true ,visible: false},
                { key: 'name', label: 'Name', sortable: true },
                { key: 'description', label: 'Description', sortable: true },
                { key: 'actions', label: 'Actions', sortable: false, template: (row) => {
                    this.categoryIdToDelete = row.id;
                    const editBtn = document.createElement('ui-button');
                    editBtn.textContent = 'Edit';
                    editBtn.addEventListener('click', () => {
                        window.location.href = `/dashboard/categories/${row.id}`;
                    });
                    const deleteBtn = document.createElement('ui-button') as UIButton;
                    deleteBtn.variant = 'danger';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.addEventListener('click', async () => {
                        if (this.deleteModal) {
                            this.deleteModal.open();
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
            if (this.toast) {
                this.toast.error(`Error fetching categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
    showDeleteConfirm(categoryId:number):void {
       this.categoryIdToDelete = categoryId;
         if(this.deleteModal){
            this.deleteModal.open();
            }

    }
    renderCategories(categories: { id: number; name: string; description: string }[]): void {
        const table = document.querySelector('ui-table') as UITable;
        if (table) {
            table.rows = categories;
        }
    }
    cancelForm(): void {
        if(this.deleteModal){
            this.deleteModal.close();
            }
    }
    async confirmDeletion(): Promise<void> {
        if(this.deleteModal){
            this.deleteModal.close();
        }
        if (!this.categoryIdToDelete) return;

        const response = await fetch(`/api/deletecategory/${this.categoryIdToDelete}`, {
            method: 'DELETE',
        }).then(r => r.json());
        if (!response.success) {
            if (this.toast) {
                this.toast.error(`Failed to delete category: ${response.statusMessage || 'Unknown error'}`);
            }
            return;
        }
      
        this.fetchCategories();
    }
}
customElements.define('list-categories-page', ListCategoriesPage);