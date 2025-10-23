'use client';

import { useEffect, useState, use } from 'react';
import { supabase, Player, GameSession } from '@/lib/supabase';
import { QUESTIONS, QUESTION_TIME_LIMIT, BASE_POINTS, SPEED_BONUS_MAX } from '@/lib/questions';
import AnswerButton from '@/components/AnswerButton';
import QuestionCard from '@/components/QuestionCard';
import Leaderboard from '@/components/Leaderboard';
import { motion, AnimatePresence } from 'framer-motion';
import { RealtimeChannel } from '@supabase/supabase-js';

type GamePhase = 'lobby' | 'question' | 'feedback' | 'leaderboard' | 'final';

export default function PlayerGamePage({ params }: { params: Promise<{ pin: string }> }) {
  const { pin } = use(params);
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [answerStartTime, setAnswerStartTime] = useState<number>(0);
  const [myScore, setMyScore] = useState(0);

  useEffect(() => {
    const storedPlayerId = sessionStorage.getItem('playerId');
    const storedPlayerName = sessionStorage.getItem('playerName');

    if (storedPlayerId) setPlayerId(storedPlayerId);
    if (storedPlayerName) setPlayerName(storedPlayerName);

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
      setCurrentQuestionIndex(data.current_question_index);
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

      // Update own score
      const me = data.find((p) => p.id === playerId);
      if (me) setMyScore(me.total_score);
    }
  };

  const setupRealtimeChannel = () => {
    const gameChannel = supabase.channel(`game:${pin}`);

    gameChannel
      .on('broadcast', { event: 'game_start' }, () => {
        setPhase('question');
        setAnswerStartTime(Date.now());
      })
      .on('broadcast', { event: 'next_question' }, (payload) => {
        setCurrentQuestionIndex(payload.payload.questionIndex);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setPhase('question');
        setAnswerStartTime(Date.now());
      })
      .on('broadcast', { event: 'show_results' }, (payload) => {
        setCorrectAnswer(payload.payload.correctAnswer);
        setPhase('feedback');
        setTimeout(() => {
          setPhase('leaderboard');
          if (session) loadPlayers(session.id);
        }, 3000);
      })
      .on('broadcast', { event: 'game_end' }, () => {
        setPhase('final');
        if (session) loadPlayers(session.id);
      })
      .subscribe();

    setChannel(gameChannel);
  };

  const submitAnswer = async (answer: 'A' | 'B' | 'C' | 'D') => {
    if (!session || !playerId || selectedAnswer) return;

    setSelectedAnswer(answer);

    const responseTime = Date.now() - answerStartTime;
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Save answer to database
    await supabase.from('answers').insert({
      session_id: session.id,
      player_id: playerId,
      question_index: currentQuestionIndex,
      selected_answer: answer,
      is_correct: isCorrect,
      response_time_ms: responseTime,
    });

    // Notify host
    channel?.send({
      type: 'broadcast',
      event: 'answer_submitted',
      payload: { playerId },
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {phase === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto text-center flex flex-col items-center justify-center min-h-screen"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-4xl">
                {playerName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{playerName}</h2>
              <p className="text-gray-600 text-lg mb-6">You're in!</p>
              <div className="bg-purple-100 rounded-xl p-6">
                <div className="text-6xl mb-2">⏳</div>
                <p className="text-purple-800 font-semibold">Waiting for host to start the game...</p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={QUESTIONS.length}
              />
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <AnswerButton
                  key={option.letter}
                  letter={option.letter}
                  text={option.text}
                  onClick={() => submitAnswer(option.letter)}
                  disabled={selectedAnswer !== null}
                  selected={selectedAnswer === option.letter}
                />
              ))}
            </div>

            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-2">✅</div>
                <p className="text-xl font-bold text-gray-900">Answer submitted!</p>
                <p className="text-gray-600">Waiting for other players...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto flex items-center justify-center min-h-screen"
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
              {selectedAnswer === correctAnswer ? (
                <>
                  <div className="text-8xl mb-4">🎉</div>
                  <h2 className="text-5xl font-black text-green-600 mb-4">Correct!</h2>
                  <p className="text-2xl text-gray-700">Great job!</p>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-4">😕</div>
                  <h2 className="text-5xl font-black text-red-600 mb-4">Incorrect</h2>
                  <p className="text-2xl text-gray-700 mb-2">The correct answer was:</p>
                  <div className="text-4xl font-bold text-purple-600">{correctAnswer}</div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {(phase === 'leaderboard' || phase === 'final') && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            {phase === 'final' ? (
              <div className="text-center mb-8">
                <h1 className="text-5xl font-black text-white mb-4">Game Over!</h1>
                <div className="bg-white rounded-2xl p-6 inline-block">
                  <p className="text-gray-600 text-lg mb-2">Your Final Score</p>
                  <p className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {myScore.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <h2 className="text-4xl font-bold text-white text-center mb-6">Current Standings</h2>
            )}

            <Leaderboard players={players} showTop={10} highlightPlayerId={playerId || undefined} />

            {phase !== 'final' && (
              <div className="text-center mt-8 text-white text-xl">
                Next question coming up...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
