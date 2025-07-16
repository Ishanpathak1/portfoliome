import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - PortfolioHub Help Center',
  description: 'Find answers to common questions about creating and managing your portfolio with PortfolioHub. Learn about our features, pricing, and support.',
};

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What file formats do you support for resume upload?',
        a: 'We support PDF, DOCX, and TXT file formats. Our AI parser can handle most standard resume layouts and formats within these file types.',
      },
      {
        q: 'How long does it take to create a portfolio?',
        a: 'The initial portfolio generation takes just a few minutes. After uploading your resume, our AI processes it instantly, and you can have a basic portfolio ready in under 5 minutes. Additional customization time depends on your preferences.',
      },
      {
        q: 'Is coding knowledge required?',
        a: 'No coding knowledge is required! Our platform is designed to be user-friendly and handles all the technical aspects for you. You can create and customize your portfolio using our intuitive interface.',
      },
    ],
  },
  {
    category: 'Features & Customization',
    questions: [
      {
        q: 'Can I customize the design of my portfolio?',
        a: 'Yes! You can customize colors, fonts, layouts, and sections of your portfolio. Our templates are flexible and can be adjusted to match your personal brand.',
      },
      {
        q: 'Can I use my own domain name?',
        a: 'Yes, you can connect your own domain name to your portfolio. We provide detailed instructions for setting up custom domains with popular domain registrars.',
      },
      {
        q: 'How many templates are available?',
        a: 'We currently offer 10+ professionally designed templates, categorized for different industries and styles. We regularly add new templates based on user feedback and trends.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        q: 'Is my resume data secure?',
        a: 'Yes, we take security seriously. Your data is encrypted both in transit and at rest. We never share your personal information with third parties without your explicit consent.',
      },
      {
        q: 'Can I control what information is public?',
        a: 'Absolutely! You have full control over what information is displayed on your portfolio. You can easily hide or show specific sections and details.',
      },
      {
        q: 'How do I delete my portfolio?',
        a: 'You can delete your portfolio at any time from your dashboard settings. This will remove all your data from our servers permanently.',
      },
    ],
  },
  {
    category: 'Technical Support',
    questions: [
      {
        q: 'What if I encounter issues during setup?',
        a: 'Our support team is available to help! You can reach us through the contact form or email support@portfoliohub.com. We typically respond within 24 hours.',
      },
      {
        q: 'Do you offer portfolio review services?',
        a: 'Yes, we offer professional portfolio reviews as part of our premium package. Our experts can provide feedback on your portfolio\'s content, design, and effectiveness.',
      },
      {
        q: 'Is my portfolio mobile-responsive?',
        a: 'Yes, all our templates are fully responsive and optimized for all devices - desktop, tablet, and mobile.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Questions
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about PortfolioHub.
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold mb-8">{category.category}</h2>
              <div className="space-y-6">
                {category.questions.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden"
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer">
                        <h3 className="text-lg font-medium pr-8">{faq.q}</h3>
                        <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-6 pb-6 text-gray-300">
                        {faq.a}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you with any questions or concerns.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 