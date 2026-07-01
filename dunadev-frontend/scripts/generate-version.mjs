import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

mkdirSync(resolve(root, 'src/environments'), { recursive: true });
writeFileSync(
  resolve(root, 'src/environments/version.generated.ts'),
  `export const FRONTEND_VERSION = '${version}';\n`,
);
console.log(`[generate-version] frontend version: ${version}`);
