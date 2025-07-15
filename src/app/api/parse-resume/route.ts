import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { parseResumeWithAI } from '@/lib/ai-resume-parser';

export const dynamic = 'force-dynamic';

// Import pdf-parse at the top level to avoid dynamic import issues during build
let pdfParse: any = null;
try {
  pdfParse = require('pdf-parse');
} catch (error) {
  console.warn('pdf-parse not available:', error);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let text = '';
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    console.log('Processing file:', fileName, 'Type:', fileType);

    try {
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        // Handle PDF files
        if (!pdfParse) {
          return NextResponse.json({ 
            error: 'PDF parsing is not available in this environment. Please upload a DOCX or TXT file instead.' 
          }, { status: 400 });
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
        console.log('PDF parsed successfully, text length:', text.length);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        // Handle DOCX files
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
        console.log('DOCX parsed successfully, text length:', text.length);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        // Handle TXT files
        text = await file.text();
        console.log('TXT file processed, text length:', text.length);
      } else {
        return NextResponse.json({ 
          error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' 
        }, { status: 400 });
      }

      // Clean and validate extracted text
      text = text.trim();
      if (!text || text.length < 50) {
        return NextResponse.json({ 
          error: 'Could not extract sufficient text from the file. Please ensure the file contains readable text.' 
        }, { status: 400 });
      }

      console.log('Text extraction successful. Sample:', text.substring(0, 200) + '...');

      // Use AI-powered parsing
      const resumeData = await parseResumeWithAI(text);
      
      // Validate that we extracted meaningful data
      if (!resumeData.contact.name || resumeData.contact.name === 'Professional') {
        console.log('Name detection failed, trying alternative methods...');
        
        // Try to extract name from filename if parsing failed
        const nameFromFile = fileName
          .replace(/\.(pdf|docx|txt)$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/resume|cv/gi, '')
          .trim();
        
        if (nameFromFile && nameFromFile.length > 2) {
          resumeData.contact.name = nameFromFile
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        } else {
          resumeData.contact.name = 'Your Name'; // Fallback
        }
      }

      // Ensure we have at least some basic info
      if (!resumeData.contact.email && !resumeData.contact.phone) {
        console.log('No contact info found, this might not be a resume');
      }

      console.log('Parsed resume data:', {
        name: resumeData.contact.name,
        email: resumeData.contact.email,
        experienceCount: resumeData.experience.length,
        skillsCount: resumeData.skills.length,
        projectsCount: resumeData.projects.length
      });

      return NextResponse.json({ 
        success: true, 
        data: resumeData,
        metadata: {
          fileType,
          fileName,
          textLength: text.length,
          processingTime: Date.now()
        }
      });

    } catch (parseError) {
      console.error('File parsing error:', parseError);
      
      // Try fallback text extraction
      try {
                 const fallbackText = await file.text();
         if (fallbackText && fallbackText.length > 20) {
           const resumeData = await parseResumeWithAI(fallbackText);
           return NextResponse.json({ 
             success: true, 
             data: resumeData,
             warning: 'Used fallback text extraction method'
           });
         }
      } catch (fallbackError) {
        console.error('Fallback extraction also failed:', fallbackError);
      }

      return NextResponse.json({ 
        error: 'Failed to parse the file. Please ensure it\'s a valid resume file with readable text.',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error occurred while processing the file.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 