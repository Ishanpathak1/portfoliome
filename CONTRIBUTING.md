# Contributing to PortfolioHub Templates

Thank you for your interest in contributing to PortfolioHub! We welcome contributions, especially new portfolio templates that can help users create beautiful, professional portfolios.

## How to Contribute Templates

### 1. Template Structure

All templates are located in `src/components/templates/`. Each template should:

- Be a React component that accepts portfolio data as props
- Follow the existing naming convention: `[TemplateName]Template.tsx`
- Be responsive and work well on all screen sizes
- Include proper TypeScript types

### 2. Creating a New Template

#### Step 1: Create the Template Component

Create a new file in `src/components/templates/` following this structure:

```tsx
import React from 'react';
import { PortfolioData } from '@/types/resume';

interface YourTemplateProps {
  data: PortfolioData;
}

export function YourTemplate({ data }: YourTemplateProps) {
  return (
    <div className="min-h-screen bg-your-background">
      {/* Your template design here */}
      <header>
        <h1>{data.personalInfo.name}</h1>
        <p>{data.personalInfo.title}</p>
      </header>
      
      {/* Add sections for experience, education, skills, etc. */}
    </div>
  );
}
```

#### Step 2: Add Template Metadata

Add your template to the template registry in `src/components/templates/TemplateRenderer.tsx`:

```tsx
const templates = {
  // ... existing templates
  'your-template': {
    name: 'Your Template Name',
    description: 'Brief description of your template',
    component: YourTemplate,
    preview: '/path/to/preview-image.jpg', // Optional
    category: 'professional' | 'creative' | 'developer' | 'executive',
    features: ['Responsive', 'Dark Mode', 'Modern Design'], // Optional
  },
};
```

#### Step 3: Update Template Selector

Make sure your template appears in the template selector by updating the templates list in `src/components/TemplateSelector.tsx` if needed.

### 3. Template Guidelines

#### Design Principles
- **Clean and Professional**: Templates should look polished and suitable for job applications
- **Responsive**: Must work well on desktop, tablet, and mobile devices
- **Accessible**: Follow web accessibility best practices
- **Performance**: Optimize for fast loading and smooth interactions

#### Technical Requirements
- Use Tailwind CSS for styling
- Follow existing code patterns and conventions
- Include proper TypeScript types
- Test on multiple screen sizes
- Ensure compatibility with the existing data structure

#### Content Sections to Include
Your template should handle these common portfolio sections:
- Personal Information (name, title, contact)
- Professional Summary
- Work Experience
- Education
- Skills
- Projects
- Certifications (optional)
- References (optional)

### 4. Template Categories

We organize templates into categories:

- **Professional**: Clean, corporate-style templates
- **Creative**: Artistic, colorful templates for designers/creatives
- **Developer**: Technical, code-focused templates
- **Executive**: High-level, leadership-focused templates
- **Minimalist**: Simple, clean designs with minimal elements

### 5. Submission Process

1. **Fork the Repository**: Create a fork of the PortfolioHub repository
2. **Create a Branch**: Create a new branch for your template
   ```bash
   git checkout -b add-template-[template-name]
   ```
3. **Develop Your Template**: Follow the guidelines above
4. **Test Thoroughly**: Ensure your template works with sample data
5. **Submit a Pull Request**: Include:
   - Template component file
   - Updated template registry
   - Screenshots or preview images
   - Brief description of the template's unique features

### 6. Pull Request Guidelines

When submitting your template:

#### PR Title Format
```
feat: Add [Template Name] template
```

#### PR Description Should Include
- Template name and category
- Key features and design highlights
- Screenshots (desktop and mobile)
- Any special requirements or dependencies

#### Example PR Description
```markdown
## Template: Modern Developer Portfolio

### Category: Developer
### Features:
- Dark theme with syntax highlighting
- Project showcase with live demos
- Skills visualization
- Responsive design
- GitHub integration ready

### Screenshots:
[Include screenshots here]

### Testing:
- ✅ Tested on desktop (Chrome, Firefox, Safari)
- ✅ Tested on mobile devices
- ✅ Verified with sample portfolio data
- ✅ Accessibility checked
```

### 7. Code Quality Standards

- Follow existing code formatting and linting rules
- Use meaningful component and variable names
- Add comments for complex logic
- Ensure no console errors or warnings
- Test with different types of portfolio data

### 8. Getting Help

If you need help while creating your template:

- Check existing templates for reference
- Review the `types/resume.ts` file for data structure
- Look at the `TemplateRenderer.tsx` for integration patterns
- Open an issue for questions or clarifications

### 9. Template Ideas

Looking for inspiration? Here are some template ideas we'd love to see:

- **Academic Portfolio**: For researchers and academics
- **Freelancer Portfolio**: For independent contractors
- **Student Portfolio**: For new graduates
- **Artist Portfolio**: For visual artists and designers
- **Consultant Portfolio**: For business consultants
- **Healthcare Portfolio**: For medical professionals

## Thank You!

Your contributions help make PortfolioHub better for everyone. We appreciate your time and effort in creating beautiful, functional templates that help users showcase their professional achievements.

---

For general contribution guidelines or bug reports, please refer to the main project documentation. 