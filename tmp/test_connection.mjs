import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvbiedvvrjzinnlcyzhg.supabase.co';
const supabaseKey = 'sb_publishable_oB47y0fDYvo_j_DKDZxRWQ_-HL3zqCj';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing connection to:', supabaseUrl);
    const { data, error } = await supabase.from('website_data').select('*');
    if (error) {
        console.error('Connection error:', error);
    } else {
        console.log('Connection successful! Found', data.length, 'rows.');
    }
}

test();
