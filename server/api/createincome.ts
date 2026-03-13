import { createError, defineEventHandler, readBody } from 'nitro/h3';
import { prisma } from '../lib/prisma';

type CreateIncomeRequest = {
    amount?: number | string;
    description?: string | null;
    date?: string | null;
};

const parseIncomeDate = (value: unknown): Date | null => {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
};

export default defineEventHandler(async (event) => {
    const request = await readBody(event) as CreateIncomeRequest;
    const amount = Number(request?.amount);
    const description = typeof request?.description === 'string' ? request.description.trim() : '';
    const date = parseIncomeDate(request?.date);

    if (!Number.isFinite(amount) || amount <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Amount must be greater than zero',
        });
    }

    if (!date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid income date is required',
        });
    }

    const income = await prisma.income.create({
        data: {
            amount,
            description: description || null,
            date,
        },
    });

    return {
        success: true,
        income,
    };
});