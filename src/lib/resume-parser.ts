import { ResumeData, Experience, Education, Project, Skill } from '@/types/resume';

// Enhanced patterns for better detection
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_PATTERN = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
const LINKEDIN_PATTERN = /(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)([A-Za-z0-9-_.]+)/gi;
const GITHUB_PATTERN = /(?:github\.com\/)([A-Za-z0-9-_.]+)/gi;
const URL_PATTERN = /https?:\/\/[^\s]+/g;

// Common name indicators
const NAME_INDICATORS = [
  'name:', 'full name:', 'candidate:', 'applicant:', 'resume of', 'cv of'
];

// Education keywords
const EDUCATION_KEYWORDS = [
  'education', 'academic', 'university', 'college', 'school', 'degree', 'bachelor', 'master', 'phd', 'diploma', 'certificate', 'graduated', 'graduation'
];

// Experience keywords
const EXPERIENCE_KEYWORDS = [
  'experience', 'employment', 'work history', 'professional experience', 'career', 'positions', 'roles', 'job', 'work'
];

// Skills keywords
const SKILLS_KEYWORDS = [
  'skills', 'technical skills', 'competencies', 'technologies', 'programming languages', 'tools', 'frameworks', 'software'
];

// Projects keywords
const PROJECTS_KEYWORDS = [
  'projects', 'portfolio', 'work samples', 'personal projects', 'side projects', 'github projects'
];

interface ParsedSection {
  title: string;
  content: string[];
  startIndex: number;
  endIndex: number;
}

export class AIResumeParser {
  private text: string;
  private lines: string[];
  private sections: ParsedSection[] = [];

  constructor(text: string) {
    this.text = this.cleanText(text);
    this.lines = this.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    this.identifySections();
  }

  private cleanText(text: string): string {
    // Remove extra whitespace and normalize
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .trim();
  }

