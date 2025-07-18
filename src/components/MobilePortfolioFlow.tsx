'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, SkipForward, Check } from 'lucide-react';
import { PersonalizationData, ResumeData } from '@/types/resume';
import { AVAILABLE_TEMPLATES } from '@/types/templates';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import confetti from 'canvas-confetti';

interface MobilePortfolioFlowProps {
  resumeData: ResumeData;
  onComplete: (personalization: PersonalizationData) => void;
  onSignOut: () => void;
}

export function MobilePortfolioFlow({ resumeData, onComplete, onSignOut }: MobilePortfolioFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileStep, setMobileStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    templateId: 'modern-glassmorphism',
    theme: 'modern',
    colorScheme: 'blue',
    layout: 'single-column',
    showPhoto: false,
    additionalSections: []
  });

  // Create preview styles for each template
  const getTemplatePreview = (templateId: string) => {
    switch (templateId) {
      case 'modern-glassmorphism':
        return 'bg-gradient-to-br from-purple-900 to-blue-900';
      case 'minimalist-clean':
        return 'bg-white border-2 border-gray-200';
      case 'creative-gradient':
        return 'bg-gradient-to-br from-purple-400 to-pink-500';
      case 'developer-terminal':
        return 'bg-black text-green-400';
      case 'dark-professional':
        return 'bg-gray-900';
      case 'corporate-executive':
        return 'bg-gradient-to-br from-gray-50 to-blue-50';
      case 'full-stack-developer':
        return 'bg-gradient-to-br from-cyan-900 to-blue-900';
      case 'tech-innovator':
        return 'bg-gradient-to-br from-blue-900 to-cyan-900';
      case 'open-source-contributor':
        return 'bg-gradient-to-br from-green-900 to-emerald-900';
      case 'creative-portfolio':
        return 'bg-gradient-to-br from-pink-900 to-purple-900';
      default:
        return 'bg-gray-500';
    }
  };

  const colorSchemes = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setPersonalization(prev => ({ ...prev, templateId }));
    setMobileStep(2);
  };

  const handleColorSelect = (colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red') => {
    setPersonalization(prev => ({ ...prev, colorScheme }));
    setMobileStep(3);
  };

  const handleSkipSections = () => {
    onComplete(personalization);
    router.push('/dashboard');
  };

  const handleFinish = async () => {
    if (!user) {
      alert('Please sign in to save your portfolio');
      return;
    }

    setIsGenerating(true);
    try {
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
        console.log('Portfolio generated:', data.url);
        
        // Trigger confetti celebration
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        
        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);

          // Fire confetti from the top left
          confetti({
            particleCount,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0 },
            colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981']
          });

          // Fire confetti from the top right
          confetti({
            particleCount,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0 },
            colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981']
          });
        }, 250);
        
        onComplete(personalization);
        
        // Delay navigation to show confetti
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Header */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-300">Step {mobileStep} of 3</div>
            <button
              onClick={onSignOut}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(mobileStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Mobile Step Content */}
        <div className="max-w-md mx-auto">
          {mobileStep === 1 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
              <p className="text-gray-300 mb-6">Select a design that represents your style</p>
              
                             <div className="space-y-4">
                 {AVAILABLE_TEMPLATES.map((template) => (
                   <button
                     key={template.id}
                     onClick={() => handleTemplateSelect(template.id)}
                     className={`w-full p-4 rounded-lg border-2 transition-all ${
                       personalization.templateId === template.id
                         ? 'border-purple-500 bg-white/10'
                         : 'border-white/20 bg-white/5 hover:bg-white/10'
                     }`}
                   >
                     <div className="flex items-center space-x-4">
                       <div className={`w-12 h-12 rounded-lg ${getTemplatePreview(template.id)}`}></div>
                       <div className="text-left">
                         <div className="text-white font-medium">{template.name}</div>
                         <div className="text-gray-300 text-sm">{template.description}</div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                     </div>
                   </button>
                 ))}
              </div>
            </div>
          )}

          {mobileStep === 2 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Color</h2>
              <p className="text-gray-300 mb-6">Pick a color scheme that matches your brand</p>
              
              <div className="grid grid-cols-2 gap-4">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => handleColorSelect(scheme.id as 'blue' | 'green' | 'purple' | 'orange' | 'red')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      personalization.colorScheme === scheme.id
                        ? 'border-purple-500 bg-white/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-8 h-8 rounded-full ${scheme.color}`}></div>
                      <div className="text-white font-medium">{scheme.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mobileStep === 3 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Customize Sections</h2>
              <p className="text-gray-300 mb-6">Add or modify sections (optional)</p>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <div className="text-white font-medium mb-2">Section Headings</div>
                  <div className="text-gray-300 text-sm">Customize section titles like "Experience", "Skills", etc.</div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg border border-white/20">
                  <div className="text-white font-medium mb-2">Additional Sections</div>
                  <div className="text-gray-300 text-sm">Add custom sections like "Certifications", "Awards", etc.</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSkipSections}
                  className="w-full flex items-center justify-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip for Now</span>
                </button>
                
                <button
                  onClick={handleFinish}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating Portfolio...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Generate Portfolio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 