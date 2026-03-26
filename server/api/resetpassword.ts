import { createError, defineEventHandler, readBody } from 'nitro/h3';
import { auth } from '../lib/auth';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{ token: string; password: string }>(event);
        const { token, password } = body ?? {};

        if (!token || !password) {
            throw createError({ statusCode: 400, statusMessage: 'Token and password are required' });
        }

        if (password.length < 8) {
            throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' });
        }

        await auth.api.resetPassword({ body: { token, newPassword: password } });

        return { success: true };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to reset password' });
    }
});
