type ErrorDisplayMode = 'class' | 'display';

type ErrorDisplayOptions = {
    mode?: ErrorDisplayMode;
    className?: string;
    replayAnimation?: boolean;
};

const resolveOptions = (options?: ErrorDisplayOptions) => {
    return {
        mode: options?.mode ?? 'display',
        className: options?.className ?? 'visible',
        replayAnimation: options?.replayAnimation ?? true,
    };
};

export const showFormError = (element: HTMLElement | null, message: string, options?: ErrorDisplayOptions): void => {
    if (!element) {
        return;
    }

    const resolved = resolveOptions(options);
    element.textContent = message;

    if (resolved.mode === 'class') {
        element.classList.remove(resolved.className);
        if (resolved.replayAnimation) {
            void element.offsetWidth;
        }
        element.classList.add(resolved.className);
        return;
    }

    element.style.display = 'block';
};

export const clearFormError = (element: HTMLElement | null, options?: ErrorDisplayOptions): void => {
    if (!element) {
        return;
    }

    const resolved = resolveOptions(options);
    element.textContent = '';

    if (resolved.mode === 'class') {
        element.classList.remove(resolved.className);
        return;
    }

    element.style.display = 'none';
};