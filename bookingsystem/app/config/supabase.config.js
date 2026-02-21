import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-key';

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials are not set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
