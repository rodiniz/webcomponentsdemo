/**
 * Shared wiring for every list page (pagination, delete modal, toast, table).
 * Each list page calls setupListPage() passing its config; repeated ~120 lines
 * of connectedCallback logic become a single call (DRY).
 */

import type { UIButton, UIModal, UIPagination, UITable, UIToast } from '@diniz/webcomponents';
import listTemplate from '../generic/listpage.html?raw';

export interface ListPageConfig<TRow> {
    /** Host element */
    host: HTMLElement;
    /** URL template – receives limit and top query params */
    fetchUrl: (limit: number, top: number) => string;
    /** Key inside the JSON response that holds the row array */
    rowsKey: string;
    /** Table column definitions */
    columns: any[];
    /** href for the "create" button */
    createHref: string;
    /** Create button label */
    createLabel?: string;
    /** Called with the freshly fetched rows so the page can update the table */
    renderRows: (rows: TRow[]) => void;
    /** Called to actually delete a row; should resolve on success, reject on failure */
    deleteRow: (id: number) => Promise<void>;
    /** Toast error prefix, e.g. "expense" */
    entityLabel: string;
}

export interface ListPageState {
    total: number;
    limit: number;
    top: number;
    idToDelete: number | null;
    toast: UIToast | null;
    deleteModal: UIModal | null;
    /** Trigger a fresh fetch + render */
    refresh: () => void;
}

export function setupListPage<TRow extends { id: number }>(
    config: ListPageConfig<TRow>,
): ListPageState {
    const { host } = config;
    host.innerHTML = listTemplate;
    host.style.padding = '20px';
    host.style.boxSizing = 'border-box';

    const state: ListPageState = {
        total: 0,
        limit: 5,
        top: 0,
        idToDelete: null,
        toast: null,
        deleteModal: null,
        refresh: () => void fetchAndRender(),
    };

    // ── table ──────────────────────────────────────────────────────────────
    const table = host.querySelector('ui-table') as UITable | null;
    if (!table) return state;
    table.columns = config.columns;
    table.style.width = '70%';
    table.style.height = '400px';
    table.style.maxHeight = '400px';

    // ── pagination ─────────────────────────────────────────────────────────
    const pagination = host.querySelector('#pagination-control') as UIPagination | null;
    if (pagination) {
        pagination.addEventListener('page-change', (e: Event) => {
            state.top = ((e as CustomEvent<{ page: number }>).detail.page - 1) * state.limit;
            void fetchAndRender();
        });
        pagination.addEventListener('per-page-change', (e: Event) => {
            state.limit = (e as CustomEvent<{ perPage: number }>).detail.perPage;
            state.top = 0;
            void fetchAndRender();
        });
    }

    // ── create button ──────────────────────────────────────────────────────
    const createBtn = host.querySelector('#create-category-btn') as UIButton | null;
    if (createBtn) {
        if (config.createLabel) createBtn.textContent = config.createLabel;
        createBtn.addEventListener('click', () => { window.location.href = config.createHref; });
    }

    // ── modal + toast ──────────────────────────────────────────────────────
    state.deleteModal = host.querySelector('ui-modal') as UIModal | null;
    state.toast = host.querySelector('ui-toast') as UIToast | null;

    const cancelBtn = host.querySelector('#cancel-action') as UIButton | null;
    const confirmBtn = host.querySelector('#confirm-action') as UIButton | null;
    if (cancelBtn) cancelBtn.addEventListener('click', () => state.deleteModal?.close());
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            state.deleteModal?.close();
            if (state.idToDelete === null) return;
            config.deleteRow(state.idToDelete).then(() => {
                if (state.top > 0 && state.top >= state.total - 1) {
                    state.top = Math.max(0, state.top - state.limit);
                }
                void fetchAndRender();
            }).catch((err: unknown) => {
                state.toast?.error(
                    `Failed to delete ${config.entityLabel}: ${err instanceof Error ? err.message : 'Unknown error'}`,
                );
            });
        });
    }

    // ── initial fetch ──────────────────────────────────────────────────────
    void fetchAndRender();

    async function fetchAndRender(): Promise<void> {
        try {
            const response = await fetch(config.fetchUrl(state.limit, state.top));
            const data = await response.json() as Record<string, unknown>;
            state.total = Number(data['total'] ?? 0);

            if (pagination) {
                pagination.total = state.total;
                pagination.pageSize = state.limit;
                pagination.currentPage = Math.floor(state.top / state.limit) + 1;
            }

            config.renderRows((data[config.rowsKey] ?? []) as TRow[]);
        } catch (error) {
            state.toast?.error(
                `Error fetching ${config.entityLabel}s: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    return state;
}

/** Builds the standard Edit + Delete action cell used on every list page */
export function makeActionCell(
    editHref: string,
    onDeleteClick: () => void,
): HTMLElement {
    const editBtn = document.createElement('ui-button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => { window.location.href = editHref; });

    const deleteBtn = document.createElement('ui-button') as UIButton;
    deleteBtn.variant = 'danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', onDeleteClick);

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '10px';
    container.appendChild(editBtn);
    container.appendChild(deleteBtn);
    return container;
}
