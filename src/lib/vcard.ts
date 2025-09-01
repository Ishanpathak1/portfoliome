import { Contact } from '@/types/resume';

function normalizeLineBreaks(input: string): string {
  return input.replace(/\r?\n/g, '\r\n');
}

function escape(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function buildVCardString(contact: Contact): string {
  const name = contact.name || 'Contact';
  const email = contact.email || '';
  const phone = contact.phone || '';
  const website = contact.website || contact.github || contact.linkedin || '';
  const location = contact.location || '';

  const lines: string[] = [];
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  lines.push(`FN:${escape(name)}`);
  // Split name into parts best-effort (Last;First;;;)
  const parts = name.trim().split(/\s+/);
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ');
  lines.push(`N:${escape(last)};${escape(first)};;;`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${escape(email)}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${escape(phone)}`);
  if (website) lines.push(`URL:${escape(website)}`);
  if (location) lines.push(`ADR;TYPE=HOME;LABEL=${escape(location)}:;;;;;;;`);
  lines.push('END:VCARD');

  const joined = lines.join('\r\n');
  return normalizeLineBreaks(joined);
}

export function downloadVCard(contact: Contact, fileName?: string) {
  const vcard = buildVCardString(contact);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = (fileName || contact.name || 'contact').replace(/[^a-z0-9\-_.]/gi, '_');
  anchor.href = url;
  anchor.download = `${safeName}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}


