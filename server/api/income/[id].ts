import { createError, defineEventHandler, getRouterParam } from 'nitro/h3';
import { prisma } from '../../lib/prisma';

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id');
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid income ID is required',
        });
    }

    const income = await prisma.income.findUnique({
        where: {
            id,
        },
    });

    if (!income) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Income not found',
        });
    }

    return {
        success: true,
        income,
    };
});