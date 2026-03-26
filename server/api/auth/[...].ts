import { defineEventHandler, getRequestURL, sendRedirect } from 'nitro/h3';

// better-auth emails a link like /api/auth/reset-password/TOKEN?callbackURL=/reset-password
// This handler extracts the token and redirects the browser to the SPA reset-password page.
export default defineEventHandler(async (event) => {
    const url = getRequestURL(event);
    const segments = url.pathname.split('/');

    // /api/auth/reset-password/TOKEN
    const resetIdx = segments.indexOf('reset-password');
    if (resetIdx !== -1 && segments[resetIdx + 1]) {
        const token = segments[resetIdx + 1];
        const callbackURL = url.searchParams.get('callbackURL') ?? '/reset-password';
        return sendRedirect(event, `${callbackURL}?token=${encodeURIComponent(token)}`, 302);
    }

    // Any other /api/auth/** route not explicitly handled
    return { statusCode: 404, message: 'Not found' };
});
