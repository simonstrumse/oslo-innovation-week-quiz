'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/lib/supabase';

interface LeaderboardProps {
  players: Player[];
  showTop?: number;
  highlightPlayerId?: string;
}

export default function Leaderboard({ players, showTop = 10, highlightPlayerId }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.total_score - a.total_score);
  const displayPlayers = showTop ? sortedPlayers.slice(0, showTop) : sortedPlayers;

  const getMedalEmoji = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">Leaderboard</h2>
      <AnimatePresence mode="popLayout">
        {displayPlayers.map((player, index) => {
          const medal = getMedalEmoji(index);
          const isHighlighted = player.id === highlightPlayerId;

          return (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`
                ${isHighlighted ? 'bg-yellow-400 text-gray-900' : 'bg-white'}
                rounded-lg p-4 mb-3 shadow-lg
                flex items-center justify-between
              `}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`
                  text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-lg
                  ${index < 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  {medal || index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl">{player.name}</div>
                </div>
              </div>
              <div className="text-3xl font-black">
                {player.total_score.toLocaleString()}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
