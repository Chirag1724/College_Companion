import express from 'express';
import { generateAIResponse } from '../utils/geminiClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { skills, stressLevel, timeAvailable, examDates, goals } = req.body;

  if (!skills || !stressLevel || !timeAvailable || !examDates || !goals) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `Generate a weekly survival plan for a student using the following details:
Skills: ${skills}
Stress Level: ${stressLevel}
Time Available: ${timeAvailable}
Exam Dates: ${examDates}
Goals: ${goals}
Provide output in bullet points and weekly schedule format.`;

  try {
    console.log('✨ Generating survival plan with Gemini...');
    
    const plan = await generateAIResponse(prompt, { temperature: 0.3, max_tokens: 2000 });

    res.json({ plan });

  } catch (error) {
    console.error('❌ AI request failed:', error.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

export default router;
