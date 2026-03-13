import type { UIButton, UIModal, UIPagination, UITable, UIToast } from "@diniz/webcomponents";
import '@diniz/webcomponents';
import listCategoriesTemplate from '../generic/listpage.html?raw';

type ExpenseRow = { id: number; name: string; description: string };
type ListExpensesResponse = {
    expenses: ExpenseRow[];
    total?: number;
    limit?: number;
    top?: number;
    hasMore?: boolean;
};

export class ListExpensesPage extends HTMLElement {
    deleteModal:UIModal | null = null;
    expenseIdToDelete: number | null = null;
    toast: UIToast | null = null;
    private total = 0;
    private limit = 5;
    private top = 0;

    connectedCallback(): void {
        this.innerHTML = listCategoriesTemplate;
        this.style.padding = '20px';
        this.style.boxSizing = 'border-box';
        const table = this.querySelector('ui-table') as UITable | null;        
        if (!table) {
            return;
        }       

        table.columns = [
                { key: 'id', label: 'ID', sortable: true ,visible: false},
                { key: 'description',  resizable: true, minWidth: 150, maxWidth: 300, label: 'Description', sortable: true },
                { key: 'categoryDescription', label: 'Category', sortable: true },               
                { key: 'date', label: 'Date', sortable: true , template: (row) => {
                    const date = new Date(row.date);
                    return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
                }},
                { key: 'actions', label: 'Actions', sortable: false, template: (row) => {
                    this.expenseIdToDelete = row.id;
                    const editBtn = document.createElement('ui-button');
                    editBtn.textContent = 'Edit';
                    editBtn.addEventListener('click', () => {
                        window.location.href = `/dashboard/expenses/${row.id}`;
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
      
        table.style.width = '70%';
        table.style.height = '400px';
        table.style.maxHeight = '400px';
        
        const pagination = this.querySelector('#pagination-control') as UIPagination | null;
        if (pagination) {
            pagination.addEventListener('page-change', (e: any) => {
                const newPage = e.detail.page;
                this.top = (newPage - 1) * this.limit;
                this.fetchCategories();
            });

            pagination.addEventListener('per-page-change', (e: any) => {
                this.limit = e.detail.perPage;
                this.top = 0;
                this.fetchCategories();
            });
        }
        
        this.fetchCategories();
        const createBtn = this.querySelector('#create-category-btn') as UIButton | null;
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                window.location.href = '/dashboard/expenses/save';
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

        try {
            const pagination = this.querySelector('#pagination-control') as UIPagination | null;
            const response = await fetch(`/api/listexpenses?limit=${this.limit}&top=${this.top}`);
            const data = await response.json() as ListExpensesResponse;
            this.total = Number(data.total ?? 0);
            
            if (pagination) {
                pagination.total = this.total;
                pagination.pageSize = this.limit;
                pagination.currentPage = Math.floor(this.top / this.limit) + 1;
            }

            this.renderExpenses(data.expenses);
        } catch (error) {
            if (this.toast) {
                this.toast.error(`Error fetching expenses: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
    showDeleteConfirm(expenseId:number):void {
       this.expenseIdToDelete = expenseId;
         if(this.deleteModal){
            this.deleteModal.open();
            }

    }
    renderExpenses(expenses: ExpenseRow[]): void {
        const table = this.querySelector('ui-table') as UITable | null;
        if (table) {
            table.rows = expenses;
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
        if (!this.expenseIdToDelete) return;

        const response = await fetch(`/api/deleteexpense/${this.expenseIdToDelete}`, {
            method: 'DELETE',
        }).then(r => r.json());
        if (!response.success) {
            if (this.toast) {
                this.toast.error(`Failed to delete expense: ${response.statusMessage || 'Unknown error'}`);
            }
            return;
        }

        if (this.top > 0) {
            const pageHasSingleItem = this.total > 0 && this.top >= this.total - 1;
            if (pageHasSingleItem) {
                this.top = Math.max(0, this.top - this.limit);
            }
        }
      
        this.fetchCategories();
    }
}
customElements.define('list-expenses-page', ListExpensesPage);