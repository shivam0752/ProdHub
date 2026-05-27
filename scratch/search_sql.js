import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve('docs/insert_resources.sql'), 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  // Let's find any occurrences of the word "product" (case insensitive)
  const matches = [...line.matchAll(/product/gi)];
  if (matches.length > 0) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