  private identifySections(): void {
    const sectionHeaders: { title: string; index: number; }[] = [];
    
    // Find potential section headers
    this.lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      
      // Check if line looks like a section header
      if (
        line.length < 50 && // Headers are usually short
        (
          lowerLine.includes('experience') ||
          lowerLine.includes('education') ||
          lowerLine.includes('skills') ||
          lowerLine.includes('projects') ||
          lowerLine.includes('summary') ||
          lowerLine.includes('objective') ||
          lowerLine.includes('about') ||
          lowerLine.includes('contact') ||
          lowerLine.includes('certifications') ||
          lowerLine.includes('achievements')
        )
      ) {
        sectionHeaders.push({ title: line, index });
      }
    });

    // Create sections
    sectionHeaders.forEach((header, i) => {
      const nextHeaderIndex = i < sectionHeaders.length - 1 ? sectionHeaders[i + 1].index : this.lines.length;
      const content = this.lines.slice(header.index + 1, nextHeaderIndex);
      
      this.sections.push({
        title: header.title,
        content,
        startIndex: header.index,
        endIndex: nextHeaderIndex
      });
    });
  }

  public parse(): ResumeData {
    return {
      contact: this.extractContactInfo(),
      summary: this.extractSummary(),
      experience: this.extractExperience(),
      education: this.extractEducation(),
      skills: this.extractSkills(),
      projects: this.extractProjects(),
      certifications: this.extractCertifications()
    };
  }

  private extractContactInfo() {
    const contact = {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      website: ''
    };

    // Extract email
    const emailMatch = this.text.match(EMAIL_PATTERN);
    if (emailMatch) {
      contact.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = this.text.match(PHONE_PATTERN);
    if (phoneMatch) {
      contact.phone = phoneMatch[0];
    }

    // Extract LinkedIn
    const linkedinMatch = this.text.match(LINKEDIN_PATTERN);
    if (linkedinMatch) {
      contact.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://linkedin.com/in/${linkedinMatch[1]}`;
    }

    // Extract GitHub
    const githubMatch = this.text.match(GITHUB_PATTERN);
    if (githubMatch) {
      contact.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://github.com/${githubMatch[1]}`;
    }

    // Extract name - this is the tricky part, using AI-like logic
    contact.name = this.extractName();

    return contact;
  }

  private extractName(): string {
    // Strategy 1: Look for explicit name indicators
    for (const indicator of NAME_INDICATORS) {
      const regex = new RegExp(`${indicator}\\s*:?\\s*(.+)`, 'gi');
      const match = this.text.match(regex);
      if (match) {
        const name = match[0].replace(new RegExp(indicator, 'gi'), '').replace(/[:]/g, '').trim();
        if (this.isValidName(name)) {
          return this.formatName(name);
        }
      }
    }

    // Strategy 2: First line that looks like a name (common pattern)
    const firstFewLines = this.lines.slice(0, 5);
    for (const line of firstFewLines) {
      if (this.looksLikeName(line) && !this.containsContactInfo(line)) {
        return this.formatName(line);
      }
    }

    // Strategy 3: Look for lines with 2-3 capitalized words
    for (const line of this.lines.slice(0, 10)) {
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        const capitalizedWords = words.filter(word => 
          word.length > 1 && 
          word[0] === word[0].toUpperCase() && 
          word.slice(1).toLowerCase() === word.slice(1)
        );
        
        if (capitalizedWords.length === words.length && !this.containsContactInfo(line)) {
          return this.formatName(line);
        }
      }
    }

    // Strategy 4: Extract from email if available
    const emailMatch = this.text.match(EMAIL_PATTERN);
    if (emailMatch) {
      const emailPart = emailMatch[0].split('@')[0];
      const nameFromEmail = emailPart.replace(/[._]/g, ' ').replace(/\d+/g, '').trim();
      if (nameFromEmail.length > 2) {
        return this.formatName(nameFromEmail);
      }
    }

    return 'Professional';
  }

  private looksLikeName(line: string): boolean {
    const words = line.split(/\s+/);
    
    // Should be 2-4 words
    if (words.length < 2 || words.length > 4) return false;
    
    // All words should start with capital letter
    const allCapitalized = words.every(word => 
      word.length > 0 && word[0] === word[0].toUpperCase()
    );
    
    // Should not contain numbers or special characters (except hyphens)
    const noNumbers = !line.match(/\d/);
    const noSpecialChars = !line.match(/[!@#$%^&*()_+={}[\]|\\:";'<>?,./]/);
    
    return allCapitalized && noNumbers && noSpecialChars;
  }

  private isValidName(name: string): boolean {
    return name.length > 2 && name.length < 50 && !this.containsContactInfo(name);
  }

  private containsContactInfo(line: string): boolean {
    return EMAIL_PATTERN.test(line) || 
           PHONE_PATTERN.test(line) || 
           line.toLowerCase().includes('linkedin') ||
           line.toLowerCase().includes('github') ||
           line.toLowerCase().includes('http');
  }

  private formatName(name: string): string {
    return name
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private extractSummary(): string {
    // Look for summary section
    const summarySection = this.sections.find(section => 
      section.title.toLowerCase().includes('summary') ||
      section.title.toLowerCase().includes('objective') ||
      section.title.toLowerCase().includes('about')
    );

    if (summarySection) {
      return summarySection.content.join(' ').trim();
    }

    // Fallback: look for first paragraph-like content
    for (const line of this.lines) {
      if (line.length > 100 && line.split(' ').length > 15) {
        return line;
      }
    }

    return '';
  }

  private extractExperience() {
    const experience: Experience[] = [];
    const experienceSection = this.sections.find(section =>
      EXPERIENCE_KEYWORDS.some(keyword => 
        section.title.toLowerCase().includes(keyword)
      )
    );

    if (experienceSection) {
      const content = experienceSection.content;
      let currentJob = null;

      for (const line of content) {
        if (this.looksLikeJobTitle(line)) {
          if (currentJob) {
            experience.push(this.finalizeJob(currentJob));
          }
          currentJob = this.parseJobTitle(line);
        } else if (currentJob && line.trim()) {
          if (this.looksLikeCompany(line) && !currentJob.company) {
            currentJob.company = line.trim();
          } else if (this.looksLikeDates(line)) {
            const dates = this.parseDates(line);
            currentJob.startDate = dates.startDate;
            currentJob.endDate = dates.endDate;
            currentJob.current = dates.current;
          } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            currentJob.responsibilities.push(line.replace(/^[•\-*]\s*/, '').trim());
          } else {
            currentJob.responsibilities.push(line.trim());
          }
        }
      }

      if (currentJob) {
        experience.push(this.finalizeJob(currentJob));
      }
    }

    return experience;
  }

  private looksLikeJobTitle(line: string): boolean {
    const commonTitles = [
      'developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant', 
      'specialist', 'coordinator', 'director', 'lead', 'senior', 'junior', 
      'associate', 'intern', 'architect', 'administrator'
    ];
    
    const lowerLine = line.toLowerCase();
    return commonTitles.some(title => lowerLine.includes(title)) && 
           line.length < 100 && 
           !line.includes('•') && 
           !line.includes('-');
  }

  private looksLikeCompany(line: string): boolean {
    return line.length < 80 && 
           !line.includes('•') && 
           !line.includes('-') &&
           !this.looksLikeDates(line);
  }

  private looksLikeDates(line: string): boolean {
    const datePatterns = [
      /\d{4}\s*[-–]\s*\d{4}/,
      /\d{4}\s*[-–]\s*present/i,
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
      /\d{1,2}\/\d{4}/
    ];
    
    return datePatterns.some(pattern => pattern.test(line));
  }

  private parseJobTitle(line: string): Partial<Experience> & { responsibilities: string[]; title: string; description: string[] } {
    const position = line.trim();
    return {
      position,
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: [],
      // Legacy field names for template compatibility
      title: position,
      description: []
    };
  }

  private parseDates(line: string) {
    const current = /present|current|now/i.test(line);
    const yearMatch = line.match(/\d{4}/g);
    
    return {
      startDate: yearMatch ? yearMatch[0] : '',
      endDate: current ? '' : (yearMatch && yearMatch[1] ? yearMatch[1] : ''),
      current
    };
  }

  private finalizeJob(job: any) {
    return {
      ...job,
      description: job.description.filter((desc: string) => desc.length > 10)
    };
  }

  private extractEducation() {
    const education = [];
    const educationSection = this.sections.find(section =>
      EDUCATION_KEYWORDS.some(keyword => 
        section.title.toLowerCase().includes(keyword)
      )
    );

    if (educationSection) {
      const content = educationSection.content;
      let currentEdu = null;

      for (const line of content) {
        if (this.looksLikeDegree(line)) {
          if (currentEdu) {
            education.push(currentEdu);
          }
          currentEdu = {
            degree: line.trim(),
            institution: '',
            field: '',
            graduationDate: '',
            gpa: '',
            // Additional fields for template compatibility
            location: '',
            honors: []
          };
        } else if (currentEdu && line.trim()) {
          if (this.looksLikeInstitution(line) && !currentEdu.institution) {
            currentEdu.institution = line.trim();
          } else if (this.looksLikeDates(line)) {
            const yearMatch = line.match(/\d{4}/);
            currentEdu.graduationDate = yearMatch ? yearMatch[0] : '';
          } else if (line.toLowerCase().includes('gpa')) {
            const gpaMatch = line.match(/\d\.\d+/);
            currentEdu.gpa = gpaMatch ? gpaMatch[0] : '';
          }
        }
      }

      if (currentEdu) {
        education.push(currentEdu);
      }
    }

    return education;
  }

  private looksLikeDegree(line: string): boolean {
    const degreeKeywords = [
      'bachelor', 'master', 'phd', 'doctorate', 'diploma', 'certificate', 
      'b.s.', 'b.a.', 'm.s.', 'm.a.', 'mba', 'degree'
    ];
    
    const lowerLine = line.toLowerCase();
    return degreeKeywords.some(keyword => lowerLine.includes(keyword));
  }

  private looksLikeInstitution(line: string): boolean {
    const institutionKeywords = [
      'university', 'college', 'institute', 'school', 'academy'
    ];
    
    const lowerLine = line.toLowerCase();
    return institutionKeywords.some(keyword => lowerLine.includes(keyword)) ||
           (line.length > 10 && line.length < 100);
  }

  private extractSkills() {
    const skills = [];
    const skillsSection = this.sections.find(section =>
      SKILLS_KEYWORDS.some(keyword => 
        section.title.toLowerCase().includes(keyword)
      )
    );

    if (skillsSection) {
      const content = skillsSection.content.join(' ');
      
      // Common skill categories
      const categories = {
        'Programming Languages': this.extractSkillsFromText(content, [
          'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'
        ]),
        'Frontend': this.extractSkillsFromText(content, [
          'react', 'vue', 'angular', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery'
        ]),
        'Backend': this.extractSkillsFromText(content, [
          'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails'
        ]),
        'Databases': this.extractSkillsFromText(content, [
          'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle'
        ]),
        'Tools & Technologies': this.extractSkillsFromText(content, [
          'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'webpack'
        ])
      };

      Object.entries(categories).forEach(([category, items]) => {
        if (items.length > 0) {
          skills.push({ category, items });
        }
      });

      // If no structured skills found, try to parse as comma-separated
      if (skills.length === 0) {
        const skillItems = content.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
        if (skillItems.length > 0) {
          skills.push({ category: 'Technical Skills', items: skillItems });
        }
      }
    }

    return skills;
  }

  private extractSkillsFromText(text: string, keywords: string[]): string[] {
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        found.push(keyword);
      }
    });
    
    return found;
  }

  private extractProjects() {
    const projects: Project[] = [];
    const projectsSection = this.sections.find(section =>
      PROJECTS_KEYWORDS.some(keyword => 
        section.title.toLowerCase().includes(keyword)
      )
    );

    if (projectsSection) {
      const content = projectsSection.content;
      let currentProject: Partial<Project> | null = null;

      for (const line of content) {
        if (this.looksLikeProjectTitle(line)) {
          if (currentProject && currentProject.name) {
            projects.push(currentProject as Project);
          }
          currentProject = {
            name: line.trim(),
            description: '',
            technologies: [] as string[],
            link: '',
            github: ''
          };
        } else if (currentProject && line.trim()) {
          // Enhanced URL detection
          if (line.includes('http') || line.includes('www.') || line.match(/\w+\.\w+\/\w+/)) {
            const urlMatch = line.match(URL_PATTERN);
            if (urlMatch) {
              const url = urlMatch[0];
              if (line.toLowerCase().includes('github') || url.includes('github.com')) {
                currentProject.github = url;
              } else if (line.toLowerCase().includes('live') || line.toLowerCase().includes('demo') || line.toLowerCase().includes('deployed')) {
                currentProject.link = url;
              } else {
                // Default to live link if not github
                if (!currentProject.link) {
                  currentProject.link = url;
                } else if (!currentProject.github) {
                  currentProject.github = url;
                }
              }
            }
          } 
          // Look for URL keywords even without http
          else if (line.toLowerCase().includes('live:') || line.toLowerCase().includes('demo:') || line.toLowerCase().includes('url:') || line.toLowerCase().includes('link:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
              const possibleUrl = parts[1].trim();
              if (possibleUrl.includes('.')) {
                currentProject.link = possibleUrl.startsWith('http') ? possibleUrl : `https://${possibleUrl}`;
              }
            }
          }
          // Look for GitHub without full URL
          else if (line.toLowerCase().includes('github:') || line.toLowerCase().includes('repository:') || line.toLowerCase().includes('repo:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
              const possibleRepo = parts[1].trim();
              if (possibleRepo.includes('/') && !possibleRepo.includes(' ')) {
                currentProject.github = possibleRepo.startsWith('http') ? possibleRepo : `https://github.com/${possibleRepo}`;
              }
            }
          }
          // Technology detection
          else if (line.toLowerCase().includes('tech') || line.includes(':')) {
            const techMatch = line.split(':')[1];
            if (techMatch) {
              currentProject.technologies = techMatch.split(',').map(t => t.trim());
            }
          } 
          // Description
          else {
            if (!currentProject.description) {
              currentProject.description = line.trim();
            } else {
              currentProject.description += ' ' + line.trim();
            }
          }
        }
      }

      if (currentProject && currentProject.name) {
        projects.push(currentProject as Project);
      }
    }

    return projects;
  }

  private looksLikeProjectTitle(line: string): boolean {
    return line.length < 100 && 
           !line.includes('http') &&
           !line.includes(':') &&
           !line.includes('•') &&
           !line.includes('-');
  }

  private extractCertifications() {
    // Similar logic for certifications
    return [];
  }
}

export function parseResume(text: string): ResumeData {
  const parser = new AIResumeParser(text);
  return parser.parse();
} 