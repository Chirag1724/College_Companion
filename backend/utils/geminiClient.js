import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGroqClient } from '../services/groqService.js';

/**
 * Initialize Google Gemini AI Client
 */
let genAI = null;
let geminiText = null;
let geminiVision = null;

export const initializeGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not configured, will use Groq as primary');
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    geminiText = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    geminiVision = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ Gemini AI client initialized');
    return { geminiText, geminiVision };
  } catch (error) {
    console.error('❌ Failed to initialize Gemini client:', error.message);
    return null;
  }
};

/**
 * Get Gemini text model instance
 */
export const getGeminiText = () => {
  if (!geminiText) {
    throw new Error('Gemini text model not initialized. Call initializeGeminiClient() first.');
  }
  return geminiText;
};

/**
 * Get Gemini vision model instance
 */
export const getGeminiVision = () => {
  if (!geminiVision) {
    throw new Error('Gemini vision model not initialized. Call initializeGeminiClient() first.');
  }
  return geminiVision;
};

/**
 * Generate text response with Gemini (with Groq fallback)
 */
export const generateAIResponse = async (prompt, options = {}) => {
  try {
    console.log('✨ Calling Gemini...');
    
    if (!geminiText) {
      throw new Error('Gemini not available');
    }

    const result = await geminiText.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Gemini response received');
    return text;
  } catch (geminiError) {
    console.warn('⚠️  Gemini failed, switching to Groq fallback:', geminiError.message);
    
    try {
      const groqClient = getGroqClient();
      const groqResponse = await groqClient.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: options.temperature || 0.2,
        max_tokens: options.max_tokens || 4096,
      });
      
      console.log('✅ Groq fallback response received');
      return groqResponse.choices[0].message.content;
    } catch (groqError) {
      console.error('❌ Both Gemini and Groq failed:', groqError.message);
      throw new Error(`AI generation failed: ${groqError.message}`);
    }
  }
};

/**
 * Generate response with message history (for chat-like interactions)
 */
export const generateAIResponseWithHistory = async (messages, options = {}) => {
  try {
    console.log('✨ Calling Gemini with message history...');
    
    if (!geminiText) {
      throw new Error('Gemini not available');
    }

    // Convert messages to Gemini format
    const formattedMessages = messages.map(msg => {
      if (msg.role === 'system') {
        return { role: 'user', parts: [{ text: `[System]: ${msg.content}` }] };
      }
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      };
    });

    // Gemini uses chat interface for multi-turn conversations
    const chat = geminiText.startChat({
      history: formattedMessages.slice(0, -1),
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    
    console.log('✅ Gemini chat response received');
    return text;
  } catch (geminiError) {
    console.warn('⚠️  Gemini failed, switching to Groq fallback:', geminiError.message);
    
    try {
      const groqClient = getGroqClient();
      const groqResponse = await groqClient.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: messages,
        temperature: options.temperature || 0.2,
        max_tokens: options.max_tokens || 4096,
      });
      
      console.log('✅ Groq fallback response received');
      return groqResponse.choices[0].message.content;
    } catch (groqError) {
      console.error('❌ Both Gemini and Groq failed:', groqError.message);
      throw new Error(`AI generation failed: ${groqError.message}`);
    }
  }
};

/**
 * Extract text from image using Gemini Vision (with Tesseract fallback)
 */
export const extractTextFromImageGemini = async (imageBuffer, mimeType = 'image/jpeg', prompt = 'Extract all meaningful text from this image.') => {
  try {
    console.log('✨ Calling Gemini Vision for OCR...');
    
    if (!geminiVision) {
      throw new Error('Gemini Vision not available');
    }

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };

    const result = await geminiVision.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    console.log('✅ Gemini Vision OCR completed');
    return text;
  } catch (error) {
    console.error('❌ Gemini Vision failed:', error.message);
    throw error; // Let caller handle fallback to Tesseract
  }
};

/**
 * Check if Gemini is available
 */
export const isGeminiAvailable = () => {
  return geminiText !== null && geminiVision !== null;
};

export default {
  initializeGeminiClient,
  getGeminiText,
  getGeminiVision,
  generateAIResponse,
  generateAIResponseWithHistory,
  extractTextFromImageGemini,
  isGeminiAvailable,
};
