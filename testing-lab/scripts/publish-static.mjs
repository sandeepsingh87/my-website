import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

execSync('npm run build', { cwd: root, stdio: 'inherit' });

const assets = resolve(root, 'assets');
if (existsSync(assets)) rmSync(assets, { recursive: true, force: true });
cpSync(resolve(root, 'dist/assets'), assets, { recursive: true });
cpSync(resolve(root, 'dist/index.html'), resolve(root, 'index.html'));
mkdirSync(resolve(root, 'money-transfer'), { recursive: true });
cpSync(resolve(root, 'dist/index.html'), resolve(root, 'money-transfer/index.html'));
