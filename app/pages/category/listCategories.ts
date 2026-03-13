import '@diniz/webcomponents';
import type { UITable } from '@diniz/webcomponents';
import { makeActionCell, setupListPage, type ListPageState } from '../shared/listPage';
import { apiDelete } from '../shared/api';

type CategoryRow = { id: number; name: string; description: string };

export class ListCategoriesPage extends HTMLElement {
    private state!: ListPageState;

    connectedCallback(): void {
        this.state = setupListPage<CategoryRow>({
            host: this,
            fetchUrl: (limit, top) => `/api/listcategories?limit=${limit}&top=${top}`,
            rowsKey: 'categories',
            entityLabel: 'category',
            createHref: '/dashboard/categories/save',
            columns: [
                { key: 'id', label: 'ID', sortable: true, visible: false },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'description', label: 'Description', sortable: true },
                {
                    key: 'actions', label: 'Actions', sortable: false,
                    template: (row: CategoryRow) => {
                        this.state.idToDelete = row.id;
                        return makeActionCell(
                            `/dashboard/categories/${row.id}`,
                            () => { this.state.idToDelete = row.id; this.state.deleteModal?.open(); },
                        );
                    },
                },
            ],
            renderRows: (rows) => {
                const table = this.querySelector('ui-table') as UITable | null;
                if (table) table.rows = rows;
            },
            deleteRow: (id) => apiDelete(`/api/deletecategory/${id}`),
        });
    }
}
customElements.define('list-categories-page', ListCategoriesPage);