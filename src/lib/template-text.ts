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