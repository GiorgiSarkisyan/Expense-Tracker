import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://iiohsmrbbtopcsezwkhb.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpb2hzbXJiYnRvcGNzZXp3a2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NDc4MDUsImV4cCI6MjA0NTQyMzgwNX0.QP8cci5xtdy8wF7-7WIaWU51WE-7-Hycfv-40va2nP8";

export const supabase = createClient(supabaseUrl, supabaseKey);
