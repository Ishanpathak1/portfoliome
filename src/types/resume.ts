export interface Contact {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  graduationDate: string;
  gpa?: string;
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

export interface Skill {
  category: string;
  items: string[];
}

export interface ResumeData {
  contact: Contact;
  summary?: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
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