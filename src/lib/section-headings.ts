import { SectionHeadings } from '@/types/resume';

// Default section headings
export const DEFAULT_SECTION_HEADINGS: SectionHeadings = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  summary: 'Summary',
  contact: 'Contact',
};

// Get section heading with fallback to default
export function getSectionHeading(
  customHeadings: SectionHeadings | undefined,
  section: keyof SectionHeadings
): string {
  return customHeadings?.[section] || DEFAULT_SECTION_HEADINGS[section];
}

// Get all section headings with fallbacks
export function getAllSectionHeadings(
  customHeadings: SectionHeadings | undefined
): SectionHeadings {
  return {
    ...DEFAULT_SECTION_HEADINGS,
    ...customHeadings,
  };
} 