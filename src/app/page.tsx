'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploadSection } from '@/components/FileUploadSection';
import { PersonalizationForm } from '@/components/PersonalizationForm';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { ResumeData, PersonalizationData } from '@/types/resume';
import { Upload, Palette, Eye, Sparkles, Settings, FileText } from 'lucide-react';

export default function HomePage() {
  const { user, signInWithGoogle, signOut } = useAuth();
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

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">PortfolioHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={signInWithGoogle}
                className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 pt-16 pb-24">
          <div className="max-w-7xl mx-auto text-center">
            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
                Create Your
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  Dream Portfolio
                </span>
                <span className="block text-white">In Minutes</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Transform your resume into a stunning, professional portfolio website. 
                Choose from beautiful templates, customize to your style, and share with the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={signInWithGoogle}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    
                    <span>Get Started with Google</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">10+</div>
                  <div className="text-gray-400">Beautiful Templates</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">5 Min</div>
                  <div className="text-gray-400">Setup Time</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-2">100%</div>
                  <div className="text-gray-400">Free to Use</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative px-6 py-24 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Everything You Need to
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Stand Out
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Professional portfolio creation made simple with powerful features
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Resume Parsing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Upload your resume in any format (PDF, DOCX, TXT) and our AI instantly extracts all your information with perfect formatting.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Beautiful Templates</h3>
                <p className="text-gray-300 leading-relaxed">
                  Choose from professionally designed templates. From minimalist to bold, find the perfect style that represents you.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Custom Domain</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get your personalized URL like yourname.portfoliohub.com to share your professional presence with employers.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real-time Editing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Make changes and see them instantly. Edit your content, switch templates, and update your portfolio anytime.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Mobile Optimized</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your portfolio looks perfect on all devices. Mobile-first design ensures great experience everywhere.
                </p>
              </div>

              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">SEO Optimized</h3>
                <p className="text-gray-300 leading-relaxed">
                  Built-in SEO optimization helps recruiters and employers find you easily through search engines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                From resume to professional portfolio in just 3 simple steps
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-purple-500 to-transparent lg:hidden"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Upload Resume</h3>
                <p className="text-gray-300 leading-relaxed">
                  Simply upload your existing resume. Our smart parser extracts all your information automatically.
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-pink-500 to-transparent lg:hidden"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Customize Design</h3>
                <p className="text-gray-300 leading-relaxed">
                  Choose from beautiful templates and customize colors, themes, and layout to match your style.
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Share & Impress</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get your custom URL and share your professional portfolio with employers and clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-6 py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Build Your
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Professional Portfolio?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with stunning portfolios
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={signInWithGoogle}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>🚀</span>
                  <span>Get Started Free</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/40 border-t border-white/10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-6 lg:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">PortfolioHub</span>
              </div>
              
              <div className="flex items-center space-x-8 text-gray-400">
                <span> 2025 PortfolioHub. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>
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