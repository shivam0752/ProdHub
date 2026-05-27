import fs from 'fs';
import path from 'path';

function cleanUrl(url) {
  if (!url) return '';
  let clean = url.replace(/^VERIFY:/i, '').trim();
  const match = clean.match(/^\[(.*?)\]\((.*?)\)$/);
  if (match) {
    const text = match[1];
    const href = match[2];
    if (text.startsWith('http')) {
      return text;
    }
    return href || text;
  }
  return clean;
}

function escapeSql(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function generate() {
  const resourcesPath = path.resolve('docs/resources.json');
  if (!fs.existsSync(resourcesPath)) {
    console.error('Error: docs/resources.json not found');
    return;
  }

  const data = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
  const items = data.resources;

  let sql = `-- =====================================================\n`;
  sql += `-- SQL Script to populate resources table\n`;
  sql += `-- Run this in your Supabase SQL Editor (bypasses RLS)\n`;
  sql += `-- =====================================================\n\n`;
  
  items.forEach(item => {
    const cleanLink = cleanUrl(item.url);
    const tagsArray = item.tags && item.tags.length > 0 
      ? `ARRAY[${item.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]::text[]` 
      : 'ARRAY[]::text[]';
    
    sql += `INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)\n`;
    sql += `SELECT \n`;
    sql += `  ${escapeSql(item.type)},\n`;
    sql += `  ${escapeSql(item.title)},\n`;
    sql += `  ${escapeSql(cleanLink)},\n`;
    sql += `  ${escapeSql(item.description)},\n`;
    sql += `  ${escapeSql(item.editorial_note)},\n`;
    sql += `  ${tagsArray},\n`;
    sql += `  true\n`;
    sql += `WHERE NOT EXISTS (\n`;
    sql += `  SELECT 1 FROM public.resources WHERE title = ${escapeSql(item.title)}\n`;
    sql += `);\n\n`;
  });

  const outputPath = path.resolve('docs/insert_resources.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`Successfully generated SQL insert script at ${outputPath}`);
}

generate();
