const SUPABASE_URL = "https://jjpirnscyimjehosmhyg.supabase.co/rest/v1/";

const SUPABASE_ANON_KEY =
"sb_publishable_6s2X7E-26Q7xp_xCOc6_gQ_DvX1cM03";

window.supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);