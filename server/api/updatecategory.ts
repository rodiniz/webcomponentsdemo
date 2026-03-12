import { createError, defineEventHandler, readBody } from 'nitro/h3';
import { prisma } from '../lib/prisma';

type UpdateCategoryBody = {
    id?: number;
    name?: string;
    description?: string | null;
};

export default defineEventHandler(async (event) => {
    const body = await readBody<UpdateCategoryBody>(event);
    const id = Number(body?.id);
    const name = body?.name?.trim();
    const description = body?.description?.trim();

    if (!Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid category id is required',
        });
    }

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Category name is required',
        });
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Category not found',
        });
    }

    const category = await prisma.category.update({
        where: { id },
        data: {
            name,
            description: description || null,
        },
    });

    return {
        success: true,
        category,
    };
});