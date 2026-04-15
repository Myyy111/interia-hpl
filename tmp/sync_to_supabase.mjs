import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://eojvrxbdzssfwalpbjgg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvanZyeGJkenNzZndhbHBiamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzI0MzksImV4cCI6MjA4OTI0ODQzOX0.2JpC8gHqQr92ZHudBXC9PUnKX2CWrYF-jHcWaD3WTwQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log('Reading backup file...');
    const backupData = JSON.parse(fs.readFileSync('data/database_backup_20260315.json', 'utf8'));

    // Update branding from "Interia" to "Afandi Interior" if needed
    // (Although we saw earlier that Supabase already has some "Afandi Interior" stuff, 
    // let's make sure the WHOLE backup is clean).
    
    // We'll just use the current defaultData from code instead of backup if it's more up to date?
    // Actually, let's just use the backup but perform regex replacement for "Interia" -> "Afandi Interior"
    let jsonStr = JSON.stringify(backupData);
    jsonStr = jsonStr.replace(/Interia/g, 'Afandi Interior');
    const updatedData = JSON.parse(jsonStr);

    console.log('Updating Supabase...');
    const { error } = await supabase
        .from('website_data')
        .update({ content: updatedData })
        .eq('id', 'primary_data');

    if (error) {
        console.error('Update error:', error);
    } else {
        console.log('Successfully updated web online data!');
    }
}

sync();
