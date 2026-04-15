import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eojvrxbdzssfwalpbjgg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvanZyeGJkenNzZndhbHBiamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzI0MzksImV4cCI6MjA4OTI0ODQzOX0.2JpC8gHqQr92ZHudBXC9PUnKX2CWrYF-jHcWaD3WTwQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase
        .from('website_data')
        .select('content')
        .eq('id', 'primary_data')
        .single();

    if (data) {
        console.log('portfolio:', data.content.settings.portfolio);
    }
}

check();
