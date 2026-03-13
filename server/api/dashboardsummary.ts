import { createError, defineEventHandler, getQuery } from 'nitro/h3';
import { prisma } from '../lib/prisma';

type ExpenseByCategoryItem = {
    category: string;
    total: number;
};

const parseDateAtBoundary = (value: unknown, endOfDay: boolean): Date | null => {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }

    const date = new Date(`${value}T00:00:00.000`);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    if (endOfDay) {
        date.setHours(23, 59, 59, 999);
    }

    return date;
};

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const from = parseDateAtBoundary(query.from, false);
    const to = parseDateAtBoundary(query.to, true);

    if (query.from && !from) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid from date',
        });
    }

    if (query.to && !to) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid to date',
        });
    }

    if (from && to && from > to) {
        throw createError({
            statusCode: 400,
            statusMessage: 'From date must be before or equal to To date',
        });
    }

    const rangeFilter = from || to
        ? {
            date: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
            },
        }
        : undefined;

    const [incomeAgg, expenseAgg, incomeCount, expenseCount, expenseGroups] = await Promise.all([
        prisma.income.aggregate({
            where: rangeFilter,
            _sum: { amount: true },
        }),
        prisma.expense.aggregate({
            where: rangeFilter,
            _sum: { amount: true },
        }),
        prisma.income.count({ where: rangeFilter }),
        prisma.expense.count({ where: rangeFilter }),
        prisma.expense.groupBy({
            by: ['categoryId'],
            where: rangeFilter,
            _sum: { amount: true },
        }),
    ]);

    const categoryIds = expenseGroups
        .map((group) => group.categoryId)
        .filter((categoryId): categoryId is number => categoryId !== null);

    const categories = categoryIds.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true },
        })
        : [];

    const categoryNameById = new Map<number, string>();
    categories.forEach((category) => {
        categoryNameById.set(category.id, category.name);
    });

    const expenseByCategory: ExpenseByCategoryItem[] = expenseGroups
        .map((group) => {
            const total = Number(group._sum.amount ?? 0);
            if (total <= 0) {
                return null;
            }

            return {
                category: group.categoryId === null
                    ? 'Uncategorized'
                    : (categoryNameById.get(group.categoryId) ?? `Category #${group.categoryId}`),
                total,
            };
        })
        .filter((item): item is ExpenseByCategoryItem => item !== null)
        .sort((a, b) => b.total - a.total);

    const incomeTotal = Number(incomeAgg._sum.amount ?? 0);
    const expenseTotal = Number(expenseAgg._sum.amount ?? 0);
    const transactionCount = incomeCount + expenseCount;

    return {
        incomeTotal,
        expenseTotal,
        balance: incomeTotal - expenseTotal,
        transactionCount,
        expenseByCategory,
        from: from ? from.toISOString() : null,
        to: to ? to.toISOString() : null,
    };
});