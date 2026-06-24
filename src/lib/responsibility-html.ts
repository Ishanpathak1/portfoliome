import sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTIONS = {
  allowedTags: ['strong', 'b', 'em', 'i'],
  allowedAttributes: {},
};

/**
 * Sanitize HTML from responsibility content. Only allows bold/italic for resume keywords.
 */
export function sanitizeResponsibilityHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

/**
 * Render a responsibility string (plain or HTML) safely.
 * Use with dangerouslySetInnerHTML in templates.
 * Sanitizes to only allow strong, b, em, i for bold/italic keywords.
 */
export function getResponsibilityHtml(item: string): string {
  if (!item || typeof item !== 'string') return '';
  return sanitizeResponsibilityHtml(item);
}
