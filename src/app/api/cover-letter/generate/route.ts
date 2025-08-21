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

    const sys = `You write concise, outcome-driven cover letters. Keep it to 350-450 words. Prefer concrete metrics and avoid fluff. Avoid generic openers like "I am excited to apply" or "I am writing to express my interest". Start with one sentence showing genuine appreciation for the company's product/mission (e.g., "What I like about <Company> is ..."), then transition into value you bring.`;
    const userPrompt = [
      `CANDIDATE: ${contactName}`,
      profileSummary ? `PROFILE SUMMARY: ${profileSummary}` : '',
      topAchievements ? `TOP ACHIEVEMENTS: ${topAchievements}` : '',
      skills ? `SKILLS: ${skills}` : '',
      `TONE: ${tone}`,
      `JOB DESCRIPTION: ${jobDescription}`,
      prompt ? `ADDITIONAL INSTRUCTIONS: ${prompt}` : '',
      `Return JSON with keys: greeting, intro, bodyParas (array of 2-3), closing, signoff. No extra text.`
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
        temperature: 0.3,
        max_tokens: 700,
        response_format: { type: 'json_object' }
      });
      jsonText = resp?.choices?.[0]?.message?.content || '';
    }

    let parsed: any = null;
    try { parsed = JSON.parse(jsonText || '{}'); } catch {}
    if (!parsed || !parsed.greeting) {
      parsed = fallbackCompose();
    }

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


