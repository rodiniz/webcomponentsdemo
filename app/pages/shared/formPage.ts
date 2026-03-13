/**
 * Shared helpers for save/edit form pages (DRY).
 *
 * Covers:
 *  - readEntityId()  – extract :id from the URL
 *  - setFormMode()   – set title + submit button text for create vs edit
 *  - bindFormCancel() – wire cancel button
 *  - setFieldValue() – set value on a web-component input
 *  - formatDateValue() – normalise ISO date for date pickers
 */

import { getPathParams, type UIButton } from '@diniz/webcomponents';

/** Read an optional :id param from the URL, returns null for "create" mode. */
export function readEntityId(routePattern: string): number | null {
    const params = getPathParams(routePattern, location.pathname);
    const parsed = Number(params?.id);
    return params?.id && !Number.isNaN(parsed) ? parsed : null;
}

/** Update the form title element and submit button label based on edit/create mode. */
export function setFormMode(
    host: HTMLElement,
    titleSelector: string,
    submitSelector: string,
    entityName: string,
    isEdit: boolean,
): void {
    const title = host.querySelector(titleSelector);
    const btn = host.querySelector(submitSelector) as UIButton | null;
    if (title) title.textContent = isEdit ? `Edit ${entityName}` : `Create ${entityName}`;
    if (btn) btn.textContent = isEdit ? `Update ${entityName}` : `Save ${entityName}`;
}

/** Wire the cancel button to navigate back to listHref. */
export function bindFormCancel(host: HTMLElement, cancelSelector: string, listHref: string): void {
    const btn = host.querySelector(cancelSelector) as UIButton | null;
    btn?.addEventListener('click', () => { window.location.href = listHref; });
}

/**
 * Set the value property on a custom element input (works around missing setter
 * on some web-component inputs that require direct property assignment).
 */
export function setFieldValue(element: Element | null, value: string): void {
    if (element) (element as any).value = value;
}

/** Converts an ISO date-time string to a plain YYYY-MM-DD string for date pickers. */
export function formatDateValue(value: string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : (date.toISOString().split('T')[0] ?? '');
}
