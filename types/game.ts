export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Professor';

export type Category = 'WW1' | 'WW2' | 'Cold War' | 'Ancient Rome';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationQuestion {
  question: string;
  answer: string;
  coordinates: Coordinates;
  radiusKm: number;
}

export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface GameRound {
  locationQuestion: LocationQuestion;
  followUpQuestions: MultipleChoiceQuestion[];
}

export interface GameState {
  category: Category | null;
  difficulty: Difficulty | null;
  currentRound: number;
  totalRounds: number;
  score: number;
  rounds: GameRound[];
  userPin: Coordinates | null;
  hasSubmittedPin: boolean;
  currentFollowUpIndex: number;
  roundScores: number[];
}

export interface HighScore {
  name: string;
  score: number;
  category: Category;
  difficulty: Difficulty;
  date: string;
}
