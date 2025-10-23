'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function PlayPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const joinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setJoining(true);

    try {
      // Validate PIN
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('pin', pin)
        .single();

      if (sessionError || !session) {
        setError('Invalid PIN. Please check and try again.');
        setJoining(false);
        return;
      }

      if (session.status !== 'lobby') {
        setError('This game has already started.');
        setJoining(false);
        return;
      }

      // Check for duplicate name
      const { data: existingPlayers } = await supabase
        .from('players')
        .select('name')
        .eq('session_id', session.id);

      let finalName = name;
      if (existingPlayers?.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        let counter = 2;
        while (existingPlayers.some((p) => p.name.toLowerCase() === `${name} (${counter})`.toLowerCase())) {
          counter++;
        }
        finalName = `${name} (${counter})`;
      }

      // Create player
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          session_id: session.id,
          name: finalName,
          total_score: 0,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      // Store player ID in sessionStorage for reconnection
      sessionStorage.setItem('playerId', player.id);
      sessionStorage.setItem('playerName', finalName);

      // Notify host via broadcast
      const channel = supabase.channel(`game:${pin}`);
      await channel.subscribe();
      await channel.send({
        type: 'broadcast',
        event: 'player_joined',
        payload: { playerId: player.id },
      });

      router.push(`/play/${pin}`);
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game. Please try again.');
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-4xl font-black mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Join Quiz
        </h1>
        <p className="text-gray-600 text-center mb-8">Enter the PIN from the host screen</p>

        <form onSubmit={joinGame} className="space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-semibold text-gray-700 mb-2">
              Game PIN
            </label>
            <input
              id="pin"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              className="
                w-full px-6 py-4 text-3xl font-bold text-center
                border-4 border-gray-300 rounded-xl
                focus:border-blue-500 focus:outline-none
                transition-colors
              "
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="Enter your name"
              maxLength={20}
              required
              className="
                w-full px-6 py-4 text-xl
                border-4 border-gray-300 rounded-xl
                focus:border-blue-500 focus:outline-none
                transition-colors
              "
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={joining || pin.length !== 6 || name.trim().length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              w-full bg-gradient-to-r from-blue-600 to-purple-600
              text-white font-bold py-5 px-8 rounded-xl text-xl
              hover:shadow-2xl transition-shadow duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {joining ? 'Joining...' : 'Join Game'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
