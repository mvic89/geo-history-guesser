'use client';

import { Difficulty, Category } from '@/types/game';

interface DifficultySelectionProps {
  category: Category;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficulties: { name: Difficulty; description: string; color: string }[] = [
  { name: 'Easy', description: 'Major events and well-known locations', color: 'bg-green-500 hover:bg-green-600' },
  { name: 'Medium', description: 'Requires good historical knowledge', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { name: 'Hard', description: 'Detailed knowledge required', color: 'bg-orange-500 hover:bg-orange-600' },
  { name: 'Professor', description: 'Expert level - very challenging!', color: 'bg-red-500 hover:bg-red-600' },
];

export default function DifficultySelection({
  category,
  onSelectDifficulty,
  onBack,
}: DifficultySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <button
          onClick={onBack}
          className="mb-8 text-blue-200 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to categories
        </button>

        <h1 className="text-4xl font-bold text-white text-center mb-3">
          {category}
        </h1>
        <p className="text-xl text-blue-200 text-center mb-12">
          Choose your difficulty level
        </p>

        <div className="space-y-4">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.name}
              onClick={() => onSelectDifficulty(difficulty.name)}
              className={`w-full ${difficulty.color} text-white rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 transform shadow-lg`}
            >
              <h2 className="text-2xl font-bold mb-2">{difficulty.name}</h2>
              <p className="text-white/90">{difficulty.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
