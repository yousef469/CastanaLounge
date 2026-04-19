import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdvnlofgsyvnsenpyoef.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdm5sb2Znc3l2bnNlbnB5b2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Nzc0MTYsImV4cCI6MjA5MjE1MzQxNn0.H4fM_5Cgt7hMZ6K9-cz6Z0DxIi-_D3t3D2lDzYmeQsw';

export const supabase = createClient(supabaseUrl, supabaseKey);
