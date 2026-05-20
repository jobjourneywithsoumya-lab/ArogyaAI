import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Vercel serverless only allows writes under /tmp */
export const getDataDir = () =>
  process.env.VERCEL ? join(tmpdir(), 'arogyaai-data') : join(__dirname, '..');
