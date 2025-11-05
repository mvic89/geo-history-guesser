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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            Game Complete! 🎉
          </h1>

          <div className="bg-white/20 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-6xl font-bold text-white mb-2">{gameState.score}</p>
              <p className="text-blue-200">out of {maxPossibleScore} possible points</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm text-blue-200">Category</p>
                <p className="font-semibold">{gameState.category}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm text-blue-200">Difficulty</p>
                <p className="font-semibold">{gameState.difficulty}</p>
              </div>
            </div>

            <div className="mt-4 bg-white/10 rounded-lg p-4">
              <p className="text-sm text-blue-200 mb-2">Round Breakdown:</p>
              <div className="flex justify-between text-white">
                {gameState.roundScores.map((score, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-xs text-blue-200">R{idx + 1}</p>
                    <p className="font-bold">{score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!hasSubmitted ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <label className="block text-white mb-2 font-semibold">
                Enter your name for the leaderboard:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name"
                  maxLength={20}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  disabled={!playerName.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-green-600/30 border border-green-400/50 rounded-lg">
              <p className="text-white text-center font-semibold">
                ✓ Score saved to leaderboard!
              </p>
            </div>
          )}

          <button
            onClick={onPlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>

        {/* Leaderboard */}
        {highScores.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🏆 Top 10 High Scores</h2>
            <div className="space-y-2">
              {highScores.map((score, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-blue-200 w-8">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{score.name}</p>
                      <p className="text-xs text-blue-200">
                        {score.category} - {score.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{score.score}</p>
                    <p className="text-xs text-blue-200">
                      {new Date(score.date).toLocaleDateString()}
                    </p>
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
