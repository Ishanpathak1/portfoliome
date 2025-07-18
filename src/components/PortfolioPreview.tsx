'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, ExternalLink, Download, Share2, Copy, CheckCircle, Globe, Star, Zap, Trophy, Sparkles, Settings } from 'lucide-react';
import { ResumeData, PersonalizationData } from '@/types/resume';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import confetti from 'canvas-confetti';

// Import all template components
import { ModernGlassmorphismTemplate } from '@/components/templates/ModernGlassmorphismTemplate';
import { MinimalistCleanTemplate } from '@/components/templates/MinimalistCleanTemplate';
import { CreativeGradientTemplate } from '@/components/templates/CreativeGradientTemplate';
import { DeveloperTerminalTemplate } from '@/components/templates/DeveloperTerminalTemplate';
import { DarkProfessionalTemplate } from '@/components/templates/DarkProfessionalTemplate';

interface PortfolioPreviewProps {
  resumeData: ResumeData;
  personalization: PersonalizationData;
}

export function PortfolioPreview({ resumeData, personalization }: PortfolioPreviewProps) {
  const { user } = useAuth();
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);

  // Generate portfolio URL when component loads
  useEffect(() => {
    generatePortfolio();
  }, [resumeData, personalization]);

  const generatePortfolio = async () => {
    setIsGenerating(true);
    try {
      if (!user) {
        alert('Please sign in to save your portfolio');
        return;
      }

      const response = await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          personalization,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioUrl(data.url);
        setPortfolioGenerated(true);
        console.log('Portfolio URL generated:', data.url);
        triggerConfetti();
      } else {
        const errorData = await response.json();
        console.error('Failed to generate portfolio:', errorData.error);
        alert(`Failed to generate portfolio: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error generating portfolio:', error);
      alert('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Convert ResumeData + PersonalizationData to DatabasePortfolio format
  const createMockPortfolio = (): DatabasePortfolio => {
    return {
      id: 'preview',
      userId: user?.uid || 'preview-user',
      slug: 'preview-portfolio',
      views: 0,
      isPublic: true,
      resumeData,
      personalization,
      templateId: personalization.templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const renderSelectedTemplate = () => {
    const mockPortfolio = createMockPortfolio();

    switch (personalization.templateId) {
      case 'modern-glassmorphism':
        return <ModernGlassmorphismTemplate portfolio={mockPortfolio} />;
      case 'minimalist-clean':
        return <MinimalistCleanTemplate portfolio={mockPortfolio} />;
      case 'creative-gradient':
        return <CreativeGradientTemplate portfolio={mockPortfolio} />;
      case 'developer-terminal':
        return <DeveloperTerminalTemplate portfolio={mockPortfolio} />;
      case 'dark-professional':
        return <DarkProfessionalTemplate portfolio={mockPortfolio} />;
      default:
        return <ModernGlassmorphismTemplate portfolio={mockPortfolio} />;
    }
  };

  const getTemplateName = (templateId: string) => {
    const templates = {
      'modern-glassmorphism': 'Modern Glassmorphism',
      'minimalist-clean': 'Minimalist Clean',
      'creative-gradient': 'Creative Gradient',
      'developer-terminal': 'Developer Terminal',
      'dark-professional': 'Dark Professional',
    };
    return templates[templateId as keyof typeof templates] || 'Modern Glassmorphism';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Personalization</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 btn-secondary"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Design</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
              <span className="text-sm text-gray-600">Portfolio Preview - {getTemplateName(personalization.templateId)}</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            <div className="h-[800px] overflow-y-auto portfolio-preview">
              {renderSelectedTemplate()}
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          {/* Share Portfolio */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🌐 Share Your Live Portfolio
            </h3>
            
            {isGenerating ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Generating your shareable portfolio...</p>
              </div>
            ) : portfolioGenerated && portfolioUrl ? (
              <>
                <p className="text-gray-600 mb-4">
                  🎉 Your portfolio is now live! Anyone can view it at this URL:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border-2 border-green-200">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700 flex-1 truncate font-mono">{portfolioUrl}</span>
                    <button
                      onClick={handleCopyUrl}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm transition-colors"
                    >
                      {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <a 
                      href={portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center space-x-2 btn-primary w-full"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Live Portfolio</span>
                    </a>
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href="/dashboard"
                        className="flex items-center justify-center space-x-2 btn-secondary"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Manage Portfolio</span>
                      </a>
                      <button 
                        onClick={() => navigator.share && navigator.share({ 
                          title: `${resumeData.contact.name} - Portfolio`,
                          text: 'Check out my professional portfolio!',
                          url: portfolioUrl 
                        })}
                        className="flex items-center justify-center space-x-2 btn-secondary"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  Your portfolio is being prepared for sharing...
                </p>
                <button 
                  onClick={generatePortfolio} 
                  className="btn-primary"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating Portfolio...' : 'Generate Portfolio'}
                </button>
              </div>
            )}
          </div>

          {/* Features Highlight */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Portfolio Features</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span>Live hosted portfolios</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Interactive animations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Multiple unique templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Shareable URLs that work</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span>AI-powered data extraction</span>
              </div>
            </div>
          </div>

          {/* Design Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Template:</span>
                <span className="font-medium">{getTemplateName(personalization.templateId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="font-medium capitalize">{personalization.colorScheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Layout:</span>
                <span className="font-medium capitalize">{personalization.layout}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 