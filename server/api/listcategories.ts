import { defineEventHandler, getQuery } from "nitro/h3";
import { prisma } from "../lib/prisma";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const toPositiveInt = (value: unknown, fallback: number): number => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }

    const rounded = Math.floor(parsed);
    if (rounded < 0) {
        return fallback;
    }

    return rounded;
};

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const limitCandidate = toPositiveInt(query.limit, DEFAULT_LIMIT);
    const top = toPositiveInt(query.top, 0);
    const limit = Math.min(Math.max(limitCandidate, 1), MAX_LIMIT);

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            orderBy: { id: "asc" },
            take: limit,
            skip: top,
        }),
        prisma.category.count(),
    ]);

    return {
        categories,
        total,
        limit,
        top,
        hasMore: top + categories.length < total,
    };
});