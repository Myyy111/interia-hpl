import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://eojvrxbdzssfwalpbjgg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvanZyeGJkenNzZndhbHBiamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzI0MzksImV4cCI6MjA4OTI0ODQzOX0.2JpC8gHqQr92ZHudBXC9PUnKX2CWrYF-jHcWaD3WTwQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    try {
        const backupPath = path.join(process.cwd(), 'data', 'database_backup_20260315.json');
        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

        console.log('Seeding Supabase with local data...');

        // Replace branding in the backup data before seeding
        let contentStr = JSON.stringify({
            products: backupData.products,
            materials: backupData.materials,
            accessories: backupData.accessories,
            settings: backupData.settings
        });
        
        contentStr = contentStr.replace(/Interia/g, 'Afandi Interior');
        const content = JSON.parse(contentStr);

        const { data, error } = await supabase
            .from('website_data')
            .upsert({ id: 'primary_data', content: content });

        if (error) {
            console.error('Error seeding data:', error);
            if (error.code === '42P01') {
                console.error('Table "website_data" does not exist! Please create it in Supabase.');
            }
        } else {
            console.log('Data successfully uploaded to Supabase!');
        }
    } catch (err) {
        console.error('Seeding process failed:', err);
    }
}

seed();
