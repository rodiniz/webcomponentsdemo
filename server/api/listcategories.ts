import { defineHandler } from "nitro/h3";
import { prisma } from "../lib/prisma";

export default defineHandler(async () => {
    const categories = await prisma.category.findMany();
    return {    
        categories
    };
});