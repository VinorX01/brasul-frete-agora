
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbixmwimnpetcnhmxctu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaXhtd2ltbnBldGNuaG14Y3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTE0OTYsImV4cCI6MjA2MjIyNzQ5Nn0.aNWyizl2RJheA8qrTocY995hzT0Dm1IFpTbDlJb4MCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Freight = {
  id: string;
  origin: string;
  destination: string;
  cargo_type: string;
  truck_type: string;
  value: number | null;
  contact: string;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
  // New fields added
  weight: number | null;
  refrigerated: boolean;
  requires_mopp: boolean;
  toll_included: boolean;
  loading_date: string | null;
};

export type Agent = {
  id: string;
  code: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  created_at: string;
};

export type FreightAgentReferral = {
  id: string;
  freight_id: string;
  agent_code: string;
  contact_date: string | null;
  created_at: string;
};
