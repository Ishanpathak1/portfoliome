import { getResponsibilityHtml } from '@/lib/responsibility-html';

interface ResponsibilityTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'p';
}

/**
 * Renders a responsibility string that may contain HTML (e.g. bold keywords).
 * Safely sanitizes and renders with dangerouslySetInnerHTML.
 */
export function ResponsibilityText({ text, className = '', style, as: Tag = 'p' }: ResponsibilityTextProps) {
  const html = getResponsibilityHtml(text);
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
