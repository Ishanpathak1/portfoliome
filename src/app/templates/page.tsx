import { Metadata } from 'next';
import { AVAILABLE_TEMPLATES } from '@/types/templates';
import { Code, Palette, Monitor, Briefcase, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portfolio Templates - Professional & Modern Designs | PortfolioHub',
  description: 'Choose from our collection of beautiful, responsive portfolio templates. Developer-focused, creative, and professional designs for every career.',
};

const categories = [
  {
    id: 'developer',
    name: 'Developer',
    icon: Code,
    description: 'Perfect for software engineers and developers',
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: Palette,
    description: 'Ideal for designers and artists',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    icon: Monitor,
    description: 'Clean and simple designs',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Briefcase,
    description: 'Corporate and business-focused',
  },
  {
    id: 'modern',
    name: 'Modern',
    icon: Sparkles,
    description: 'Contemporary and innovative designs',
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Perfect
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Portfolio Template
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional, customizable templates for every career path.
            All templates are mobile-responsive and optimized for performance.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-center hover:bg-white/15 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2 w-12 h-12 mx-auto mb-3">
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AVAILABLE_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden hover:scale-102 transition-all duration-300"
            >
              {/* Template Preview */}
              <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {/* Add template preview component here */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-300 mb-4">{template.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
                    Features
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preview Button */}
                <a
                  href={`/templates/${template.id}`}
                  className="mt-6 inline-block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Preview Template
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Found Your Perfect Template?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get started with your chosen template and create your portfolio in minutes.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create Your Portfolio
          </a>
        </div>
      </div>
    </div>
  );
} 