'use client';

import { Category } from '@/types/game';

interface CategorySelectionProps {
  onSelectCategory: (category: Category) => void;
}

const categories: { name: Category; description: string }[] = [
  { name: 'WW1', description: 'World War I (1914-1918)' },
  { name: 'WW2', description: 'World War II (1939-1945)' },
  { name: 'Cold War', description: 'Cold War Era (1947-1991)' },
  { name: 'Ancient Rome', description: 'Roman Empire & Republic' },
];

export default function CategorySelection({ onSelectCategory }: CategorySelectionProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-light text-gray-900 text-center mb-2">
          Geo History Guesser
        </h1>
        <p className="text-sm text-gray-500 text-center mb-12">
          Choose a historical period
        </p>

        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className="w-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg p-4 text-left border border-gray-200 hover:border-gray-300"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                {category.name}
              </h2>
              <p className="text-sm text-gray-600">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}