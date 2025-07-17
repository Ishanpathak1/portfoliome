'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploadSection } from '@/components/FileUploadSection';
import { PersonalizationForm } from '@/components/PersonalizationForm';
import { PortfolioPreview } from '@/components/PortfolioPreview';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { ResumeData, PersonalizationData } from '@/types/resume';
import { Upload, Palette, Eye, Sparkles, Settings, FileText, Users, Star, ArrowRight } from 'lucide-react';
import { HomepageStructuredData } from '@/components/StructuredData';
import NavigationPadding from '@/components/NavigationPadding';

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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeTab, setActiveTab] = useState('resume');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedSlug, setGeneratedSlug] = useState('');

  const testimonials = [
    {
      name: "Avi Chauhan",
      text: "Too fast, getting portfolio and able to change it in seconds, feels like magic."
    },
    {
      name: "Dhyey Pariekh", 
      text: "Can't believe something like this exist, it does it too quickly, and gives so much control."
    },
    {
      name: "Badal Gupta",
      text: "Such a cool collection of templates, and option to change it anytime is a great feature to have."
    }
  ];

  const availableTemplates = [
    { 
      id: 'full-stack-developer', 
      name: 'Full Stack Developer', 
      preview: '/template-previews/fullstack.jpg',
      color: 'from-cyan-400 to-purple-600',
      description: 'Terminal-style developer portfolio'
    },
    { 
      id: 'creative-portfolio', 
      name: 'Creative Portfolio', 
      preview: '/template-previews/creative.jpg',
      color: 'from-pink-400 to-purple-600',
      description: 'Artistic and colorful design'
    },
    { 
      id: 'tech-innovator', 
      name: 'Tech Innovator', 
      preview: '/template-previews/tech.jpg',
      color: 'from-blue-400 to-cyan-600',
      description: 'Futuristic tech-focused layout'
    },
    { 
      id: 'minimalist-clean', 
      name: 'Minimalist Clean', 
      preview: '/template-previews/minimal.jpg',
      color: 'from-gray-400 to-gray-600',
      description: 'Clean and simple design'
    },
    { 
      id: 'dark-professional', 
      name: 'Dark Professional', 
      preview: '/template-previews/dark.jpg',
      color: 'from-slate-400 to-blue-600',
      description: 'Professional dark theme'
    },
    { 
      id: 'modern-glassmorphism', 
      name: 'Modern Glassmorphism', 
      preview: '/template-previews/glass.jpg',
      color: 'from-purple-400 to-pink-600',
      description: 'Glass-like modern effects'
    },
  ];

  // Rotate testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Check if user has existing portfolio and redirect to dashboard
  useEffect(() => {
    if (user) {
      // Developer bypass for testing new user experience
      const isDeveloper = user.email === 'ishan.pathak2711@gmail.com';
      const bypassPortfolioCheck = isDeveloper && new URLSearchParams(window.location.search).has('test-new-user');
      
      if (!bypassPortfolioCheck) {
        setCheckingExistingPortfolio(true);
        checkExistingPortfolio();
      }
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
          // Developer bypass for testing new user experience
          const isDeveloper = user?.email === 'ishan.pathak2711@gmail.com';
          const bypassPortfolioCheck = isDeveloper && new URLSearchParams(window.location.search).has('test-new-user');
          
          if (!bypassPortfolioCheck) {
            // User has existing portfolio, redirect to dashboard
            router.push('/dashboard');
            return;
          }
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

  // Generate slug from name
  const generateSlug = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '');
    const parts = cleanName.split(' ').filter(part => part.length > 0);
    const firstName = parts[0] || 'user';
    const lastName = parts[1] || 'portfolio';
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${firstName}-${lastName}-${randomSuffix}`;
  };

  const handleResumeUpload = useCallback(async (file: File) => {
    // If resumeData already exists, skip upload and go to step 2
    if (resumeData) {
      setCurrentStep(2);
      return;
    }

    setIsLoading(true);
    setUploadedFile(file);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const resumeData = data.data;
        setResumeData(resumeData);
        
        // Generate slug from parsed name
        const name = resumeData.contact?.name || 'User Portfolio';
        const slug = generateSlug(name);
        setGeneratedSlug(slug);
        
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
  }, [resumeData]);

  const handleContinue = useCallback(async () => {
    if (!user) {
      // Sign in first
      await signInWithGoogle();
      return;
    }
    
    // Move to step 2 after sign in
    setCurrentStep(2);
  }, [user, signInWithGoogle]);

  // Auto-continue to step 2 after sign-in if resume is already uploaded
  useEffect(() => {
    if (user && resumeData && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [user, resumeData, currentStep]);

  const handlePersonalizationChange = useCallback((newPersonalization: PersonalizationData) => {
    setPersonalization(newPersonalization);
  }, []);

  const handlePreviewClick = useCallback(() => {
    if (resumeData) {
      setCurrentStep(3);
    }
  }, [resumeData]);

  const handleGetStarted = () => {
    if (!user) {
      signInWithGoogle();
    } else {
      // If user is logged in, show upload section
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show loading while checking for existing portfolio
  if (checkingExistingPortfolio) {
    return (
      <NavigationPadding>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-center">Checking your portfolio...</p>
          </div>
        </div>
      </NavigationPadding>
    );
  }

  // Show step-by-step flow for authenticated users who are creating portfolio
  if (user && (currentStep > 1 || resumeData)) {
    return (
      <NavigationPadding>
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

            {/* Content */}
            <div className="max-w-4xl mx-auto">
              {currentStep === 1 && (
                <div id="upload-section">
                  <FileUploadSection 
                    onFileUpload={handleResumeUpload}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {currentStep === 2 && resumeData && (
                <PersonalizationForm 
                  resumeData={resumeData}
                  personalization={personalization}
                  onPersonalizationChange={handlePersonalizationChange}
                  onResumeDataChange={setResumeData}
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
          <HomepageStructuredData />
                </div>
      </NavigationPadding>
    );
  }

  // Main landing page (matches tiiny.host design)
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PortfolioHub</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">Blog</a>
              <a href="/features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="/templates" className="text-gray-600 hover:text-gray-900 font-medium">Templates</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">Contact</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <a
                    href="/dashboard"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={signOut}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={signInWithGoogle}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 font-medium"
                  >
                    Log in
                  </button>
                  <button
                    onClick={signInWithGoogle}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <span>Sign up free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="space-y-6">
            {/* Main Heading */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Convert your resume in Portfolio in one click.
              </h1>
              <p className="text-lg text-gray-600">
                Upload, Choose, Share
              </p>
            </div>

            {/* URL Preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">https://take-my.info/</span>
                <input 
                  type="text" 
                  value={generatedSlug || 'your-name'}
                  placeholder="your-name"
                  className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
            </div>

            {/* Upload Section Only */}
            <div 
              id="upload-section-mobile" 
              className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50/50 transition-colors hover:border-purple-400 hover:bg-purple-100/50"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-purple-500', 'bg-purple-100');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-purple-500', 'bg-purple-100');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-purple-500', 'bg-purple-100');
                const file = e.dataTransfer.files[0];
                if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
                  handleResumeUpload(file);
                }
              }}
            >
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">Drag & drop resume or</p>
                  <p className="text-gray-500 text-xs">single file here</p>
                </div>
                
                <input
                  type="file"
                  id="file-upload-mobile"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleResumeUpload(file);
                    }
                  }}
                  className="hidden"
                />
                
                {!resumeData ? (
                  <button
                    onClick={() => document.getElementById('file-upload-mobile')?.click()}
                    disabled={isLoading}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 text-sm"
                  >
                    {isLoading ? 'Uploading...' : 'Upload file'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        ✅ <span className="font-medium">{uploadedFile?.name}</span> uploaded successfully!
                      </p>
                    </div>
                    <button
                      onClick={handleContinue}
                      disabled={isLoading}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 text-sm"
                    >
                      {!user ? 'Continue (Sign in required)' : 'Continue'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* File Format Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3 h-3" />
                  <span>PDF, DOCX, TXT</span>
                </div>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center pt-8">
              <p className="text-sm text-gray-500">Used by students, job professionals & employees</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[calc(100vh-200px)]">
            
            {/* LEFT Column - Testimonial */}
            <div className="lg:col-span-3 space-y-6" style={{paddingTop: '400px'}}>
              <div className="space-y-4">
                <p className="text-gray-600 italic text-lg leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="text-gray-500 text-sm">- {testimonials[currentTestimonial].name}</p>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span>more than 30 portfolios hosted already</span>
                </div>
              </div>
            </div>

            {/* CENTER Column - Main Content */}
            <div className="lg:col-span-6 space-y-8">
              {/* Main Heading */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Convert your resume in Portfolio in one click.
                </h1>
                <p className="text-xl text-gray-600">
                  Upload, Choose, Share
                </p>
              </div>

              {/* URL Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">https://take-my.info/</span>
                  <input 
                    type="text" 
                    value={generatedSlug || 'your-name'}
                    placeholder="your-name"
                    className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button 
                    onClick={() => setActiveTab('resume')}
                    className={`border-b-2 pb-2 px-1 font-medium ${activeTab === 'resume' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Resume
                  </button>
                  <button 
                    onClick={() => setActiveTab('templates')}
                    className={`border-b-2 pb-2 px-1 font-medium ${activeTab === 'templates' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Templates
                  </button>
                </nav>
              </div>

                           {/* Content based on active tab */}
               {activeTab === 'resume' ? (
                 /* Upload Section */
                 <div 
                   id="upload-section" 
                   className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center bg-purple-50/50 transition-colors hover:border-purple-400 hover:bg-purple-100/50"
                   onDragOver={(e) => {
                     e.preventDefault();
                     e.currentTarget.classList.add('border-purple-500', 'bg-purple-100');
                   }}
                   onDragLeave={(e) => {
                     e.preventDefault();
                     e.currentTarget.classList.remove('border-purple-500', 'bg-purple-100');
                   }}
                   onDrop={(e) => {
                     e.preventDefault();
                     e.currentTarget.classList.remove('border-purple-500', 'bg-purple-100');
                     const file = e.dataTransfer.files[0];
                     if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
                       handleResumeUpload(file);
                     }
                   }}
                 >
                   <div className="space-y-4">
                     <div className="flex justify-center space-x-4">
                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                         <Upload className="w-6 h-6 text-gray-500" />
                       </div>
                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                         <FileText className="w-6 h-6 text-gray-500" />
                       </div>
                     </div>
                     <div className="space-y-2">
                       <p className="text-gray-600">Drag & drop resume or</p>
                       <p className="text-gray-500 text-sm">single file here</p>
                     </div>
                     
                     <input
                       type="file"
                       id="file-upload"
                       accept=".pdf,.docx,.txt"
                       onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           handleResumeUpload(file);
                         }
                       }}
                       className="hidden"
                     />
                     
                     {!resumeData ? (
                       <button
                         onClick={() => document.getElementById('file-upload')?.click()}
                         disabled={isLoading}
                         className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                       >
                         {isLoading ? 'Uploading...' : 'Upload file'}
                       </button>
                     ) : (
                       <div className="space-y-4">
                         <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                           <p className="text-green-700 text-sm">
                             ✅ <span className="font-medium">{uploadedFile?.name}</span> uploaded successfully!
                           </p>
                         </div>
                         <button
                           onClick={handleContinue}
                           disabled={isLoading}
                           className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                         >
                           {!user ? 'Continue (Sign in required)' : 'Continue'}
                         </button>
                       </div>
                     )}
                   </div>
                 </div>
               ) : (
                 /* Templates Section */
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {availableTemplates.map((template) => (
                     <div 
                       key={template.id}
                       className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer"
                       onClick={() => {
                         setPersonalization(prev => ({ ...prev, templateId: template.id }));
                         setActiveTab('resume');
                       }}
                     >
                       <div className="w-full h-32 rounded-lg mb-3 relative overflow-hidden">
                         {/* Template Preview */}
                         {template.id === 'full-stack-developer' && (
                           <div className="w-full h-full bg-black text-green-400 p-2 text-xs font-mono">
                             <div className="text-cyan-400">dev@portfolio:~$</div>
                             <div className="text-green-400">whoami</div>
                             <div className="text-white">Full Stack Developer</div>
                             <div className="text-cyan-400">ls skills/</div>
                             <div className="text-green-400">React TypeScript Node.js</div>
                           </div>
                         )}
                         
                         {template.id === 'creative-portfolio' && (
                           <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 p-2 relative">
                             <div className="absolute top-2 right-2 w-4 h-4 bg-red-400 rounded-full"></div>
                             <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                             <div className="text-center mt-4">
                               <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-2"></div>
                               <div className="text-xs font-bold text-purple-800">Creative</div>
                               <div className="text-xs text-purple-600">Portfolio</div>
                             </div>
                           </div>
                         )}
                         
                         {template.id === 'tech-innovator' && (
                           <div className="w-full h-full bg-black text-blue-400 p-2 relative">
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"></div>
                             <div className="relative z-10">
                               <div className="text-xs text-cyan-400">◆ TECH INNOVATOR</div>
                               <div className="text-xs text-blue-300 mt-1">▲ Neural Networks</div>
                               <div className="text-xs text-cyan-300">● Machine Learning</div>
                               <div className="text-xs text-blue-200">◇ AI Development</div>
                             </div>
                           </div>
                         )}
                         
                         {template.id === 'minimalist-clean' && (
                           <div className="w-full h-full bg-white p-3 border border-gray-200">
                             <div className="text-center">
                               <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto mb-2"></div>
                               <div className="text-xs font-semibold text-gray-800">John Doe</div>
                               <div className="text-xs text-gray-600">Developer</div>
                               <div className="mt-2 space-y-1">
                                 <div className="w-full h-1 bg-gray-200 rounded"></div>
                                 <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
                                 <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
                               </div>
                             </div>
                           </div>
                         )}
                         
                         {template.id === 'dark-professional' && (
                           <div className="w-full h-full bg-gray-900 text-white p-2">
                             <div className="text-center">
                               <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-2"></div>
                               <div className="text-xs font-semibold">Professional</div>
                               <div className="text-xs text-gray-400">Executive</div>
                               <div className="mt-2 space-y-1">
                                 <div className="w-full h-1 bg-gray-700 rounded"></div>
                                 <div className="w-4/5 h-1 bg-gray-700 rounded"></div>
                                 <div className="w-3/5 h-1 bg-blue-500 rounded"></div>
                               </div>
                             </div>
                           </div>
                         )}
                         
                         {template.id === 'modern-glassmorphism' && (
                           <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 p-2 relative">
                             <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg"></div>
                             <div className="relative z-10 text-center">
                               <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-2"></div>
                               <div className="text-xs font-semibold text-white">Modern</div>
                               <div className="text-xs text-purple-200">Glassmorphism</div>
                               <div className="mt-2 space-y-1">
                                 <div className="w-full h-1 bg-white/20 rounded"></div>
                                 <div className="w-3/4 h-1 bg-white/20 rounded"></div>
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                       <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                       <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                     </div>
                   ))}
                 </div>
               )}

            {/* File Format Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF, DOCX, TXT</span>
                </div>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
              <div className="text-xs text-gray-400 max-w-md mx-auto">
                <p>PDF files: For text selection (not scanned images)</p>
                <p>DOCX files: Use standard formatting with clear section headers</p>
                <p>All files: Include sections like "Experience", "Education", "Skills"</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center space-y-4 pt-24 pb-12">
              <p className="text-lg text-gray-500 tracking-wide font-medium">Used by students, job professionals & employees</p>
            </div>
          </div>

          {/* RIGHT Column - Try for free with arrow */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end" style={{paddingTop: '330px', paddingRight: '0px'}}>
            <div className="relative" style={{marginRight: '-190px'}}>
              <button
                onClick={handleGetStarted}
                className="block"
              >
                <img 
                  src="/tff1.png" 
                  alt="Try for free" 
                  className="max-w-none w-[600px] hover:opacity-90 transition-opacity"
                />
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>
      <HomepageStructuredData />
    </div>
  );
} 