import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const source = 'data/app.db';
const target = '.output/data/app.db';

if (!existsSync(source)) {
  console.warn(`[prepare-preview-db] Skipped: source database not found at ${source}`);
  process.exit(0);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[prepare-preview-db] Copied ${source} -> ${target}`);
