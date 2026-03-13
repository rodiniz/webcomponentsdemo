import { createError, defineEventHandler, readBody } from 'nitro/h3';
import { prisma } from '../lib/prisma';

type UpdateExpenseRequest = {
    id?: number | string;
    amount?: number | string;
    description?: string | null;
    categoryId?: number | string | null;
    date?: string | null;
};

const parseExpenseDate = (value: unknown): Date | null => {
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
    const request = await readBody(event) as UpdateExpenseRequest;
    const id = Number(request?.id);
    const amount = Number(request?.amount);
    const description = typeof request?.description === 'string' ? request.description.trim() : '';
    const categoryIdValue = request?.categoryId;
    const categoryId = categoryIdValue === null || categoryIdValue === '' || categoryIdValue === undefined
        ? null
        : Number(categoryIdValue);
    const date = parseExpenseDate(request?.date);

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid expense ID is required',
        });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Amount must be greater than zero',
        });
    }

    if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid category ID is required',
        });
    }

    if (!date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid expense date is required',
        });
    }

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Expense not found',
        });
    }

    const expense = await prisma.expense.update({
        where: { id },
        data: {
            amount,
            description: description || null,
            date,
            category: categoryId !== null
                ? {
                    connect: { id: categoryId },
                }
                : {
                    disconnect: true,
                },
        },
    });

    return {
        success: true,
        expense,
    };
});