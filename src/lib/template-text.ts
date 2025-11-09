import { TemplateText } from '@/types/resume';

// Default template text for different templates
export const DEFAULT_TEMPLATE_TEXT: TemplateText = {
  corporateExecutive: {
    tagline: 'Driving Strategic Excellence & Innovation',
    ctaTitle: 'Ready to Drive Growth?',
    ctaDescription: "Let's discuss how strategic leadership can transform your organization's trajectory.",
    ctaButtonText: 'Contact Me',
  },
  modernGlassmorphism: {
    tagline: 'Innovating Tomorrow, Today',
    ctaTitle: 'Ready to Collaborate?',
    ctaDescription: "Let's create something amazing together.",
    fallbackName: 'Your Name',
    fallbackPosition: 'Professional Portfolio',
  },
  creativeGradient: {
    tagline: 'Creating Beautiful Experiences',
    fallbackName: 'Creative Mind',
    fallbackSummary: 'Passionate about creating amazing experiences through innovative design and technology',
  },
  creativePortfolio: {
    tagline: 'Crafting Digital Art & Experiences',
    fallbackName: 'Creative Portfolio',
    fallbackSummary: 'Passionate artist and designer creating meaningful digital experiences',
    viewWorkUrl: '',
  },
  developerTerminal: {
    // No customizable text for this template
  },
  fullStackDev: {
    endMessage: 'END_OF_TRANSMISSION',
    footerMessage: 'Thank you for exploring my digital portfolio matrix',
    techStack: 'Built with: React • TypeScript • Next.js • Tailwind CSS',
  },
  minimalistClean: {
    fallbackName: 'Your Name',
    fallbackPosition: 'Professional',
    fallbackSummary: 'Passionate professional dedicated to creating exceptional solutions and delivering outstanding results.',
  },
  techInnovator: {
    fallbackName: 'Tech Innovator',
    tagline: 'Pioneering Tomorrow\'s Technology',
    ctaTitle: 'Ready to Innovate the Future?',
    ctaDescription: 'Let\'s collaborate to build tomorrow\'s technology with AI, quantum computing, and neural networks',
  },
  openSourceContributor: {
    fallbackName: 'Open Source Contributor',
    tagline: 'Building the Future, One Commit at a Time',
    footerTitle: 'Let\'s Build Together',
    footerDescription: 'Join me in creating open source solutions that make a difference in the developer community.',
  },
  dataScienceAnalyst: {
    fallbackName: 'Data Science Professional',
    tagline: 'Transforming Data into Actionable Insights',
    fallbackSummary: 'Passionate data scientist with expertise in machine learning, statistical analysis, and data visualization. Dedicated to transforming complex data into actionable insights that drive business decisions.',
    analyticsTitle: 'Analytics Dashboard',
    analyticsDescription: 'Comprehensive overview of key performance metrics and data-driven achievements across all projects and initiatives.',
  },
};

// Convert template ID to template key
function getTemplateKey(templateId: string): string {
  // Convert kebab-case to camelCase
  return templateId.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Get template text with fallback to default
export function getTemplateText(
  customText: TemplateText | undefined,
  templateId: string,
  textKey: string
): string {
  const templateKey = getTemplateKey(templateId);
  return customText?.[templateKey]?.[textKey] || 
         DEFAULT_TEMPLATE_TEXT[templateKey]?.[textKey] || 
         '';
}

// Get all template text for a specific template
export function getAllTemplateText(
  customText: TemplateText | undefined,
  templateId: string
): Record<string, string> {
  const templateKey = getTemplateKey(templateId);
  return {
    ...DEFAULT_TEMPLATE_TEXT[templateKey],
    ...customText?.[templateKey],
  };
} 