import { Metadata } from 'next';
import EditableText from '@/components/EditableText';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: 'Cover Letter Preview',
};

export default function CoverLetterRenderPage({ searchParams }: Props) {
  const pdf = (searchParams.pdf as string) === '1';
  const name = (searchParams.name as string) || 'Your Name';
  const email = (searchParams.email as string) || '';
  const phone = (searchParams.phone as string) || '';
  const location = (searchParams.location as string) || '';
  const linkedin = (searchParams.linkedin as string) || '';
  const company = (searchParams.company as string) || 'Company Name';
  const role = (searchParams.role as string) || (searchParams.position as string) || 'Professional';
  const greeting = (searchParams.greeting as string) || 'Dear Hiring Manager,';
  const intro = (searchParams.intro as string) || 'I am excited to apply...';
  const closing = (searchParams.closing as string) || '';
  const signoff = (searchParams.signoff as string) || '';
  const bp = searchParams.bp;
  const bodyParas: string[] = Array.isArray(bp)
    ? (bp as string[])
    : typeof bp === 'string'
    ? [bp]
    : [];

  return (
    <div className={`${pdf ? 'bg-white' : 'bg-gray-50 py-10'}`} suppressHydrationWarning>
      <div className={`${pdf ? '' : 'max-w-4xl mx-auto px-4'}`}>
        <div className={`bg-white ${pdf ? '' : 'rounded-2xl shadow-sm border border-gray-200'} overflow-hidden a4-page`} style={pdf ? { width: 794, height: 1123, margin: '0 auto' } : undefined}>
          <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600" />
          <div className="p-8">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-extrabold text-gray-900">{name}</div>
                <EditableText value={role} className="text-gray-600 outline-none" disabled={pdf} />
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end">
                  {email && <span>{email}</span>}
                  {phone && <><span>•</span><span>{phone}</span></>}
                  {location && <><span>•</span><span>{location}</span></>}
                </div>
                {linkedin && <div className="mt-1">{linkedin}</div>}
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <div>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="font-medium text-gray-900">Hiring Manager</div>
              <div>{company}</div>
            </div>

            <div className="space-y-5 leading-relaxed text-gray-800">
              <p className="font-medium">{greeting}</p>
              <p>{intro}</p>
              {bodyParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {closing && <p>{closing}</p>}
              {signoff && <p className="font-semibold whitespace-pre-wrap">{signoff}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


