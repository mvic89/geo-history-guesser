'use client';

import { useState, useEffect } from 'react';
import { GameState, HighScore } from '@/types/game';

interface ScoreboardProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export default function Scoreboard({ gameState, onPlayAgain }: ScoreboardProps) {
  const [playerName, setPlayerName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    // Load high scores from localStorage
    const stored = localStorage.getItem('geoHistoryHighScores');
    if (stored) {
      setHighScores(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const newScore: HighScore = {
      name: playerName.trim(),
      score: gameState.score,
      category: gameState.category!,
      difficulty: gameState.difficulty!,
      date: new Date().toISOString(),
    };

    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10

    setHighScores(updatedScores);
    localStorage.setItem('geoHistoryHighScores', JSON.stringify(updatedScores));
    setHasSubmitted(true);
  };

  const maxPossibleScore = gameState.totalRounds * 10 + gameState.totalRounds * 5; // 10 for location + 5 for questions

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Final Score Card */}
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-8">
          <h1 className="text-3xl font-light text-gray-900 text-center mb-6">
            Game Complete
          </h1>

          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <p className="text-5xl font-light text-gray-900 text-center mb-2">
              {gameState.score}
            </p>
            <p className="text-sm text-gray-500 text-center">
              out of {maxPossibleScore} points
            </p>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="text-sm font-medium text-gray-900">{gameState.category}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Difficulty</p>
              <p className="text-sm font-medium text-gray-900">{gameState.difficulty}</p>
            </div>
          </div>

          {/* Round Breakdown */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <p className="text-xs text-gray-500 mb-3">Round Scores</p>
            <div className="flex gap-2 justify-between">
              {gameState.roundScores.map((score, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <p className="text-xs text-gray-500 mb-1">Round {idx + 1}</p>
                  <p className="text-lg font-medium text-gray-900">{score}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Name Input */}
          {!hasSubmitted ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                Save to Leaderboard
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                  className="flex-1 px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                />
                <button
                  type="submit"
                  disabled={!playerName.trim()}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-3 bg-gray-100 border border-gray-300 rounded-lg">
              <p className="text-sm text-gray-700 text-center">
                ✓ Score saved to leaderboard
              </p>
            </div>
          )}

          <button
            onClick={onPlayAgain}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Play Again
          </button>
        </div>

        {/* Leaderboard */}
        {highScores.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-xl font-light text-gray-900 mb-4">Leaderboard</h2>
            <div className="space-y-2">
              {highScores.map((score, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-3 flex items-center justify-between border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium text-gray-500 w-6">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{score.name}</p>
                      <p className="text-xs text-gray-500">
                        {score.category} • {score.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{score.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}