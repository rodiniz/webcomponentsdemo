import type { UIButton, UIModal, UIPagination, UITable, UIToast } from '@diniz/webcomponents';
import '@diniz/webcomponents';
import listTemplate from '../generic/listpage.html?raw';

type IncomeRow = {
    id: number;
    amount: number;
    description: string | null;
    date: string;
};

type ListIncomesResponse = {
    incomes: IncomeRow[];
    total?: number;
};

export class ListIncomePage extends HTMLElement {
    deleteModal: UIModal | null = null;
    incomeIdToDelete: number | null = null;
    toast: UIToast | null = null;
    private total = 0;
    private limit = 5;
    private top = 0;

    connectedCallback(): void {
        this.innerHTML = listTemplate;
        this.style.padding = '20px';
        this.style.boxSizing = 'border-box';

        const table = this.querySelector('ui-table') as UITable | null;
        if (!table) {
            return;
        }

        table.columns = [
            { key: 'id', label: 'ID', sortable: true, visible: false },
            {
                key: 'description',
                label: 'Description',
                sortable: true,
            },
            {
                key: 'amount',
                label: 'Amount',
                sortable: true,
                template: (row) => Number(row.amount).toFixed(2),
            },
            {
                key: 'date',
                label: 'Date',
                sortable: true,
                template: (row) => {
                    const date = new Date(row.date);
                    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
                },
            },
            {
                key: 'actions',
                label: 'Actions',
                sortable: false,
                template: (row) => {
                    this.incomeIdToDelete = row.id;

                    const editBtn = document.createElement('ui-button');
                    editBtn.textContent = 'Edit';
                    editBtn.addEventListener('click', () => {
                        window.location.href = `/dashboard/incomes/${row.id}`;
                    });

                    const deleteBtn = document.createElement('ui-button') as UIButton;
                    deleteBtn.variant = 'danger';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.addEventListener('click', () => {
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
                },
            },
        ];

        table.style.width = '70%';
        table.style.height = '400px';
        table.style.maxHeight = '400px';

        const pagination = this.querySelector('#pagination-control') as UIPagination | null;
        if (pagination) {
            pagination.addEventListener('page-change', (event: Event) => {
                const detail = (event as CustomEvent<{ page: number }>).detail;
                this.top = (detail.page - 1) * this.limit;
                void this.fetchIncomes();
            });

            pagination.addEventListener('per-page-change', (event: Event) => {
                const detail = (event as CustomEvent<{ perPage: number }>).detail;
                this.limit = detail.perPage;
                this.top = 0;
                void this.fetchIncomes();
            });
        }

        const createBtn = this.querySelector('#create-category-btn') as UIButton | null;
        if (createBtn) {
            createBtn.textContent = 'Create Income';
            createBtn.addEventListener('click', () => {
                window.location.href = '/dashboard/incomes/save';
            });
        }

        const cancelBtn = this.querySelector('#cancel-action') as UIButton | null;
        const confirmBtn = this.querySelector('#confirm-action') as UIButton | null;
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelDeletion());
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                void this.confirmDeletion();
            });
        }

        this.deleteModal = this.querySelector('ui-modal') as UIModal | null;
        this.toast = this.querySelector('ui-toast') as UIToast | null;

        void this.fetchIncomes();
    }

    private async fetchIncomes(): Promise<void> {
        try {
            const pagination = this.querySelector('#pagination-control') as UIPagination | null;
            const response = await fetch(`/api/listincomes?limit=${this.limit}&top=${this.top}`);
            const data = await response.json() as ListIncomesResponse;

            this.total = Number(data.total ?? 0);

            if (pagination) {
                pagination.total = this.total;
                pagination.pageSize = this.limit;
                pagination.currentPage = Math.floor(this.top / this.limit) + 1;
            }

            this.renderIncomes(data.incomes ?? []);
        } catch (error) {
            if (this.toast) {
                this.toast.error(`Error fetching incomes: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }

    private renderIncomes(incomes: IncomeRow[]): void {
        const table = this.querySelector('ui-table') as UITable | null;
        if (table) {
            table.rows = incomes;
        }
    }

    private cancelDeletion(): void {
        if (this.deleteModal) {
            this.deleteModal.close();
        }
    }

    private async confirmDeletion(): Promise<void> {
        if (this.deleteModal) {
            this.deleteModal.close();
        }

        if (!this.incomeIdToDelete) {
            return;
        }

        const response = await fetch(`/api/deleteincome/${this.incomeIdToDelete}`, {
            method: 'DELETE',
        }).then((r) => r.json());

        if (!response.success) {
            if (this.toast) {
                this.toast.error(`Failed to delete income: ${response.statusMessage || 'Unknown error'}`);
            }
            return;
        }

        if (this.top > 0) {
            const pageHasSingleItem = this.total > 0 && this.top >= this.total - 1;
            if (pageHasSingleItem) {
                this.top = Math.max(0, this.top - this.limit);
            }
        }

        await this.fetchIncomes();
    }
}

customElements.define('list-income-page', ListIncomePage);