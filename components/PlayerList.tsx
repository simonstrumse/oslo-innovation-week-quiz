'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/lib/supabase';

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white">
          {players.length} {players.length === 1 ? 'Player' : 'Players'} Joined
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center font-semibold text-gray-800 truncate">
                {player.name}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
