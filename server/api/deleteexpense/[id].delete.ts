import { defineEventHandler, getRouterParam } from "nitro/h3";
import { prisma } from "../../lib/prisma";

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, "id");
    const idRequest = Number(idParam);

    if (!idParam || !Number.isInteger(idRequest) || idRequest <= 0) {
        return({
            statusCode: 400,
            statusMessage: "Invalid expense ID",
        });
    }
    try {
        const result = await prisma.expense.delete({
                where: { id: idRequest },
        });
        if (!result) {
            return({
                statusCode: 404,
                statusMessage: "Expense not found",
            });
        }

    } catch (error) {        
        return({
            statusCode: 500,
            statusMessage:  error instanceof Error ? error.message : "Failed to delete expense",
        });
    }   

    return { success: true };
});
