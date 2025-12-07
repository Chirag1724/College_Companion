import { generateAIResponseWithHistory } from '../utils/geminiClient.js';

export const generateSurvivalPlan = async ({ userSkills, stressLevel, timeAvailable, examDates, goals, deadline }) => {
  try {
    console.log('✨ Calling Gemini to generate survival plan...');

    const prompt = `Generate a weekly survival plan for a student using the following details:
Skills: ${userSkills.join(', ')}
Stress Level: ${stressLevel}
Time Available: ${timeAvailable}
Exam Dates: ${examDates.join(', ')}
Goals: ${goals}
Deadline: ${deadline}

Provide output in bullet points and weekly schedule format. Include:
1. Weekly breakdown with focus areas and tasks
2. Daily schedule with time slots
3. Skill development roadmap
4. Revision plan and strategies
5. Exam preparation tactics
6. Productivity tips`;

    const messages = [
      {
        role: 'system',
        content: 'You are a study planning expert. Generate clear, structured study survival plans with weekly breakdowns, skill milestones, and exam strategies. Return ONLY a valid JSON object with this structure: {"weeklyPlan": [{"week": 1, "focus": "...", "tasks": ["...", "..."], "milestones": ["..."]}], "dailySchedule": [{"day": "Monday", "timeSlots": [{"time": "9-11 AM", "activity": "..."}]}], "skillRoadmap": [{"skill": "...", "currentLevel": "...", "targetLevel": "...", "action": "..."}], "revisionPlan": [{"phase": "...", "duration": "...", "focus": "...", "method": "..."}], "examStrategy": [{"subject": "...", "priority": "...", "tactics": ["...", "..."]}], "productivityRules": ["Rule 1", "Rule 2"]}'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const aiResponse = await generateAIResponseWithHistory(messages, { temperature: 0.3, max_tokens: 3000 });

    if (!aiResponse) {
      throw new Error('Empty response from AI');
    }

    console.log('✅ AI response received');

    // Parse the response
    let parsedPlan;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedPlan = JSON.parse(jsonMatch[0]);
      } else {
        parsedPlan = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.warn('⚠️  Failed to parse as JSON, using fallback structure');
      // Fallback structure if parsing fails
      parsedPlan = {
        weeklyPlan: [{ week: 1, focus: 'Initial preparation', tasks: ['Analyze syllabus', 'Create study schedule'], milestones: ['Setup complete'] }],
        dailySchedule: [{ day: 'Monday', timeSlots: [{ time: '9-11 AM', activity: 'Study session' }] }],
        skillRoadmap: userSkills.map(skill => ({ skill, currentLevel: 'Beginner', targetLevel: 'Intermediate', action: 'Practice daily' })),
        revisionPlan: [{ phase: 'Initial', duration: '1 week', focus: 'Core concepts', method: 'Active recall' }],
        examStrategy: [{ subject: goals, priority: 'High', tactics: ['Practice questions', 'Time management'] }],
        productivityRules: ['Take regular breaks', 'Stay hydrated', 'Sleep 7-8 hours'],
        rawResponse: aiResponse,
      };
    }

    // Ensure all required fields exist
    const completePlan = {
      weeklyPlan: parsedPlan.weeklyPlan || [],
      dailySchedule: parsedPlan.dailySchedule || [],
      skillRoadmap: parsedPlan.skillRoadmap || [],
      revisionPlan: parsedPlan.revisionPlan || [],
      examStrategy: parsedPlan.examStrategy || [],
      productivityRules: parsedPlan.productivityRules || [],
    };

    return completePlan;
  } catch (error) {
    console.error('❌ AI Error:', error.message);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};
