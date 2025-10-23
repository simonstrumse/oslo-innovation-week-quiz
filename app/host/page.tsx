'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function HostPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const createGame = async () => {
    setCreating(true);
    try {
      const pin = generatePin();

      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          pin,
          status: 'lobby',
          current_question_index: 0,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/host/${pin}`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game. Please try again.');
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Oslo Innovation Week Quiz
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Host a live quiz game for your audience
        </p>

        <motion.button
          onClick={createGame}
          disabled={creating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            w-full bg-gradient-to-r from-purple-600 to-blue-600
            text-white font-bold py-6 px-8 rounded-xl text-xl
            hover:shadow-2xl transition-shadow duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {creating ? 'Creating Game...' : 'Create New Game'}
        </motion.button>

        <div className="mt-8 text-sm text-gray-500">
          <p>10 questions about Oslo Innovation Week</p>
          <p className="mt-2">Players join via PIN on their devices</p>
        </div>
      </motion.div>
    </div>
  );
}
