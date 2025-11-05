'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GameState, MultipleChoiceQuestion } from '@/types/game';
import { calculateDistance, calculateScore, shuffleArray } from '@/lib/utils';

const GameMap = dynamic(() => import('./GameMap'), { ssr: false });

interface GamePlayProps {
  gameState: GameState;
  onUpdateGameState: (updates: Partial<GameState>) => void;
  onFinishGame: () => void;
}

interface ShuffledOption {
  option: string;
  originalIndex: number;
}

export default function GamePlay({
  gameState,
  onUpdateGameState,
  onFinishGame,
}: GamePlayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);

  const currentRound = gameState.rounds[gameState.currentRound];
  const currentQuestion =
    gameState.currentFollowUpIndex < currentRound.followUpQuestions.length
      ? currentRound.followUpQuestions[gameState.currentFollowUpIndex]
      : null;

  // Shuffle options when question changes (after pin is submitted)
  useEffect(() => {
    if (currentQuestion && gameState.hasSubmittedPin) {
      const optionsWithIndex: ShuffledOption[] = currentQuestion.options.map(
        (opt, idx) => ({ option: opt, originalIndex: idx })
      );
      const shuffled = shuffleArray(optionsWithIndex);
      
      setShuffledOptions(shuffled.map(item => item.option));
      setCorrectAnswerIndex(
        shuffled.findIndex(item => item.originalIndex === currentQuestion.correctAnswer)
      );
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestion, gameState.currentFollowUpIndex, gameState.hasSubmittedPin]);

  const handleSubmitPin = () => {
    if (!gameState.userPin) return;

    const distance = calculateDistance(
      gameState.userPin,
      currentRound.locationQuestion.coordinates
    );
    const points = calculateScore(distance);

    setDistanceKm(distance);
    setPointsEarned(points);
    onUpdateGameState({
      hasSubmittedPin: true,
      score: gameState.score + points,
      roundScores: [...gameState.roundScores, points],
    });
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    // Add 1 point for correct answer
    if (selectedAnswer === correctAnswerIndex) {
      onUpdateGameState({
        score: gameState.score + 1,
      });
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);

    if (gameState.currentFollowUpIndex < 4) {
      // More follow-up questions
      onUpdateGameState({
        currentFollowUpIndex: gameState.currentFollowUpIndex + 1,
      });
    } else {
      // Move to next round or finish
      if (gameState.currentRound < gameState.totalRounds - 1) {
        onUpdateGameState({
          currentRound: gameState.currentRound + 1,
          hasSubmittedPin: false,
          currentFollowUpIndex: 0,
          userPin: gameState.rounds[gameState.currentRound + 1]
            ? generateRandomPinForNextRound()
            : null,
        });
        setDistanceKm(null);
        setPointsEarned(0);
      } else {
        onFinishGame();
      }
    }
  };

  const generateRandomPinForNextRound = () => {
    const nextRound = gameState.rounds[gameState.currentRound + 1];
    if (!nextRound) return null;

    // Generate a random starting position
    const angle = Math.random() * 2 * Math.PI;
    const distance = 300 + Math.random() * 500; // 300-800 km away
    const R = 6371;
    
    const centerLat = nextRound.locationQuestion.coordinates.lat * (Math.PI / 180);
    const centerLng = nextRound.locationQuestion.coordinates.lng * (Math.PI / 180);
    
    const newLat = Math.asin(
      Math.sin(centerLat) * Math.cos(distance / R) +
      Math.cos(centerLat) * Math.sin(distance / R) * Math.cos(angle)
    );
    
    const newLng = centerLng + Math.atan2(
      Math.sin(angle) * Math.sin(distance / R) * Math.cos(centerLat),
      Math.cos(distance / R) - Math.sin(centerLat) * Math.sin(newLat)
    );

    return {
      lat: newLat * (180 / Math.PI),
      lng: newLng * (180 / Math.PI),
    };
  };

  if (!currentRound) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading round...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            Round {gameState.currentRound + 1} / {gameState.totalRounds}
          </h2>
          <p className="text-sm text-gray-400">
            {gameState.category} - {gameState.difficulty}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{gameState.score} points</p>
        </div>
      </div>

      {!gameState.hasSubmittedPin ? (
        // Layout before pin submission
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
          {/* Map Section - Takes most space */}
          <div className="flex-1 rounded-lg overflow-hidden">
            <GameMap
              userPin={gameState.userPin}
              onPinChange={(coords) => onUpdateGameState({ userPin: coords })}
              disabled={gameState.hasSubmittedPin}
              answerLocation={currentRound.locationQuestion.coordinates}
              showAnswer={gameState.hasSubmittedPin}
            />
          </div>

          {/* Question Box - Right sidebar, always visible and on top */}
          <div className="w-full lg:w-96">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg sticky top-20 h-fit max-h-80 overflow-y-auto">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {currentRound.locationQuestion.question}
              </p>
              <button
                onClick={handleSubmitPin}
                disabled={!gameState.userPin}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {gameState.userPin ? 'Submit Location' : 'Click on the map to place your pin'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Layout after pin submission - show follow-up questions
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
          {/* Map Section */}
          <div className="flex-1 rounded-lg overflow-hidden">
            <GameMap
              userPin={gameState.userPin}
              onPinChange={(coords) => onUpdateGameState({ userPin: coords })}
              disabled={gameState.hasSubmittedPin}
              answerLocation={currentRound.locationQuestion.coordinates}
              showAnswer={gameState.hasSubmittedPin}
            />
          </div>

          {/* Results and Follow-up Questions */}
          {currentQuestion && (
            <div className="w-full lg:w-96">
              <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg sticky top-20 flex flex-col">
                {/* Distance and Points */}
                {distanceKm !== null && (
                  <div className="mb-3 p-3 bg-blue-900/50 rounded-lg border border-blue-500">
                    <p className="text-xs text-gray-300">
                      Distance: <span className="font-bold">{distanceKm.toFixed(1)} km</span>
                    </p>
                    <p className="text-xs text-gray-300">
                      Points: <span className="font-bold text-green-400">{pointsEarned}</span>
                    </p>
                  </div>
                )}

                {/* Question Number */}
                <div className="mb-2">
                  <p className="text-xs text-gray-400">
                    Question {gameState.currentFollowUpIndex + 1} / 5
                  </p>
                </div>

                {/* Question Text */}
                <h3 className="text-base font-semibold mb-3">{currentQuestion.question}</h3>

                {/* Answer Options */}
                <div className="space-y-2 mb-4">
                  {shuffledOptions.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === correctAnswerIndex;
                    const showCorrect = showResult && isCorrect;
                    const showIncorrect = showResult && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full text-left p-2 rounded-lg transition-all text-xs ${
                          showCorrect
                            ? 'bg-green-600 border-2 border-green-400'
                            : showIncorrect
                            ? 'bg-red-600 border-2 border-red-400'
                            : isSelected
                            ? 'bg-blue-600 border-2 border-blue-400'
                            : 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                        } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Submit or Result */}
                {!showResult ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-1 px-3 text-sm rounded-lg transition-colors"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div>
                    <div className="mb-3 p-2 bg-gray-700 rounded-lg text-center">
                      <p className="text-xs">
                        {selectedAnswer === correctAnswerIndex ? (
                          <span className="text-green-400 font-semibold">
                            ✓ Correct! +1 point
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold">
                            ✗ Incorrect
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 text-sm rounded-lg transition-colors"
                    >
                      {gameState.currentFollowUpIndex < 4
                        ? 'Next Question'
                        : gameState.currentRound < gameState.totalRounds - 1
                        ? 'Next Round'
                        : 'Finish Game'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}