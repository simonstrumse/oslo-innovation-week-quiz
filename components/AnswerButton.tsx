'use client';

import { motion } from 'framer-motion';

interface AnswerButtonProps {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  correct?: boolean;
  showResult?: boolean;
}

const colorMap = {
  A: { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-white' },
  B: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-white' },
  C: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-white' },
  D: { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-white' },
};

export default function AnswerButton({
  letter,
  text,
  onClick,
  disabled = false,
  selected = false,
  correct = false,
  showResult = false,
}: AnswerButtonProps) {
  const colors = colorMap[letter];

  const getButtonClass = () => {
    if (showResult) {
      if (correct) return 'bg-green-600 ring-4 ring-green-300';
      if (selected && !correct) return 'bg-red-600 ring-4 ring-red-300 animate-shake';
      return 'bg-gray-400 opacity-50';
    }
    if (selected) return `${colors.bg} ring-4 ring-white scale-105`;
    return colors.bg;
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getButtonClass()}
        ${!disabled && !showResult ? colors.hover : ''}
        ${colors.text}
        w-full p-6 rounded-xl font-bold text-lg
        transition-all duration-200
        disabled:cursor-not-allowed
        flex items-center gap-4
      `}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center text-2xl font-black">
        {letter}
      </div>
      <span className="flex-1 text-left">{text}</span>
    </motion.button>
  );
}
