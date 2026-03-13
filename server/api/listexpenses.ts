import { defineEventHandler, getQuery } from "nitro/h3";
import { prisma } from "../lib/prisma";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

type ExpenseWithCategory = {
    id: number;
    amount: number;
    description: string | null;
    categoryId: number | null;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    category: {
        name: string;
        description: string | null;
    } | null;
};

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

    const [expensesRaw, total] = await Promise.all([
        prisma.expense.findMany({
            orderBy: { id: "asc" },
            take: limit,
            skip: top,
            include: {
                category: {
                    select: {
                        name: true,
                        description: true,
                    },
                },
            },
        }),
        prisma.expense.count(),
    ]) as [ExpenseWithCategory[], number];

    const expenses = expensesRaw.map((expense) => ({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        categoryId: expense.categoryId,
        date: expense.date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
        categoryDescription: expense.category?.name || '',
    }));

    return {
        expenses,
        total        
    };
});