import OpenAI from 'openai';
import { ResumeData } from '@/types/resume';
import { validateAndFixUrl } from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPEN_KEY,
});

const RESUME_PARSING_PROMPT = `
You are an expert resume parser. Extract structured information from the resume text below and return it as a valid JSON object.

IMPORTANT INSTRUCTIONS:
1. Extract the person's FULL NAME accurately - this is critical
2. Find all contact information (email, phone, LinkedIn, GitHub, website)
3. Parse work experience with exact job titles, companies, dates, and descriptions
4. Extract education details with degrees, institutions, and graduation dates
5. Identify skills and group them by category
6. Find projects with descriptions and technologies used
7. Extract any certifications or achievements
8. Write a professional summary if one isn't provided

OUTPUT FORMAT (JSON only, no markdown):
{
  "contact": {
    "name": "Full Name Here",
    "email": "email@domain.com",
    "phone": "+1234567890",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "website": "https://website.com"
  },
  "summary": "Professional summary paragraph",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "2020",
      "endDate": "2024",
      "current": false,
      "description": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "graduationDate": "2020",
      "gpa": "3.8"
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "items": ["JavaScript", "Python", "Java"]
    },
    {
      "category": "Frontend",
      "items": ["React", "Vue.js", "HTML/CSS"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description",
      "technologies": ["Tech1", "Tech2"],
      "link": "https://project-demo.com",
      "github": "https://github.com/user/project"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}

RULES:
- Extract the COMPLETE name, don't abbreviate
- Use proper date formats (YYYY for years)
- Group skills logically by category
- Extract ALL bullet points from experience as separate array items
- Include URLs when found
- If information is missing, use empty strings or empty arrays
- Ensure valid JSON format

RESUME TEXT:
`;

export class AIResumeParser {
  private text: string;

  constructor(text: string) {
    this.text = this.cleanText(text);
  }

  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async parse(): Promise<ResumeData> {
    try {
      console.log('Starting AI-powered resume parsing...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert resume parser that extracts structured data from resumes. Always return valid JSON."
          },
          {
            role: "user",
            content: RESUME_PARSING_PROMPT + this.text
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      console.log('AI Response received, parsing JSON...');
      
      // Clean the response to ensure it's valid JSON
      let cleanedResponse = aiResponse.trim();
      
      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      let parsedData: ResumeData;
      
      try {
        parsedData = JSON.parse(cleanedResponse);
      } catch (jsonError) {
        console.error('JSON parsing failed, trying to fix common issues...');
        
        // Try to fix common JSON issues
        let fixedResponse = cleanedResponse
          .replace(/,\s*}/g, '}')  // Remove trailing commas
          .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
          .replace(/\n/g, ' ')     // Remove newlines
          .replace(/\s+/g, ' ');   // Normalize whitespace
        
        parsedData = JSON.parse(fixedResponse);
      }

      // Validate and ensure required structure
      const validatedData = this.validateAndFixData(parsedData);
      
      console.log('AI parsing successful:', {
        name: validatedData.contact.name,
        email: validatedData.contact.email,
        experienceCount: validatedData.experience.length,
        skillsCount: validatedData.skills.length
      });

      return validatedData;

    } catch (error) {
      console.error('AI parsing failed:', error);
      
      // Fallback to pattern-based parsing
      console.log('Falling back to pattern-based parsing...');
      return this.fallbackParse();
    }
  }

  private validateAndFixData(data: any): ResumeData {
    // Ensure all required fields exist with proper defaults
    const validated: ResumeData = {
      contact: {
        name: data.contact?.name || this.extractNameFallback(),
        email: data.contact?.email || '',
        phone: data.contact?.phone || '',
        linkedin: data.contact?.linkedin || '',
        github: data.contact?.github || '',
        website: data.contact?.website || ''
      },
      summary: data.summary || '',
      experience: Array.isArray(data.experience) ? data.experience.map((exp: any) => ({
        title: exp.title || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: Array.isArray(exp.description) ? exp.description : []
      })) : [],
      education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        graduationDate: edu.graduationDate || '',
        gpa: edu.gpa || ''
      })) : [],
      skills: Array.isArray(data.skills) ? data.skills.map((skill: any) => ({
        category: skill.category || 'Skills',
        items: Array.isArray(skill.items) ? skill.items : []
      })) : [],
      projects: Array.isArray(data.projects) ? data.projects.map((proj: any) => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        link: proj.link || '',
        github: proj.github || ''
      })) : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : []
    };

    return validated;
  }

  private extractNameFallback(): string {
    // Simple fallback name extraction
    const lines = this.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (const line of lines.slice(0, 5)) {
      if (this.looksLikeName(line)) {
        return this.formatName(line);
      }
    }
    
    return 'Professional';
  }

  private looksLikeName(line: string): boolean {
    const words = line.split(/\s+/);
    return words.length >= 2 && 
           words.length <= 4 && 
           words.every(word => word.length > 1 && word[0] === word[0].toUpperCase()) &&
           !line.includes('@') && 
           !line.includes('http') &&
           !/\d/.test(line);
  }

  private formatName(name: string): string {
    return name.split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private fallbackParse(): ResumeData {
    // Basic pattern-based parsing as fallback
    const emailMatch = this.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = this.text.match(/[\+]?[1-9][\d\s\-\(\)]{7,15}/);
    
    return {
      contact: {
        name: this.extractNameFallback(),
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        linkedin: '',
        github: '',
        website: ''
      },
      summary: 'Experienced professional with diverse background',
      experience: [],
      education: [],
      skills: [{
        category: 'Core Skills',
        items: ['Communication', 'Problem Solving', 'Team Collaboration']
      }],
      projects: [],
      certifications: []
    };
  }
}

export async function parseResumeWithAI(text: string): Promise<ResumeData> {
  const parser = new AIResumeParser(text);
  return await parser.parse();
} 