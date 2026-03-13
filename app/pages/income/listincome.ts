import '@diniz/webcomponents';
import type { UITable } from '@diniz/webcomponents';
import { makeActionCell, setupListPage, type ListPageState } from '../shared/listPage';
import { apiDelete } from '../shared/api';

type IncomeRow = { id: number; amount: number; description: string | null; date: string };

export class ListIncomePage extends HTMLElement {
    private state!: ListPageState;

    connectedCallback(): void {
        this.state = setupListPage<IncomeRow>({
            host: this,
            fetchUrl: (limit, top) => `/api/listincomes?limit=${limit}&top=${top}`,
            rowsKey: 'incomes',
            entityLabel: 'income',
            createHref: '/dashboard/incomes/save',
            createLabel: 'Create Income',
            columns: [
                { key: 'id', label: 'ID', sortable: true, visible: false },
                { key: 'description', label: 'Description', sortable: true },
                {
                    key: 'amount', label: 'Amount', sortable: true,
                    template: (row: IncomeRow) => Number(row.amount).toFixed(2),
                },
                {
                    key: 'date', label: 'Date', sortable: true,
                    template: (row: IncomeRow) => {
                        const d = new Date(row.date);
                        return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
                    },
                },
                {
                    key: 'actions', label: 'Actions', sortable: false,
                    template: (row: IncomeRow) => makeActionCell(
                        `/dashboard/incomes/${row.id}`,
                        () => { this.state.idToDelete = row.id; this.state.deleteModal?.open(); },
                    ),
                },
            ],
            renderRows: (rows) => {
                const table = this.querySelector('ui-table') as UITable | null;
                if (table) table.rows = rows;
            },
            deleteRow: (id) => apiDelete(`/api/deleteincome/${id}`),
        });
    }
}

customElements.define('list-income-page', ListIncomePage);