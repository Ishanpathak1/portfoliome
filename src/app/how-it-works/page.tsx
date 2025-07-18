import { Metadata } from 'next';
import { Upload, Wand2, Palette, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works - Create Your Portfolio in Minutes | PortfolioHub',
  description: 'Learn how PortfolioHub transforms your resume into a professional portfolio website in just minutes. Simple, fast, and powered by AI.',
};

const steps = [
  {
    number: 1,
    title: 'Upload Your Resume',
    description: 'Start by uploading your existing resume in PDF, DOCX, or TXT format. Our AI will handle the rest.',
    icon: Upload,
    details: [
      'Support for multiple file formats',
      'Secure file handling',
      'Instant processing',
    ],
  },
  {
    number: 2,
    title: 'AI Magic Happens',
    description: 'Our advanced AI analyzes your resume, extracting and organizing your professional information perfectly.',
    icon: Wand2,
    details: [
      'Smart content extraction',
      'Automatic categorization',
      'Context understanding',
    ],
  },
  {
    number: 3,
    title: 'Customize Your Portfolio',
    description: 'Choose from beautiful templates and customize every aspect to match your personal brand.',
    icon: Palette,
    details: [
      'Multiple professional templates',
      'Color scheme customization',
      'Layout flexibility',
    ],
  },
  {
    number: 4,
    title: 'Share with the World',
    description: 'Get a professional URL for your portfolio and share it with employers, clients, or on social media.',
    icon: Share2,
    details: [
      'Custom domain support',
      'Social media integration',
      'SEO optimization',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Create Your Portfolio in
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}4 Simple Steps
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your resume into a stunning portfolio website in minutes.
            No coding required – just upload your resume and let our AI do the magic.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 to-pink-500 hidden md:block" />

          {/* Steps Grid */}
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 md:gap-16`}
              >
                {/* Step Number */}
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold hidden md:flex">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold">{step.title}</h3>
                    </div>
                    
                    <p className="text-gray-300 text-lg mb-6">
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Illustration Space */}
                <div className="flex-1 hidden md:block">
                  {/* Add illustrations here if needed */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Have Questions?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Check out our frequently asked questions or contact our support team.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/faq"
              className="inline-block bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              View FAQ
            </a>
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 