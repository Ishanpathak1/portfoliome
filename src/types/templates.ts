export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'minimalist' | 'creative' | 'professional' | 'developer';
  features: string[];
}

export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern-glassmorphism',
    name: 'Modern Glassmorphism',
    description: 'Dark theme with glassmorphism effects, gradients, and smooth animations',
    preview: '/templates/modern-glassmorphism.jpg',
    category: 'modern',
    features: ['Dark Theme', 'Glassmorphism', 'Animated Background', 'Gradient Effects', 'Interactive Elements']
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    description: 'Clean white design with subtle shadows and plenty of whitespace',
    preview: '/templates/minimalist-clean.jpg',
    category: 'minimalist',
    features: ['Light Theme', 'Clean Typography', 'Minimal Design', 'Card Layout', 'Subtle Shadows']
  },
  {
    id: 'dark-professional',
    name: 'Dark Professional',
    description: 'Professional dark theme with clean typography and business-focused layout',
    preview: '/templates/dark-professional.jpg',
    category: 'professional',
    features: ['Dark Theme', 'Professional Layout', 'Clean Typography', 'Business Focus', 'Grid System']
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Vibrant gradients, bold colors, and creative layouts for artistic portfolios',
    preview: '/templates/creative-gradient.jpg',
    category: 'creative',
    features: ['Vibrant Colors', 'Bold Gradients', 'Creative Layout', 'Artistic Design', 'Color Animations']
  },
  {
    id: 'developer-terminal',
    name: 'Developer Terminal',
    description: 'Code-inspired design with terminal aesthetics and developer-focused features',
    preview: '/templates/developer-terminal.jpg',
    category: 'developer',
    features: ['Terminal Theme', 'Code Style', 'Monospace Font', 'Syntax Highlighting', 'Command Line']
  }
];

export type TemplateId = typeof AVAILABLE_TEMPLATES[number]['id']; 