import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createError, defineEventHandler, readBody } from "nitro/h3";
import { prisma } from "../lib/prisma";

const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
});

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{ email: string; password: string; name?: string }>(event);
        const { email, password, name } = body ?? {};

        if (!email || !password) {
            throw createError({
                statusCode: 400,
                statusMessage: "Email and password are required",
            });
        }

        const result = await auth.api.signUpEmail({
            body: {
                name: email,
                email,
                password,
            },
        });

        return {
            success: true,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
            },
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || "Signup failed",
        });
    }
});