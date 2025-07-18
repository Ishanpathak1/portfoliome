import { Metadata } from 'next';
import { 
  Wand2,
  FileText,
  Layout,
  Share2,
  Search,
  Palette,
  Sparkles,
  Globe,
  Zap,
  Shield,
  LineChart,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features - AI-Powered Portfolio Generator | PortfolioHub',
  description: 'Discover all the powerful features of PortfolioHub. AI-powered resume parsing, beautiful templates, real-time customization, and more.',
};

const features = [
  {
    title: 'AI-Powered Resume Parsing',
    description: 'Our advanced AI automatically extracts and organizes information from your resume, saving you hours of manual work.',
    icon: Wand2,
    category: 'AI Features'
  },
  {
    title: 'Multiple File Formats',
    description: 'Upload your resume in PDF, DOCX, or TXT format. Our smart parser handles them all with precision.',
    icon: FileText,
    category: 'Input Options'
  },
  {
    title: 'Beautiful Templates',
    description: 'Choose from a variety of professionally designed templates that adapt to your content.',
    icon: Layout,
    category: 'Design'
  },
  {
    title: 'Easy Sharing',
    description: 'Share your portfolio with a custom URL, perfect for adding to job applications or social media.',
    icon: Share2,
    category: 'Sharing'
  },
  {
    title: 'SEO Optimization',
    description: 'Every portfolio is optimized for search engines, helping you get discovered by recruiters.',
    icon: Search,
    category: 'Visibility'
  },
  {
    title: 'Real-time Customization',
    description: 'Customize colors, fonts, and layout in real-time with our intuitive editor.',
    icon: Palette,
    category: 'Design'
  },
  {
    title: 'AI Content Enhancement',
    description: 'Our AI suggests improvements to your content, making your portfolio more impactful.',
    icon: Sparkles,
    category: 'AI Features'
  },
  {
    title: 'Custom Domain Support',
    description: 'Use your own domain name for a more professional appearance.',
    icon: Globe,
    category: 'Pro Features'
  },
  {
    title: 'Lightning Fast',
    description: 'Built with Next.js for optimal performance and instant page loads.',
    icon: Zap,
    category: 'Technical'
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. Control what information is public or private.',
    icon: Shield,
    category: 'Security'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track portfolio views, engagement, and visitor demographics.',
    icon: LineChart,
    category: 'Pro Features'
  },
  {
    title: 'Quick Setup',
    description: 'Get your portfolio up and running in minutes, not hours.',
    icon: Clock,
    category: 'Ease of Use'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Professional Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to create a stunning portfolio that stands out from the crowd.
            Powered by AI, designed for professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-purple-400">{feature.category}</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create Your Portfolio?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already created stunning portfolios with PortfolioHub.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get Started for Free
          </a>
        </div>
      </div>
    </div>
  );
} 