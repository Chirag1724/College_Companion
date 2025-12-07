import express from 'express';
import multer from 'multer';
import path from 'path';
import { generateAIResponse } from '../utils/geminiClient.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error('Only images (JPG, PNG), PDFs, and MP4 videos are allowed'));
  }
});

// POST /api/essentials/extract - Extract syllabus and generate essentials
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({
        success: false,
        error: 'No file uploaded'
      });
    }
    const { originalname, mimetype, buffer } = req.file;
    const base64File = buffer.toString('base64');

    console.log(`📄 Processing file: ${originalname} (${mimetype})`);

    const prompt = `File name: ${originalname}\nMIME type: ${mimetype}\nBase64: ${base64File}\n\nPlease analyze this document and return a JSON object with keys creativeTopics, theoryTopics, numericalTopics, and marksDistribution (containing arrays for twoMarks, threeMarks, fourteenMarks, sixteenMarks). Provide concise bullet points for each array. You are an academic analyzer. Extract the core essential topics from the provided syllabus/document and return them as a clean bullet list grouped by importance and mark weightage.`;

    const aiContent = await generateAIResponse(prompt, { temperature: 0.2, max_tokens: 2000 });

    let essentialsPayload;
    if (aiContent) {
      try {
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        essentialsPayload = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiContent);
      } catch (parseError) {
        essentialsPayload = {
          summary: aiContent,
          creativeTopics: [],
          theoryTopics: [],
          numericalTopics: [],
          marksDistribution: {
            twoMarks: [],
            threeMarks: [],
            fourteenMarks: [],
            sixteenMarks: []
          }
        };
      }
    }

    res.json({
      success: true,
      essentials: essentialsPayload || null,
      raw: aiContent || null,
      fileName: originalname
    });
  } catch (error) {
    console.error('❌ Error processing file:', error);

    res.json({
      success: false,
      error: 'Failed to extract essentials',
      details: error.message
    });
  }
});

export default router;
