# Geo History Guesser - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Get a Groq API Key
1. Go to https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key and copy it

### 2. Install and Run
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and paste your Groq API key
# GROQ_API_KEY=gsk_your_key_here

# Start development server
npm run dev
```

### 3. Play!
Open http://localhost:3000 in your browser

---

## How the Game Works

### Game Flow
1. **Category Selection**: Choose from WW1, WW2, Cold War, or Ancient Rome
2. **Difficulty Selection**: Pick Easy, Medium, Hard, or Professor
3. **5 Rounds of Play**:
   - Read a historical question (e.g., "Where did the D-Day landings occur on June 6, 1944?")
   - Click anywhere on the map to place your pin
   - Submit your guess to see the distance and earn points
   - Answer 5 multiple choice follow-up questions about the event
   - Move to the next round
4. **Scoreboard**: Enter your name and see how you rank!

### Scoring Details

**Location Accuracy (up to 10 points per round)**
```
0-10 km     → 10 points
10-20 km    → 8 points
20-60 km    → 6 points
60-100 km   → 4 points
100-150 km  → 2 points
150-200 km  → 1 point
200+ km     → 0 points
```

**Multiple Choice Questions (1 point each)**
- 5 questions per round
- Answers are randomized (not always option A!)

**Maximum Score**: 75 points (50 from pins + 25 from questions)

---

## Technical Architecture

### Frontend Components

**CategorySelection.tsx**
- Displays 4 historical category buttons
- Beautiful gradient background
- Hover animations

**DifficultySelection.tsx**
- Shows 4 difficulty levels
- Color-coded buttons (green → red)
- Back navigation

**GameMap.tsx**
- Leaflet map without labels
- Click to place pin
- Shows green marker for correct answer after submission
- Calculates distance using Haversine formula

**GamePlay.tsx**
- Main game interface
- Map + question panel layout
- Manages pin submission and question flow
- Progress tracking

**Scoreboard.tsx**
- Final score display
- Name input for leaderboard
- Top 10 high scores (localStorage)
- Round-by-round breakdown

### Backend API

**`/api/generate-round`**
- Uses Groq's LLaMA 3.1 model
- Generates:
  - Historical location question
  - Precise coordinates
  - 5 follow-up multiple choice questions
- Adapts difficulty based on user selection

### Data Flow

```
User selects category & difficulty
         ↓
App generates 5 rounds via Groq API
         ↓
For each round:
  - Display question on map
  - User places pin
  - Calculate distance & score
  - Show 5 follow-up questions
  - Track answers
         ↓
Show final score + leaderboard
```

---

## Customization Guide

### Adding New Categories

1. **Update types** (`types/game.ts`):
```typescript
export type Category = 'WW1' | 'WW2' | 'Cold War' | 'Ancient Rome' | 'YOUR_CATEGORY';
```

2. **Add to category list** (`components/CategorySelection.tsx`):
```typescript
const categories = [
  // ... existing
  { name: 'YOUR_CATEGORY', description: 'Description', emoji: '🎯' },
];
```

3. **Update Groq prompt** (`app/api/generate-round/route.ts`) to understand your new category

### Adjusting Difficulty

Edit the scoring thresholds in `lib/utils.ts`:
```typescript
export function calculateScore(distanceKm: number): number {
  if (distanceKm <= 10) return 10;  // Adjust these values
  if (distanceKm <= 20) return 8;
  // ... etc
}
```

### Changing Map Style

In `components/GameMap.tsx`, replace the TileLayer URL:
```typescript
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
  // Try: dark_nolabels, rastertiles/voyager_nolabels, etc.
/>
```

Other free options:
- `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` (with labels)
- `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` (satellite)

### Modifying Number of Rounds

Change `totalRounds` in `app/page.tsx`:
```typescript
const [gameState, setGameState] = useState<GameState>({
  // ...
  totalRounds: 10, // Change from 5 to any number
  // ...
});
```

Also update the loop in `handleSelectDifficulty`:
```typescript
for (let i = 0; i < 10; i++) { // Match your totalRounds
  // ...
}
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variable:
   - Key: `GROQ_API_KEY`
   - Value: Your Groq API key
5. Deploy!

### Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variable `GROQ_API_KEY`

### Self-Hosting

```bash
# Build production version
npm run build

# Start production server
npm start
```

