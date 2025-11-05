'use client';

import { Difficulty, Category } from '@/types/game';

interface DifficultySelectionProps {
  category: Category;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficulties: { name: Difficulty; description: string }[] = [
  { name: 'Easy', description: 'Major events and well-known locations' },
  { name: 'Medium', description: 'Requires solid historical knowledge' },
  { name: 'Hard', description: 'Detailed knowledge required' },
  { name: 'Professor', description: 'Expert level - very challenging' },
];

export default function DifficultySelection({
  category,
  onSelectDifficulty,
  onBack,
}: DifficultySelectionProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <button
          onClick={onBack}
          className="mb-8 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-light text-gray-900 text-center mb-2">
          {category}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Select difficulty
        </p>

        <div className="space-y-3">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.name}
              onClick={() => onSelectDifficulty(difficulty.name)}
              className="w-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg p-4 text-left border border-gray-200 hover:border-gray-300"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                {difficulty.name}
              </h2>
              <p className="text-sm text-gray-600">{difficulty.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}