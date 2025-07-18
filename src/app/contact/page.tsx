'use client';

import { Mail, MessageCircle, Clock, Phone } from 'lucide-react';
import { useState } from 'react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Send me an email and I\'ll get back to you as soon as possible.',
    action: 'ishan.pathak2711@gmail.com',
    link: 'mailto:ishan.pathak2711@gmail.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    description: 'Feel free to call or text me during business hours.',
    action: '(518) 699-2475',
    link: 'tel:+15186992475',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'I aim to respond to all inquiries within 24 hours.',
    action: 'Quick Response',
    link: '#response-time',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus({ loading: false, error: '', success: true });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
        success: false
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Let's
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Connect
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'd love to hear from you! Whether you have a question about my work or just want to say hello,
            feel free to reach out through any of the channels below.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 w-12 h-12 mb-6">
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{method.title}</h3>
              <p className="text-gray-300 mb-4">{method.description}</p>
              <span className="text-purple-400 font-medium">{method.action}</span>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="How can I help?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell me more about your inquiry..."
                  required
                />
              </div>

              {status.error && (
                <div className="text-red-400 text-sm">{status.error}</div>
              )}

              {status.success && (
                <div className="text-green-400 text-sm">Message sent successfully! I'll get back to you soon.</div>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium transition-all ${
                  status.loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {status.loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-20 text-center">
          <p className="text-gray-300 mb-4">
            You might find quick answers to common questions in the
          </p>
          <a
            href="/faq"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Frequently Asked Questions →
          </a>
        </div>
      </div>
    </div>
  );
} 