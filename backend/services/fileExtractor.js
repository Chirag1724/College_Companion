import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { extractTextFromImage } from './pplxService.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Extract text from PDF
 */
export const extractFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error.message);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from image using OCR (Tesseract)
 */
export const extractFromImageOCR = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: info => console.log(info)
    });
    return text;
  } catch (error) {
    console.error('OCR extraction error:', error.message);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Extract text from image using Gemini Vision API
 */
export const extractFromImageVision = async (imagePath) => {
  try {
    return await extractTextFromImage(imagePath);
  } catch (error) {
    console.error('Vision API extraction error:', error.message);
    // Fallback to OCR
    console.log('Falling back to OCR...');
    return await extractFromImageOCR(imagePath);
  }
};

/**
 * Extract text from plain text file
 */
export const extractFromTextFile = (fileBuffer) => {
  try {
    return fileBuffer.toString('utf-8');
  } catch (error) {
    console.error('Text file read error:', error.message);
    throw new Error('Failed to read text file');
  }
};

/**
 * Main extraction function - determines file type and extracts accordingly
 */
export const extractTextFromFile = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const mimeType = file.mimetype;
  const fileName = file.originalname.toLowerCase();

  try {
    // PDF files
    if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('📄 Extracting text from PDF...');
      return await extractFromPDF(file.buffer);
    }

    // Image files
    if (mimeType.startsWith('image/')) {
      console.log('🖼️  Extracting text from image...');
      
      // Save temporary file
      const tempPath = path.join(process.cwd(), 'uploads', file.originalname);
      await fs.mkdir(path.dirname(tempPath), { recursive: true });
      await fs.writeFile(tempPath, file.buffer);
      
      try {
        const text = await extractFromImageVision(tempPath);
        await fs.unlink(tempPath).catch(err => console.error('Temp file cleanup error:', err));
        return text;
      } catch (error) {
        await fs.unlink(tempPath).catch(err => console.error('Temp file cleanup error:', err));
        throw error;
      }
    }

    // Text files
    if (mimeType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      console.log('📝 Reading text file...');
      return extractFromTextFile(file.buffer);
    }

    // MP4/Video files - extract first frame (not implemented in detail)
    if (mimeType.startsWith('video/') || fileName.endsWith('.mp4')) {
      console.log('🎥 Video file detected - returning placeholder');
      return 'Video file processing not fully implemented. Please extract frames manually.';
    }

    throw new Error(`Unsupported file type: ${mimeType}`);

  } catch (error) {
    console.error('Text extraction error:', error.message);
    throw error;
  }
};

export default {
  extractFromPDF,
  extractFromImageOCR,
  extractFromImageVision,
  extractFromTextFile,
  extractTextFromFile,
};
