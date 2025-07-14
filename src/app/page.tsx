'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploadSection } from '@/components/FileUploadSection';
import { PersonalizationForm } from '@/components/PersonalizationForm';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { ResumeData, PersonalizationData } from '@/types/resume';
import { Upload, Palette, Eye, Sparkles, Settings } from 'lucide-react';

export default function HomePage() {
  const { user, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    templateId: 'modern-glassmorphism',
    theme: 'modern',
    colorScheme: 'blue',
    layout: 'single-column',
    showPhoto: false,
    additionalSections: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checkingExistingPortfolio, setCheckingExistingPortfolio] = useState(false);

  // Check if user has existing portfolio and redirect to dashboard
  useEffect(() => {
    if (user) {
      setCheckingExistingPortfolio(true);
      checkExistingPortfolio();
    }
  }, [user]);

  const checkExistingPortfolio = async () => {
    try {
      const response = await fetch('/api/user-portfolio', {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.portfolio) {
          // User has existing portfolio, redirect to dashboard
          router.push('/dashboard');
          return;
        }
      }
      // If no portfolio or error, continue with normal flow
    } catch (error) {
      console.error('Error checking existing portfolio:', error);
      // Continue with normal flow on error
    } finally {
      setCheckingExistingPortfolio(false);
    }
  };

  // Debug logging
  console.log('HomePage render - currentStep:', currentStep, 'resumeData:', !!resumeData, 'isLoading:', isLoading);

  const handleResumeUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        const resumeData = data.data;
        console.log('Setting resume data:', resumeData); // Debug log
        setResumeData(resumeData); // API returns { success: true, data: resumeData }
        console.log('Setting current step to 2'); // Debug log
        setCurrentStep(2);
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData.error);
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePersonalizationChange = useCallback((newPersonalization: PersonalizationData) => {
    setPersonalization(newPersonalization);
  }, []);

  const handlePreviewClick = useCallback(() => {
    if (resumeData) {
      setCurrentStep(3);
    }
  }, [resumeData]);

  const steps = [
    { number: 1, title: 'Upload Resume', icon: Upload, active: currentStep >= 1 },
    { number: 2, title: 'Personalize', icon: Palette, active: currentStep >= 2 },
    { number: 3, title: 'Preview & Share', icon: Eye, active: currentStep >= 3 },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-black text-white mb-6">
              Portfolio
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Generator
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              Transform your resume into a stunning, professional portfolio website in minutes. 
              <strong className="text-white"> One portfolio per user.</strong>
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Upload Resume</h3>
                <p className="text-gray-400 text-sm">PDF, DOCX, or TXT format</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <Palette className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Customize</h3>
                <p className="text-gray-400 text-sm">Choose themes and colors</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <Eye className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Share</h3>
                <p className="text-gray-400 text-sm">Get your custom URL</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full max-w-sm mx-auto flex items-center justify-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl"
              >
                <span>🚀</span>
                <span>Continue with Google</span>
              </button>
              <button
                onClick={signInWithGithub}
                className="w-full max-w-sm mx-auto flex items-center justify-center space-x-3 bg-gray-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 shadow-2xl"
              >
                <span>💻</span>
                <span>Continue with GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking for existing portfolio
  if (checkingExistingPortfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Checking your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              <button
                onClick={signOut}
                className="text-gray-300 hover:text-white transition-colors px-4 py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Create Your
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Professional Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Welcome, <strong className="text-white">{user.displayName || user.email}</strong>! 
            Let's create your professional portfolio.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${step.active 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white' 
                    : 'border-gray-600 text-gray-400'
                  }
                `}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <div className={`font-bold ${step.active ? 'text-white' : 'text-gray-400'}`}>
                    Step {step.number}
                  </div>
                  <div className={`text-sm ${step.active ? 'text-gray-300' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-8 ${step.active ? 'bg-purple-400' : 'bg-gray-600'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <FileUploadSection 
              onFileUpload={handleResumeUpload}
              isLoading={isLoading}
            />
          )}

          {currentStep === 2 && resumeData && (
            <PersonalizationForm 
              resumeData={resumeData}
              personalization={personalization}
              onPersonalizationChange={handlePersonalizationChange}
              onPreviewClick={handlePreviewClick}
            />
          )}

          {currentStep === 3 && resumeData && (
            <PortfolioPreview 
              resumeData={resumeData}
              personalization={personalization}
            />
          )}
        </div>
      </div>
    </div>
  );
} 