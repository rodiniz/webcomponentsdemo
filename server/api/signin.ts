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