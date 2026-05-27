import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lpycoycpkcqsvdfatyjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweWNveWNwa2Nxc3ZkZmF0eWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDAzMzEsImV4cCI6MjA5NDkxNjMzMX0.rdBPAj2L-hjQG1Prks9yPVXliL2JwydPO1J_1w6ekpg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seed() {
  try {
    const toolsData = JSON.parse(fs.readFileSync(path.resolve('docs/tools.json'), 'utf8'));
    console.log(`Read ${toolsData.tools.length} tools.`);

    // Omit deep_dive since it's not in the database table schema
    const tools = toolsData.tools.map((t) => ({
      id: slugify(t.title),
      category: t.category,
      title: t.title,
      definition: t.definition,
      example: t.example
    }));

    console.log('Seeding tools (without deep_dive)...');
    const { data: toolsResult, error: toolsError } = await supabase
      .from('tools')
      .upsert(tools, { onConflict: 'id' })
      .select();

    if (toolsError) {
      console.error('Error seeding tools:', toolsError);
    } else {
      console.log('Successfully seeded tools:', toolsResult?.length);
    }
  } catch (err) {
    console.error('Seed exception:', err);
  }
}

seed();
