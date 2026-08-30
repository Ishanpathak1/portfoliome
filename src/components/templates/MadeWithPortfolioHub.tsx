import { cn } from '@/lib/utils';

const EXECUTIVE_GRADIENTS: Record<string, string> = {
  blue: 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900',
  purple: 'bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900',
  green: 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900',
  orange: 'bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900',
  red: 'bg-gradient-to-r from-red-900 via-red-800 to-red-900',
};

const LIGHT_TEMPLATES = new Set([
  'minimalist-clean',
  'data-science-analyst',
  'creative-gradient',
]);

const WARM_TEMPLATES = new Set([
  'creative-portfolio',
]);

function getAttributionTone(templateId: string, colorScheme?: string) {
  if (templateId === 'corporate-executive') {
    return {
      footerClass: EXECUTIVE_GRADIENTS[colorScheme || 'blue'] || EXECUTIVE_GRADIENTS.blue,
      veilClass: 'bg-black/20',
      linkClass: 'text-white/45 hover:text-white/70',
    };
  }
  if (WARM_TEMPLATES.has(templateId)) {
    return {
      footerClass: 'bg-[#f6f1e8]',
      veilClass: '',
      linkClass: 'text-stone-400 hover:text-stone-500',
    };
  }
  if (LIGHT_TEMPLATES.has(templateId)) {
    return {
      footerClass: 'bg-neutral-50',
      veilClass: '',
      linkClass: 'text-neutral-400 hover:text-neutral-500',
    };
  }
  return {
    footerClass: 'bg-neutral-950',
    veilClass: '',
    linkClass: 'text-neutral-500 hover:text-neutral-400',
  };
}

export function MadeWithPortfolioHub({
  templateId,
  colorScheme,
}: {
  templateId: string;
  colorScheme?: string;
}) {
  const tone = getAttributionTone(templateId, colorScheme);

  return (
    <footer className={cn('relative w-full', tone.footerClass)}>
      {tone.veilClass ? <div className={cn('absolute inset-0', tone.veilClass)} /> : null}
      <div className="relative px-6 pt-10 pb-8 text-center">
        <a
          href="/"
          className={cn(
            'inline-block text-[11px] font-normal leading-none tracking-[0.16em] no-underline transition-colors duration-200',
            tone.linkClass
          )}
        >
          Made with PortfolioHub
        </a>
      </div>
    </footer>
  );
}
