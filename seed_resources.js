import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env configuration
const envPath = path.resolve('.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseAnonKey = keyMatch[1].trim();
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Parses and cleans markdown-formatted link wrappers in resources.json
 */
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

async function seed() {
  try {
    const resourcesPath = path.resolve('docs/resources.json');
    if (!fs.existsSync(resourcesPath)) {
      console.error(`Error: ${resourcesPath} not found.`);
      return;
    }

    const resourcesData = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
    const items = resourcesData.resources;
    console.log(`Read ${items.length} resources from JSON.`);

    // Fetch existing resources from database to prevent duplication
    const { data: existing, error: fetchError } = await supabase
      .from('resources')
      .select('id, title');

    if (fetchError) {
      console.error('Error fetching existing resources:', fetchError);
      return;
    }

    const existingMap = new Map();
    if (existing) {
      existing.forEach(r => existingMap.set(r.title.toLowerCase().trim(), r.id));
    }

    let inserted = 0;
    let updated = 0;

    for (const item of items) {
      const cleanLink = cleanUrl(item.url);
      const payload = {
        type: item.type,
        title: item.title,
        url: cleanLink,
        description: item.description || '',
        editorial_note: item.editorial_note,
        tags: item.tags || [],
        approved: true
      };

      const key = item.title.toLowerCase().trim();
      if (existingMap.has(key)) {
        // Update existing row
        const id = existingMap.get(key);
        const { error: updateError } = await supabase
          .from('resources')
          .update(payload)
          .eq('id', id);

        if (updateError) {
          console.error(`Error updating "${item.title}":`, updateError);
        } else {
          updated++;
        }
      } else {
        // Insert new row
        const { error: insertError } = await supabase
          .from('resources')
          .insert([payload]);

        if (insertError) {
          console.error(`Error inserting "${item.title}":`, insertError);
        } else {
          inserted++;
        }
      }
    }

    console.log(`Seeding complete: ${inserted} inserted, ${updated} updated.`);
  } catch (err) {
    console.error('Seed exception:', err);
  }
}

seed();
