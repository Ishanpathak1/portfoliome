import { NextRequest, NextResponse } from 'next/server';
import { upsertApplicationStatus, type ApplicationStatus } from '@/lib/portfolio-db';

import type { ResumeData } from '@/types/resume';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const parseUserId = (header: string | null): string | null => {
      if (!header || !header.startsWith('Bearer ')) return null;
      try {
        const token = header.substring(7);
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.user_id || payload.sub || payload.uid || null;
      } catch {
        return null;
      }
    };

    const { jobDescription, resumeData, prompt, company, status }: { jobDescription: string; resumeData?: ResumeData; prompt?: string; company?: string; status?: ApplicationStatus } = await req.json();
    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json({ error: 'Job description is too short.' }, { status: 400 });
    }

    const openaiApiKey = process.env.OPEN_KEY;

    const fallbackCompose = () => {
      const greeting = 'Dear Hiring Manager,';
      const intro = 'I am excited to apply for this role. I bring experience shipping user-centric features and collaborating across engineering, design, and go-to-market to deliver measurable outcomes.';
      const bodyParas = [
        'Recently, I led an initiative that improved key conversion by 20% through iterative experiments and close work with design and data partners.',
        'I focus on clear problem framing, lightweight research, and crisp success metrics, balancing quick wins with foundational improvements.'
      ];
      const closing = 'I would welcome the opportunity to discuss how my background aligns with your needs.';
      const signoff = 'Sincerely,\nYour Name';
      return { greeting, intro, bodyParas, closing, signoff };
    };

    if (!openaiApiKey) {
      return NextResponse.json({ contentBlocks: fallbackCompose(), modelUsed: 'fallback', tokensUsed: 0 });
    }

    // Lazy import to avoid bundling issues
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey: openaiApiKey });

    // Compress resume data into a compact profile
    const profileSummary = (resumeData?.summary || '').slice(0, 800);
    const responsibilities = (resumeData?.experience || [])
      .flatMap(exp => (exp.responsibilities || []).slice(0, 3))
      .filter(Boolean)
      .slice(0, 8);
    const topAchievements = responsibilities.join(' • ');
    const skills = (resumeData?.skills || [])
      .flatMap(s => s.items)
      .filter(Boolean)
      .slice(0, 12)
      .join(', ');
    const contactName = resumeData?.contact?.name || 'Candidate';
    const tone = 'warm professional, concise, numbers-first';

    const sys = `You are a world-class cover-letter writer. Write in first person, confident but grounded.
Keep it to 300-400 words. Prioritize specificity over adjectives. Use numbers and tangible outcomes.
Absolutely avoid generic openers like "I am excited to apply" or "I am writing to express my interest".

STYLE & TONE
- Warm-professional, concise, "you"-focused. Limit the word "I" to at most twice per paragraph.
- Mirror 2–4 distinctive phrases from the JOB DESCRIPTION to signal fit without overdoing it.
- Vary sentence lengths. No cliches, no buzzwords, no filler.

STRUCTURE
1) Opening: a single sentence that shows a sharp, specific appreciation of the COMPANY's product/mission or problems, using details from JOB DESCRIPTION.
2) Core: 2 short paragraphs that map the candidate's most relevant achievements to the role's top requirements. For each paragraph, explicitly connect an achievement to a requirement and include concrete metrics.
3) Close: one sentence on why-now/impact-at-90-days, and a clear, polite CTA to talk.

CUSTOMIZATION RULES
- If COMPANY is provided, set greeting to "Dear ${company} Hiring Team," otherwise "Dear Hiring Manager,".
- Address the company as "you"; frame benefits in terms of outcomes they will see (e.g., conversion lift, latency reduction, revenue impact).
- Do not invent facts. Use only provided PROFILE SUMMARY, TOP ACHIEVEMENTS, SKILLS, and JOB DESCRIPTION.

Return only JSON.`;
    const userPrompt = [
      `CANDIDATE: ${contactName}`,
      company ? `COMPANY: ${company}` : '',
      profileSummary ? `PROFILE SUMMARY: ${profileSummary}` : '',
      topAchievements ? `TOP ACHIEVEMENTS: ${topAchievements}` : '',
      skills ? `SKILLS: ${skills}` : '',
      `TONE: ${tone}`,
      `JOB DESCRIPTION: ${jobDescription}`,
      prompt ? `ADDITIONAL INSTRUCTIONS: ${prompt}` : '',
      `OUTPUT FORMAT: Return JSON with keys -> greeting (string), intro (string), bodyParas (array of exactly 2 or 3 short paragraphs), closing (string), signoff (string; use "${contactName}" as the name). No extra text.`
    ].filter(Boolean).join('\n');

    // Prefer Responses API when available; fallback to chat.completions
    let jsonText: string | null = null;
    try {
      const resp = await (client as any).responses.create({
        model: 'gpt-4o-mini',
        input: [
          { role: 'system', content: sys },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      });
      jsonText = resp?.output_text ?? null;
      if (!jsonText && resp?.output?.[0]?.content?.[0]?.type === 'output_text') {
        jsonText = resp.output[0].content[0].text;
      }
    } catch {}

    if (!jsonText) {
      const resp = await (client as any).chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 900,
        response_format: { type: 'json_object' }
      });
      jsonText = resp?.choices?.[0]?.message?.content || '';
    }

    let parsed: any = null;
    try { parsed = JSON.parse(jsonText || '{}'); } catch {}
    if (!parsed || !parsed.greeting) {
      parsed = fallbackCompose();
    }

    // Normalize signoff to always include "Sincerely," followed by the candidate's name
    try {
      const ensureSincerelySignoff = (signoff: string | undefined, name: string): string => {
        const candidateName = (name || 'Candidate').trim();
        // Standardize to exactly two lines: "Sincerely," and the name
        return `Sincerely,\n${candidateName}`;
      };
      parsed.signoff = ensureSincerelySignoff(parsed?.signoff, contactName);
    } catch {}

    // Best-effort save of application status if provided
    const userId = parseUserId(authHeader);
    const allowed: ApplicationStatus[] = ['APPLIED', 'ACCEPTED', 'REJECTED'];
    if (userId && company && status && allowed.includes(status)) {
      try {
        await upsertApplicationStatus(userId, company, status);
      } catch {
        // Swallow errors to avoid polluting PDF/download responses or UI with Next error overlay
      }
    }

    return NextResponse.json({ contentBlocks: parsed, modelUsed: 'gpt-4o-mini' });
  } catch (error: any) {
    console.error('Cover letter generate error:', error);
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}


