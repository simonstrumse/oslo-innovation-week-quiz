import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.fake';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type GameSession = {
  id: string;
  pin: string;
  status: 'lobby' | 'active' | 'completed';
  current_question_index: number;
  created_at: string;
};

export type Player = {
  id: string;
  session_id: string;
  name: string;
  total_score: number;
  joined_at: string;
};

export type Answer = {
  id: string;
  session_id: string;
  player_id: string;
  question_index: number;
  selected_answer: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
  response_time_ms: number;
  answered_at: string;
};
