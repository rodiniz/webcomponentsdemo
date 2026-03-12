import { createError, defineEventHandler, getRouterParam } from "nitro/h3";
import { prisma } from "../../lib/prisma";

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, "id");
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Valid category ID is required",
        });
    }

    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!category) {
        throw createError({
            statusCode: 404,
            statusMessage: "Category not found",
        });
    }

    return {
        success: true,
        category,
    };
});