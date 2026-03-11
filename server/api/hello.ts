import { prisma } from '../lib/prisma';
import { defineHandler } from 'nitro/h3';

export default defineHandler(async () => {
  const total = await prisma.note.count();

  return {
    api: 'works!',
    notes: total,
  };
});
