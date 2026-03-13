import { createError, defineEventHandler, getRouterParam } from 'nitro/h3';
import { prisma } from '../../lib/prisma';

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id');
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid expense ID is required',
        });
    }

    const expense = await prisma.expense.findUnique({
        where: {
            id,
        },
    });

    if (!expense) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Expense not found',
        });
    }

    return {
        success: true,
        expense,
    };
});