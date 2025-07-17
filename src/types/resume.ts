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

// Dynamic custom sections
export interface CustomSection {
  id: string;
  title: string;
  content: string | string[]; // Can be text or list
  type: 'text' | 'list' | 'achievements' | 'certifications' | 'publications';
  order: number;
  visible: boolean;
}

// Custom section headings
export interface SectionHeadings {
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  summary: string;
  contact: string;
  // Add more as needed
  [key: string]: string;
}

// Template-specific customizable text
export interface TemplateText {
  // Corporate Executive template
  corporateExecutive?: {
    tagline?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
  };
  // Modern Glassmorphism template
  modernGlassmorphism?: {
    tagline?: string;
    ctaTitle?: string;
    ctaDescription?: string;
  };
  // Add more templates as needed
  [templateId: string]: {
    [key: string]: string;
  } | undefined;
}

// Healthcare-specific data for medical professionals
export interface HealthcareData {
  medicalLicenses?: MedicalLicense[];
  boardCertifications?: BoardCertification[];
  hospitalAffiliations?: HospitalAffiliation[];
  publications?: Publication[];
  cmeCredits?: CMECredit[];
  professionalMemberships?: string[];
  clinicalExperience?: ClinicalExperience[];
  research?: ResearchProject[];
}

export interface MedicalLicense {
  type: string; // e.g., "Medical License", "DEA License"
  number: string;
  state: string;
  expirationDate: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface BoardCertification {
  board: string; // e.g., "American Board of Internal Medicine"
  specialty: string;
  certificationDate: string;
  expirationDate?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface HospitalAffiliation {
  hospital: string;
  department?: string;
  role: string; // e.g., "Attending Physician", "Staff Physician"
  privileges: string[];
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Publication {
  title: string;
  journal: string;
  authors: string[];
  publicationDate: string;
  doi?: string;
  pmid?: string;
  type: 'research' | 'review' | 'case-study' | 'editorial';
}

export interface CMECredit {
  activity: string;
  provider: string;
  credits: number;
  completionDate: string;
  category: string;
}

export interface ClinicalExperience {
  specialty: string;
  setting: string; // e.g., "Hospital", "Clinic", "Private Practice"
  procedures?: string[];
  patientPopulation?: string;
  yearsOfExperience: number;
}

export interface ResearchProject {
  title: string;
  role: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  publications?: string[];
}

export interface ResumeData {
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  certifications?: string[];
  // Dynamic sections support
  customSections?: CustomSection[];
  // Healthcare-specific data
  healthcare?: HealthcareData;
  // Profession type
  profession?: 'general' | 'healthcare' | 'education' | 'finance' | 'legal' | 'creative' | 'sales';
}

export interface PersonalizationData {
  templateId: string;
  theme: 'modern' | 'classic' | 'creative' | 'minimal';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  layout: 'single-column' | 'two-column' | 'timeline';
  showPhoto: boolean;
  additionalSections: string[];
  // Section management
  sectionOrder?: string[]; // Array of section IDs in display order
  hiddenSections?: string[]; // Array of section IDs that are hidden
  // Custom section headings
  sectionHeadings?: SectionHeadings;
  // Template-specific text customization
  templateText?: TemplateText;
}

export interface PortfolioData {
  id: string;
  resumeData: ResumeData;
  personalization: PersonalizationData;
  createdAt: string;
  updatedAt: string;
} 