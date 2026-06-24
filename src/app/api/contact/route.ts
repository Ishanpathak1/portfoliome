import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5_000),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD // your Gmail app password
  }
});

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'contact', ...RATE_LIMITS.contact });
    if (limited) return limited;

    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid contact form data' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const htmlName = escapeHtml(name);
    const htmlEmail = escapeHtml(email);
    const htmlSubject = escapeHtml(subject);
    const htmlMessage = escapeHtml(message).replace(/\n/g, '<br />');

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${htmlName}</p>
        <p><strong>Email:</strong> ${htmlEmail}</p>
        <p><strong>Subject:</strong> ${htmlSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${htmlMessage}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 