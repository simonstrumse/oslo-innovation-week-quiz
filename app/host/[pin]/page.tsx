'use client';

import { useEffect, useState, use } from 'react';

export const dynamic = 'force-dynamic';
import { supabase, Player, GameSession } from '@/lib/supabase';
import { QUESTIONS, QUESTION_TIME_LIMIT, BASE_POINTS, SPEED_BONUS_MAX } from '@/lib/questions';
import PlayerList from '@/components/PlayerList';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import Leaderboard from '@/components/Leaderboard';
import { motion, AnimatePresence } from 'framer-motion';
import { RealtimeChannel } from '@supabase/supabase-js';

type GamePhase = 'lobby' | 'question' | 'results' | 'leaderboard' | 'final';

export default function HostGamePage({ params }: { params: Promise<{ pin: string }> }) {
  const { pin } = use(params);
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    loadSession();
    setupRealtimeChannel();

    return () => {
      channel?.unsubscribe();
    };
  }, [pin]);

  const loadSession = async () => {
    const { data } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('pin', pin)
      .single();

    if (data) {
      setSession(data);
      loadPlayers(data.id);
    }
  };

  const loadPlayers = async (sessionId: string) => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('session_id', sessionId)
      .order('total_score', { ascending: false });

    if (data) {
      setPlayers(data);
    }
  };

  const setupRealtimeChannel = () => {
    const gameChannel = supabase.channel(`game:${pin}`);

    gameChannel
      .on('broadcast', { event: 'player_joined' }, () => {
        if (session) loadPlayers(session.id);
      })
      .on('broadcast', { event: 'answer_submitted' }, () => {
        setAnsweredCount((prev) => prev + 1);
      })
      .subscribe();

    setChannel(gameChannel);
  };

  const startGame = async () => {
    if (!session) return;

    await supabase
      .from('game_sessions')
      .update({ status: 'active' })
      .eq('id', session.id);

    channel?.send({
      type: 'broadcast',
      event: 'game_start',
      payload: {},
    });

    setPhase('question');
    setTimerKey((prev) => prev + 1);
  };

  const handleTimerComplete = () => {
    showResults();
  };

  const showResults = async () => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];

    channel?.send({
      type: 'broadcast',
      event: 'show_results',
      payload: { correctAnswer: currentQuestion.correctAnswer },
    });

    // Calculate and update scores
    if (session) {
      await updateScores(session.id, currentQuestionIndex);
      await loadPlayers(session.id);
    }

    setPhase('leaderboard');

    // Auto-advance after 5 seconds
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        nextQuestion();
      } else {
        endGame();
      }
    }, 5000);
  };

  const updateScores = async (sessionId: string, questionIndex: number) => {
    const currentQuestion = QUESTIONS[questionIndex];

    // Get all answers for this question
    const { data: answers } = await supabase
      .from('answers')
      .select('*')
      .eq('session_id', sessionId)
      .eq('question_index', questionIndex);

    if (!answers) return;

    // Update each player's score
    for (const answer of answers) {
      if (answer.is_correct) {
        const speedBonus = Math.floor(
          (1 - answer.response_time_ms / (QUESTION_TIME_LIMIT * 1000)) * SPEED_BONUS_MAX
        );
        const points = BASE_POINTS + speedBonus;

        const { data: player } = await supabase
          .from('players')
          .select('total_score')
          .eq('id', answer.player_id)
          .single();

        if (player) {
          await supabase
            .from('players')
            .update({ total_score: player.total_score + points })
            .eq('id', answer.player_id);
        }
      }
    }
  };

  const nextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setAnsweredCount(0);

    if (session) {
      await supabase
        .from('game_sessions')
        .update({ current_question_index: nextIndex })
        .eq('id', session.id);
    }

    channel?.send({
      type: 'broadcast',
      event: 'next_question',
      payload: { questionIndex: nextIndex },
    });

    setPhase('question');
    setTimerKey((prev) => prev + 1);
  };

  const endGame = async () => {
    if (session) {
      await supabase
        .from('game_sessions')
        .update({ status: 'completed' })
        .eq('id', session.id);
    }

    channel?.send({
      type: 'broadcast',
      event: 'game_end',
      payload: {},
    });

    setPhase('final');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <AnimatePresence mode="wait">
        {phase === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-6xl font-black text-white mb-4">JOIN AT:</h1>
              <div className="text-white text-2xl mb-4">Play at: <span className="font-mono">quiz.yoursite.com/play</span></div>
              <div className="bg-white rounded-3xl p-12 inline-block shadow-2xl">
                <div className="text-8xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-wider">
                  {pin}
                </div>
              </div>
            </div>

            <PlayerList players={players} />

            <div className="text-center mt-12">
              <motion.button
                onClick={startGame}
                disabled={players.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  bg-gradient-to-r from-green-500 to-emerald-600
                  text-white font-bold py-6 px-16 rounded-xl text-2xl
                  hover:shadow-2xl transition-shadow duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Start Game
              </motion.button>
              {players.length === 0 && (
                <p className="text-white mt-4">Waiting for players to join...</p>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="text-white text-xl">
                {answeredCount} / {players.length} answered
              </div>
              <Timer
                key={timerKey}
                duration={QUESTION_TIME_LIMIT}
                onComplete={handleTimerComplete}
                isActive={true}
              />
            </div>

            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={QUESTIONS.length}
            />

            <div className="grid grid-cols-2 gap-6 mt-8">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.letter}
                  className="bg-white rounded-xl p-6 flex items-center gap-4"
                >
                  <div className={`
                    w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-black text-white
                    ${option.letter === 'A' ? 'bg-red-500' : ''}
                    ${option.letter === 'B' ? 'bg-blue-500' : ''}
                    ${option.letter === 'C' ? 'bg-yellow-500' : ''}
                    ${option.letter === 'D' ? 'bg-green-500' : ''}
                  `}>
                    {option.letter}
                  </div>
                  <span className="text-xl font-semibold">{option.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {(phase === 'leaderboard' || phase === 'final') && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            {phase === 'final' && (
              <h1 className="text-6xl font-black text-white text-center mb-8">
                Final Results!
              </h1>
            )}
            <Leaderboard players={players} showTop={10} />
            {phase === 'final' && (
              <div className="text-center mt-12">
                <motion.button
                  onClick={() => window.location.href = '/host'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    bg-gradient-to-r from-purple-600 to-blue-600
                    text-white font-bold py-6 px-16 rounded-xl text-2xl
                    hover:shadow-2xl transition-shadow duration-300
                  "
                >
                  Play Again
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
