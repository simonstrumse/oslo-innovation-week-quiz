'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
            Oslo Innovation Week Quiz
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-12 font-light">
            Live multiplayer quiz game • 10 questions • Real-time leaderboard
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link href="/host">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                bg-white text-purple-600 font-black py-6 px-12 rounded-2xl text-2xl
                shadow-2xl hover:shadow-3xl transition-all duration-300
                min-w-[250px]
              "
            >
              🎮 Host Game
            </motion.button>
          </Link>

          <Link href="/play">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-white font-black py-6 px-12 rounded-2xl text-2xl
                shadow-2xl hover:shadow-3xl transition-all duration-300
                min-w-[250px]
              "
            >
              🎯 Join Game
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-white"
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-time Sync</h3>
            <p className="text-sm opacity-90">Instant updates across all devices using Supabase Realtime</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="text-xl font-bold mb-2">Live Leaderboard</h3>
            <p className="text-sm opacity-90">Watch rankings update after each question with speed bonuses</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6">
            <div className="text-5xl mb-3">📱</div>
            <h3 className="text-xl font-bold mb-2">Mobile Optimized</h3>
            <p className="text-sm opacity-90">Perfect on phones for players, desktop for hosts</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
