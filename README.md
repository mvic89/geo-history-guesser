# Geo History Guesser 🌍📚

A historical geography guessing game built with Next.js, TypeScript, Tailwind CSS, and Groq AI.

## Features

- **Multiple Historical Categories**: WW1, WW2, Cold War, Ancient Rome
- **4 Difficulty Levels**: Easy, Medium, Hard, Professor
- **Interactive Map**: Click to place your pin on a label-free map
- **Distance-Based Scoring**: Get up to 10 points based on accuracy
- **AI-Generated Questions**: 5 follow-up multiple choice questions per round
- **5 Rounds Per Game**: Test your knowledge across multiple locations
- **High Score Leaderboard**: Save your scores locally and compete

## Scoring System

### Location Pin Accuracy
- Within 10 km: **10 points**
- 10-20 km: **8 points**
- 20-60 km: **6 points**
- 60-100 km: **4 points**
- 100-150 km: **2 points**
- 150-200 km: **1 point**
- Beyond 200 km: **0 points**

### Multiple Choice Questions
- Each correct answer: **+1 point**
- 5 questions per round

**Maximum possible score per game**: 75 points (50 from pins + 25 from questions)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Groq API key (free at https://console.groq.com)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:
```
GROQ_API_KEY=your_actual_groq_api_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Leaflet/React-Leaflet**: Interactive maps
- **Groq AI**: Fast AI inference for question generation
- **Local Storage**: High score persistence

## How It Works

### Game Flow
1. Select a historical category (WW1, WW2, Cold War, Ancient Rome)
2. Choose difficulty level (Easy → Professor)
3. For each of 5 rounds:
   - Read the historical question
   - Click the map to place your pin
   - Submit and see how close you were
   - Answer 5 follow-up multiple choice questions
4. View your final score and save to leaderboard

### AI Question Generation
The game uses Groq's LLaMA 3.1 model to:
- Generate historically accurate location questions
- Create relevant follow-up questions about the event
- Provide precise coordinates for scoring
- Adjust difficulty based on selected level

### Map Implementation
- Uses CartoDB's label-free map tiles
- Haversine formula for distance calculation
- Random starting pin position (50-800km from answer)
- Green marker shows correct location after submission

## Project Structure

```
geo-history-guesser/
├── app/
│   ├── api/
│   │   └── generate-round/
│   │       └── route.ts         # Groq API endpoint
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main game orchestrator
├── components/
│   ├── CategorySelection.tsx    # Category picker
│   ├── DifficultySelection.tsx  # Difficulty picker
│   ├── GameMap.tsx              # Leaflet map component
│   ├── GamePlay.tsx             # Main game interface
│   └── Scoreboard.tsx           # Results and leaderboard
├── lib/
│   └── utils.ts                 # Helper functions
├── types/
│   └── game.ts                  # TypeScript interfaces
└── package.json
```

## Customization Ideas

- Add more historical categories (Napoleonic Wars, American Revolution, etc.)
- Implement multiplayer mode
- Add timed challenges
- Include historical images or context
- Create themed map styles per category
- Add sound effects and animations

## Troubleshooting

### Map not loading
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

### Questions not generating
- Verify your Groq API key is correct in `.env.local`
- Check that you have API credits remaining
- Ensure you're connected to the internet

### Styling issues
- Make sure Tailwind is properly configured
- Clear your browser cache
- Restart the dev server

## Future Enhancements

- [ ] Backend database for global leaderboards
- [ ] User accounts and progress tracking
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Mobile app version
- [ ] Historical fact cards after each round
- [ ] Multiplayer competitive mode

## License

MIT License - Feel free to use and modify!

## Credits

- Maps powered by CartoDB and OpenStreetMap
- AI powered by Groq
- Built with ❤️ and historical curiosity

---

**Have fun testing your historical geography knowledge!** 🎓🗺️
