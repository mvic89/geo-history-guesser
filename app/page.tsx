'use client';

import { useState, useEffect } from 'react';
import CategorySelection from '@/components/CategorySelection';
import DifficultySelection from '@/components/DifficultySelection';
import GamePlay from '@/components/GamePlay';
import Scoreboard from '@/components/Scoreboard';
import { GameState, Category, Difficulty, GameRound } from '@/types/game';
import { generateRandomPin } from '@/lib/utils';

type GameScreen = 'category' | 'difficulty' | 'loading' | 'playing' | 'scoreboard';

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>('category');
  const [gameState, setGameState] = useState<GameState>({
    category: null,
    difficulty: null,
    currentRound: 0,
    totalRounds: 3,
    score: 0,
    rounds: [],
    userPin: null,
    hasSubmittedPin: false,
    currentFollowUpIndex: 0,
    roundScores: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCategory = (category: Category) => {
    setGameState((prev) => ({ ...prev, category }));
    setScreen('difficulty');
  };

  const handleSelectDifficulty = async (difficulty: Difficulty) => {
    setGameState((prev) => ({ ...prev, difficulty }));
    setScreen('loading');
    setIsLoading(true);
    setError(null);

    try {
      // Generate all 3 rounds
      const rounds: GameRound[] = [];
      
      for (let i = 0; i < 3; i++) {
        const response = await fetch('/api/generate-round', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: gameState.category,
            difficulty,
            roundNumber: i + 1,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate round');
        }

        const round: GameRound = await response.json();
        rounds.push(round);
      }

      // Generate initial random pin
      const initialPin = generateRandomPin(
        rounds[0].locationQuestion.coordinates,
        100,
        800
      );

      setGameState((prev) => ({
        ...prev,
        rounds,
        userPin: initialPin,
      }));

      setScreen('playing');
    } catch (err) {
      console.error('Error generating rounds:', err);
      setError('Failed to generate game. Please try again.');
      setScreen('difficulty');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const handleFinishGame = () => {
    setScreen('scoreboard');
  };

  const handlePlayAgain = () => {
    setGameState({
      category: null,
      difficulty: null,
      currentRound: 0,
      totalRounds: 3,
      score: 0,
      rounds: [],
      userPin: null,
      hasSubmittedPin: false,
      currentFollowUpIndex: 0,
      roundScores: [],
    });
    setScreen('category');
    setError(null);
  };

  const handleBackToCategory = () => {
    setScreen('category');
    setGameState((prev) => ({ ...prev, category: null, difficulty: null }));
  };

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-xl">Generating your historical adventure...</p>
          <p className="text-blue-200 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-8">
        <div className="bg-red-500/20 border border-red-400 rounded-xl p-8 max-w-md">
          <p className="text-white text-xl font-semibold mb-4">⚠️ Error</p>
          <p className="text-white mb-6">{error}</p>
          <button
            onClick={handleBackToCategory}
            className="w-full bg-white text-blue-900 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Back to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === 'category' && (
        <CategorySelection onSelectCategory={handleSelectCategory} />
      )}
      {screen === 'difficulty' && gameState.category && (
        <DifficultySelection
          category={gameState.category}
          onSelectDifficulty={handleSelectDifficulty}
          onBack={handleBackToCategory}
        />
      )}
      {screen === 'playing' && (
        <GamePlay
          gameState={gameState}
          onUpdateGameState={handleUpdateGameState}
          onFinishGame={handleFinishGame}
        />
      )}
      {screen === 'scoreboard' && (
        <Scoreboard gameState={gameState} onPlayAgain={handlePlayAgain} />
      )}
    </>
  );
}