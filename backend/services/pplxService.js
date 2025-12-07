import { readFileSync } from 'fs';
import { generateAIResponse, generateAIResponseWithHistory, extractTextFromImageGemini } from '../utils/geminiClient.js';

/**
 * Generate AI response using Gemini (with Groq fallback)
 * Primary AI provider for all text generation tasks
 */
export const generateAITextResponse = async (messages, options = {}) => {
  // Convert messages array to single prompt or use chat format
  if (Array.isArray(messages)) {
    return await generateAIResponseWithHistory(messages, options);
  } else {
    return await generateAIResponse(messages, options);
  }
};

/**
 * Extract text from image using Gemini Vision (with Tesseract fallback in caller)
 */
export const extractTextFromImage = async (imagePath, prompt = 'Extract all text from this image, maintaining structure and formatting.') => {
  try {
    // Read image and convert to buffer
    const imageBuffer = readFileSync(imagePath);
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    return await extractTextFromImageGemini(imageBuffer, mimeType, prompt);
  } catch (error) {
    console.error('❌ Gemini vision error:', error.message);
    throw error;
  }
};

/**
 * Extract structured data using Gemini AI
 */
export const extractStructuredData = async (text, extractionPrompt) => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a data extraction assistant. Return only valid JSON.'
      },
      {
        role: 'user',
        content: `${extractionPrompt}\n\nText to process:\n${text}`
      }
    ];

    const response = await generateAITextResponse(messages);
    
    // Parse JSON from response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('❌ AI structured extraction error:', error.message);
    throw error;
  }
};

/**
 * Extract essentials from file text using Gemini AI
 */
export const extractEssentialsFromFile = async (fileText, fileName) => {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert at extracting educational content from documents. Return ONLY valid JSON with no markdown formatting.'
    },
    {
      role: 'user',
      content: `Analyze this document (${fileName}) and extract key information. Return JSON in this exact format:

{
  "creativeQuestions": ["question1", "question2"],
  "theoryTopics": ["topic1", "topic2"],
  "numericalTopics": ["topic1", "topic2"],
  "marks": {
    "2": ["short answer question 1"],
    "3": ["medium question 1"],
    "14": ["long question 1"],
    "16": ["very long question 1"]
  }
}

Document content:
${fileText.substring(0, 10000)}`
    }
  ];

  const response = await generateAITextResponse(messages, { temperature: 0.1 });
  
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(jsonText);
};

/**
 * Generate revision plan using Gemini AI
 */
export const generateRevisionPlan = async (syllabusText, preferences) => {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert study planner. Create comprehensive revision plans. Return ONLY valid JSON.'
    },
    {
      role: 'user',
      content: `Create a revision plan for this syllabus. Return JSON in this format:

{
  "weeks": [
    {
      "weekNumber": 1,
      "topics": ["topic1", "topic2"],
      "goals": "Weekly goals",
      "activities": ["activity1", "activity2"],
      "assessments": "Assessment plan"
    }
  ],
  "studyTips": ["tip1", "tip2"],
  "resources": ["resource1", "resource2"]
}

Syllabus: ${syllabusText}
Preferences: ${JSON.stringify(preferences)}`
    }
  ];

  const response = await generateAITextResponse(messages, { temperature: 0.3 });
  
  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  return JSON.parse(jsonText);
};

/**
 * Doubt solver using Gemini AI
 */
export const doubtSolver = async (question, context = '') => {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert tutor helping students understand concepts. Provide clear, detailed explanations.'
    },
    {
      role: 'user',
      content: `${context ? `Context: ${context}\n\n` : ''}Question: ${question}\n\nProvide a comprehensive explanation.`
    }
  ];

  return await generateAITextResponse(messages, { temperature: 0.4, max_tokens: 2048 });
};

export default {
  generateAITextResponse,
  extractTextFromImage,
  extractStructuredData,
  extractEssentialsFromFile,
  generateRevisionPlan,
  doubtSolver,
};
