export interface Contact {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  // Legacy fields for template compatibility
  title?: string;
  description?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  // Additional fields for template compatibility
  location?: string;
  honors?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

// Legacy alias for backward compatibility
export interface Skill extends SkillCategory {}

export interface ResumeData {
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  certifications?: string[];
}

export interface PersonalizationData {
  templateId: string;
  theme: 'modern' | 'classic' | 'creative' | 'minimal';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  layout: 'single-column' | 'two-column' | 'timeline';
  showPhoto: boolean;
  additionalSections: string[];
}

export interface PortfolioData {
  id: string;
  resumeData: ResumeData;
  personalization: PersonalizationData;
  createdAt: string;
  updatedAt: string;
} 