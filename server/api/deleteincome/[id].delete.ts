import { createError, defineEventHandler, getRouterParam } from 'nitro/h3';
import { prisma } from '../../lib/prisma';

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id');
    const idRequest = Number(idParam);

    if (!idParam || !Number.isInteger(idRequest) || idRequest <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid income ID',
        });
    }

    const existing = await prisma.income.findUnique({ where: { id: idRequest } });
    if (!existing) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Income not found',
        });
    }

    await prisma.income.delete({
        where: { id: idRequest },
    });

    return { success: true };
});