Set `GROQ_API_KEY` environment variable on your server.

---

## Troubleshooting

### "Failed to generate round" error
- **Check API key**: Make sure `GROQ_API_KEY` is set correctly in `.env.local`
- **API limits**: Free Groq accounts have rate limits. Wait a moment and try again
- **Network**: Ensure you have internet connection

### Map not appearing
- **Client-side only**: The map uses `dynamic` import with `ssr: false`
- **Browser console**: Check for JavaScript errors
- **Refresh**: Sometimes a hard refresh (Ctrl+Shift+R) helps

### Pin not moving when I click
- **Wait for submission**: You can only move the pin before submitting
- **After submission**: Pin becomes locked until next round

### Questions always have same answer position
- Check that `shuffleArray` is working in `lib/utils.ts`
- Verify `useEffect` in `GamePlay.tsx` is re-shuffling on question change

### High scores not saving
- **LocalStorage**: Scores are saved in browser localStorage
- **Private mode**: Won't persist in incognito/private browsing
- **Clear data**: Clearing browser data will delete scores

---

## Performance Tips

### Reduce API Calls
Currently generates all 5 rounds at start. To generate on-demand:
- Move generation to `GamePlay.tsx`
- Generate each round as needed
- Trade loading time for faster start

### Optimize Map
```typescript
// In GameMap.tsx, add these props to MapContainer
maxZoom={8}           // Limit zoom level
minZoom={2}           // Set minimum zoom
preferCanvas={true}   // Use canvas renderer
```

### Add Loading States
Show progress while generating rounds:
```typescript
const [roundsGenerated, setRoundsGenerated] = useState(0);

// In loop:
setRoundsGenerated(i + 1);

// Display: "Generating round {roundsGenerated} of 5..."
```

---

## Advanced Features to Add

### Timed Mode
```typescript
const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per round

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => Math.max(0, prev - 1));
  }, 1000);
  return () => clearInterval(timer);
}, []);

// Auto-submit when time runs out
useEffect(() => {
  if (timeLeft === 0 && !hasSubmitted) {
    handleSubmit();
  }
}, [timeLeft]);
```

### Multiplayer
- Use a real-time database (Firebase, Supabase)
- Create game rooms with unique codes
- Sync game state across players
- Show real-time scores

### Historical Context
After each round, show a fact card:
```typescript
<div className="historical-fact">
  <h3>Did you know?</h3>
  <p>{currentRound.historicalContext}</p>
</div>
```

Update Groq prompt to include a `historicalContext` field.

---

## API Usage & Costs

### Groq API
- **Free tier**: Generous limits for personal projects
- **Model used**: `llama-3.1-8b-instant`
- **Typical usage**: ~1500 tokens per round
- **5 rounds**: ~7500 tokens total per game

### Estimate
- Free tier: 14,400 tokens/minute
- You can generate ~1-2 games per minute
- Plenty for development and moderate use!

---

## Security Best Practices

### Environment Variables
✅ **DO**:
- Store API keys in `.env.local`
- Add `.env.local` to `.gitignore`
- Use environment variables on hosting platform

❌ **DON'T**:
- Commit API keys to Git
- Expose keys in client-side code
- Share keys publicly

### API Route Protection
Current implementation is open. For production, add rate limiting:

```typescript
// app/api/generate-round/route.ts
import { ratelimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  // ... rest of code
}
```

---

## Contributing Ideas

Want to improve the game? Here are some ideas:

1. **More categories**: Add Medieval History, Space Race, Renaissance
2. **Achievements**: "5 perfect rounds", "All categories completed"
3. **Difficulty scaling**: Questions get harder as you progress
4. **Hints system**: Spend points for hints on location
5. **Educational mode**: Show historical context before each question
6. **Mobile optimization**: Better touch controls for maps
7. **Sound effects**: Audio feedback for correct/incorrect answers
8. **Animations**: Smooth transitions between screens
9. **Statistics**: Track accuracy over time, favorite categories
10. **Share scores**: Social media integration

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Leaflet**: https://leafletjs.com/
- **React-Leaflet**: https://react-leaflet.js.org/
- **Groq**: https://console.groq.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify environment variables are set
4. Try with a fresh `.env.local` file

---

**Happy history hunting! 🌍📚🎯**
