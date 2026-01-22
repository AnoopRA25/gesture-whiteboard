import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eknyvmhavhajepwbhbkx.supabase.co";
const supabaseAnonKey = "sb_publishable_tAkIYb8ndPVAm6l1fzcemw_34PDOMv0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
