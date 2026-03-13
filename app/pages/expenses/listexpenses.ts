import '@diniz/webcomponents';
import type { UITable } from '@diniz/webcomponents';
import { makeActionCell, setupListPage, type ListPageState } from '../shared/listPage';
import { apiDelete } from '../shared/api';

type ExpenseRow = { id: number; description: string; categoryDescription: string; date: string };

export class ListExpensesPage extends HTMLElement {
    private state!: ListPageState;

    connectedCallback(): void {
        this.state = setupListPage<ExpenseRow>({
            host: this,
            fetchUrl: (limit, top) => `/api/listexpenses?limit=${limit}&top=${top}`,
            rowsKey: 'expenses',
            entityLabel: 'expense',
            createHref: '/dashboard/expenses/save',
            columns: [
                { key: 'id', label: 'ID', sortable: true, visible: false },
                { key: 'description', resizable: true, minWidth: 150, maxWidth: 300, label: 'Description', sortable: true },
                { key: 'categoryDescription', label: 'Category', sortable: true },
                {
                    key: 'date', label: 'Date', sortable: true,
                    template: (row: ExpenseRow) => {
                        const d = new Date(row.date);
                        return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
                    },
                },
                {
                    key: 'actions', label: 'Actions', sortable: false,
                    template: (row: ExpenseRow) => makeActionCell(
                        `/dashboard/expenses/${row.id}`,
                        () => { this.state.idToDelete = row.id; this.state.deleteModal?.open(); },
                    ),
                },
            ],
            renderRows: (rows) => {
                const table = this.querySelector('ui-table') as UITable | null;
                if (table) table.rows = rows;
            },
            deleteRow: (id) => apiDelete(`/api/deleteexpense/${id}`),
        });
    }
}
customElements.define('list-expenses-page', ListExpensesPage);