'use client';

import { motion } from 'framer-motion';
import { Question } from '@/lib/questions';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl">
        <div className="text-white text-sm font-semibold mb-4">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
          {question.text}
        </h2>
      </div>
    </motion.div>
  );
}
