import { createError, defineEventHandler, readBody } from 'nitro/h3';
import { auth } from '../lib/auth';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{ email: string }>(event);
        const { email } = body ?? {};

        if (!email) {
            throw createError({ statusCode: 400, statusMessage: 'Email is required' });
        }

        await auth.api.requestPasswordReset({
            body: { email, redirectTo: '/reset-password' },
        });

        // Always return success to avoid leaking whether the email exists
        return { success: true };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to send reset email' });
    }
});
