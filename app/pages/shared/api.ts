/**
 * Thin typed wrappers around fetch so every page uses the same
 * serialisation / error-extraction logic (DRY).
 */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    if (!response.ok) {
        const body = await response.json().catch(() => ({})) as Record<string, string>;
        throw new Error(body['statusMessage'] ?? body['message'] ?? `HTTP ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export function apiGet<T>(url: string): Promise<T> {
    return request<T>(url);
}

export function apiPost<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export function apiPut<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export function apiDelete<T>(url: string): Promise<T> {
    return request<T>(url, { method: 'DELETE' });
}
