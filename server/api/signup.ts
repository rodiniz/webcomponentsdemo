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

        await auth.api.signUpEmail({
            body: {
                name: email,
                email,
                password,
            },
        });

        return {
            success: true         
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Signup failed",
        });
    }
});