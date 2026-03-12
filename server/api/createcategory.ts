import { createError, defineEventHandler, readBody } from 'nitro/h3';
import { prisma } from '../lib/prisma';



export default defineEventHandler(async (event) => {
    const request = await readBody(event) as any;
    const name = request?.name?.trim();
    const description = request?.description?.trim();

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Category name is required',
        });
    }

    const category = await prisma.category.create({
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