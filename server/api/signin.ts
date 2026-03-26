import { createError, defineEventHandler, readBody } from "nitro/h3";
import { auth } from "../lib/auth";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{ email: string; password: string }>(event);
        const { email, password } = body ?? {};

        if (!email || !password) {
            throw createError({
                statusCode: 400,
                statusMessage: "Email and password are required",
            });
        }

        const result = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        return {
            success: true,
            token: result.token           
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Signin failed",
        });
    }
});