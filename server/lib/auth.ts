import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const apiKey = process.env['RESENDY_API_KEY'] || process.env['RESEND_API_KEY'];
    if (!apiKey) {
        console.warn('[auth] No Resend API key found. Password reset email skipped. Set RESENDY_API_KEY env var.');
        return;
    }

    const fromEmail = process.env['RESEND_FROM_EMAIL'] || 'onboarding@resend.dev';

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: fromEmail,
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
                    <div style="text-align:center;margin-bottom:24px">
                        <svg viewBox="0 0 48 48" fill="none" width="48" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="24" fill="#192836"/>
                            <path d="M9 18 Q14 13 19 18 Q24 23 29 18 Q34 13 39 18" stroke="white" stroke-width="2.3" fill="none" stroke-linecap="round"/>
                            <path d="M9 25 Q14 20 19 25 Q24 30 29 25 Q34 20 39 25" stroke="white" stroke-width="2.3" fill="none" stroke-linecap="round"/>
                            <path d="M9 32 Q14 27 19 32 Q24 37 29 32 Q34 27 39 32" stroke="white" stroke-width="2.3" fill="none" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h1 style="font-size:1.4rem;font-weight:700;margin:0 0 8px;color:#111827;text-align:center">Reset your password</h1>
                    <p style="color:#6b7280;font-size:0.9rem;margin:0 0 24px;text-align:center">Click the button below to choose a new password. This link expires in 1 hour.</p>
                    <a href="${resetUrl}" style="display:block;text-align:center;background:#00c9a7;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:0.95rem;margin-bottom:20px">Reset Password</a>
                    <p style="color:#9ca3af;font-size:0.8rem;text-align:center">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to send password reset email: ${error}`);
    }
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    baseURL: process.env['BETTER_AUTH_URL'] || 'http://localhost:3000',
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail(user.email, url);
        },
    },
});
