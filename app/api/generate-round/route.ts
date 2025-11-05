import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { Category, Difficulty, GameRound } from '@/types/game';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { category, difficulty, roundNumber } = await request.json();

    const prompt = `You are a historical geography game master. Generate a location-based question for a game.

Category: ${category}
Difficulty: ${difficulty}
Round: ${roundNumber} of 3

Generate a JSON object with the following structure:
{
  "locationQuestion": {
    "question": "A specific question about where a historical event occurred (be precise about the date and event)",
    "answer": "The name of the location (city, region, or battlefield)",
    "coordinates": {
      "lat": <latitude as number>,
      "lng": <longitude as number>
    }
  },
  "followUpQuestions": [
    {
      "question": "Question about the event or location",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": <index 0-3 of correct option>
    }
    // ... 4 more questions (5 total)
  ]
}

Guidelines:
- For ${difficulty} difficulty:
  ${difficulty === 'Easy' ? '- Use well-known events and major cities\n  - Questions should be straightforward' : ''}
  ${difficulty === 'Medium' ? '- Use moderately known events\n  - Require some historical knowledge' : ''}
  ${difficulty === 'Hard' ? '- Use lesser-known events or specific battle locations\n  - Require detailed historical knowledge' : ''}
  ${difficulty === 'Professor' ? '- Use very obscure events or precise military positions\n  - Require expert-level knowledge' : ''}
- Location question should ask "Where did X occur on [date]" or similar
- Provide exact coordinates (latitude, longitude)
- Follow-up questions should test knowledge about the event, its consequences, key figures, or the location
- Make sure options are plausible but only one is correct
- Vary the correct answer position (don't always make it option A)

Return ONLY the JSON object, no additional text.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates historical geography questions in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq');
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const gameRound: GameRound = JSON.parse(jsonMatch[0]);

    return NextResponse.json(gameRound);
  } catch (error) {
    console.error('Error generating game round:', error);
    return NextResponse.json(
      { error: 'Failed to generate game round' },
      { status: 500 }
    );
  }
}