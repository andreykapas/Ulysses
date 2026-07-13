import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const contentRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');

function walkJsonFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walkJsonFiles(path, files);
    } else if (entry.endsWith('.json')) {
      files.push(path);
    }
  }
  return files;
}

test('content JSON must not use Latin e-diaeresis instead of Cyrillic yo', () => {
  const offenders = [];

  for (const file of walkJsonFiles(contentRoot)) {
    const text = readFileSync(file, 'utf8');
    if (/[ëË]/.test(text)) {
      offenders.push(file.replace(/\\/g, '/'));
    }
  }

  assert.equal(
    offenders.length,
    0,
    `Latin ë/Ë found in content JSON:\n${offenders.join('\n')}`,
  );
});
