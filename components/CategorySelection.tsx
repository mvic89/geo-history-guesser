'use client';

import { Category } from '@/types/game';

interface CategorySelectionProps {
  onSelectCategory: (category: Category) => void;
}

const categories: { name: Category; description: string; emoji: string }[] = [
  { name: 'WW1', description: 'The Great War (1914-1918)', emoji: '🪖' },
  { name: 'WW2', description: 'World War II (1939-1945)', emoji: '✈️' },
  { name: 'Cold War', description: 'Cold War Era (1947-1991)', emoji: '🧊' },
  { name: 'Ancient Rome', description: 'Roman Empire & Republic', emoji: '🏛️' },
];

export default function CategorySelection({ onSelectCategory }: CategorySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Geo History Guesser
        </h1>
        <p className="text-xl text-blue-200 text-center mb-12">
          Test your knowledge of historical geography
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-xl p-8 text-left border border-white/20 hover:border-white/40 hover:scale-105 transform"
            >
              <div className="text-5xl mb-4">{category.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {category.name}
              </h2>
              <p className="text-blue-200">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
