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
  // Existing new fields
  weight: number | null;
  refrigerated: boolean;
  requires_mopp: boolean;
  toll_included: boolean;
  loading_date: string | null;
  // Newly added fields
  expected_delivery_date: string | null;
  sender_company: string | null;
  cargo_content: string | null;
  live_cargo: boolean;
  dry_cargo: boolean;
  freight_distance: number | null;
  has_insurance: boolean;
  has_tracker: boolean;
  observations: string | null;
  tarp_required: boolean;
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
