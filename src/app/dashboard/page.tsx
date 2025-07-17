'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { AuthWrapper } from '@/components/FirebaseAuthWrapper';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { ResumeData, PersonalizationData, Experience, Education, Project, SkillCategory, Contact, SectionHeadings, TemplateText } from '@/types/resume';
import { ToastContainer, useToast } from '@/components/Toast';
import { SectionManager } from '@/components/SectionManager';
import { SectionHeadingEditor } from '@/components/SectionHeadingEditor';
import { TemplateTextEditor } from '@/components/TemplateTextEditor';
import { getPortfolioUrl, getBaseUrl, validateAndFixUrl } from '@/lib/utils';
import { getAllSectionHeadings } from '@/lib/section-headings';
import { getAllTemplateText } from '@/lib/template-text';
import { PortfolioRenderer } from '@/components/PortfolioRenderer';
import QRCode from 'qrcode';
import { 
  Settings, 
  Eye, 
  Upload, 
  Link, 
  Palette, 
  User, 
  FileText, 
  BarChart3,
  ExternalLink,
  Save,
  RefreshCw,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Github,
  Linkedin,
  Globe,
  Building,
  X,
  Layers,
  QrCode,
  Smartphone,
  Type
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <DashboardContent />
    </AuthWrapper>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuth();
  const [portfolio, setPortfolio] = useState<DatabasePortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(false);

  // Form states
  const [editedSlug, setEditedSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [editedPersonalization, setEditedPersonalization] = useState<PersonalizationData | null>(null);
  const [editedResumeData, setEditedResumeData] = useState<ResumeData | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Content editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showHeadingEditor, setShowHeadingEditor] = useState(false);
  const [showTemplateTextEditor, setShowTemplateTextEditor] = useState(false);

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Helper function to ensure resume data has all required arrays
  const ensureResumeDataStructure = (resumeData: any): ResumeData => {
    return {
      ...resumeData,
      experience: resumeData?.experience || [],
      education: resumeData?.education || [],
      projects: resumeData?.projects || [],
      skills: resumeData?.skills || [],
      summary: resumeData?.summary || '',
      contact: {
        name: resumeData?.contact?.name || '',
        email: resumeData?.contact?.email || '',
        phone: resumeData?.contact?.phone || '',
        location: resumeData?.contact?.location || '',
        linkedin: resumeData?.contact?.linkedin || '',
        website: resumeData?.contact?.website || ''
      }
    };
  };

  useEffect(() => {
    if (user) {
      loadUserPortfolio();
    }
  }, [user]);

  // Generate QR code when portfolio changes
  useEffect(() => {
    if (portfolio?.slug) {
      generateQRCode();
    }
  }, [portfolio?.slug]);

  const generateQRCode = async () => {
    try {
      if (portfolio?.slug) {
        const url = getPortfolioUrl(portfolio.slug);
        
        // Get theme colors based on selected color scheme
        const getThemeQRColors = (colorScheme: string) => {
          const themeColors: Record<string, { dark: string; light: string }> = {
            blue: { dark: '#3B82F6', light: '#EFF6FF' },
            green: { dark: '#10B981', light: '#ECFDF5' },
            purple: { dark: '#8B5CF6', light: '#F3E8FF' },
            orange: { dark: '#F59E0B', light: '#FFF7ED' }
          };
          return themeColors[colorScheme] || themeColors.blue;
        };

        const colorScheme = portfolio.personalization?.colorScheme || 'blue';
        const qrColors = getThemeQRColors(colorScheme);
        
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: qrColors.dark,
            light: qrColors.light,
          },
        });
        setQrCodeUrl(qrDataUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const loadUserPortfolio = async () => {
    try {
      const response = await fetch('/api/user-portfolio', {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio);
        setEditedSlug(data.portfolio?.slug || '');
        setEditedPersonalization(data.portfolio?.personalization || null);
        setEditedResumeData(data.portfolio?.resumeData ? ensureResumeDataStructure(data.portfolio.resumeData) : null);
      } else if (response.status === 404) {
        // User doesn't have a portfolio yet
        setPortfolio(null);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug === portfolio?.slug) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    try {
      const response = await fetch(`/api/check-slug?slug=${encodeURIComponent(slug)}`, {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });
      const data = await response.json();
      setSlugAvailable(data.available);
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugAvailable(null);
    } finally {
      setCheckingSlug(false);
    }
  };

  const saveChanges = async () => {
    if (!portfolio || !editedPersonalization) return;

    setSaving(true);
    try {
      // Create a timeout promise to handle long requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 12000); // 12 second timeout
      });

      const fetchPromise = fetch('/api/update-portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          slug: editedSlug !== portfolio.slug ? editedSlug : undefined,
          personalization: editedPersonalization,
          resumeData: editedResumeData
        })
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio);
        setEditedSlug(data.portfolio.slug); // Update slug if changed
        setEditedResumeData(ensureResumeDataStructure(data.portfolio.resumeData));
        setEditedPersonalization(data.portfolio.personalization); // Update personalization state
        setPreviewKey(prev => prev + 1); // Force iframe refresh
        showSuccess('Portfolio updated successfully!');
        setEditingSection(null);
        setEditingIndex(null);
      } else {
        const error = await response.json();
        if (error.field === 'slug') {
          showError(`URL Error: ${error.error}`);
          setSlugAvailable(false);
        } else {
          showError(`Error: ${error.error || error.message}`);
        }
      }
    } catch (error: any) {
      console.error('Error saving changes:', error);
      if (error.message === 'Request timed out') {
        showError('Save operation timed out. Please check your internet connection and try again.');
      } else {
        showError('Failed to save changes. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const copyPortfolioUrl = async () => {
    if (!portfolio) return;
    
    const url = getPortfolioUrl(portfolio.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Save personalization changes immediately
  const savePersonalizationChanges = async (updatedPersonalization: PersonalizationData) => {
    if (!portfolio || !user) return;

    setSaving(true);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 12000);
      });

      const fetchPromise = fetch('/api/update-portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          personalization: updatedPersonalization
        })
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio);
        setEditedPersonalization(data.portfolio.personalization);
        setPreviewKey(prev => prev + 1);
        showSuccess('Changes saved successfully!');
      } else {
        const error = await response.json();
        showError(`Error: ${error.error || error.message}`);
      }
    } catch (error: any) {
      console.error('Error saving personalization:', error);
      showError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionHeadingsUpdate = async (headings: SectionHeadings) => {
    if (!editedPersonalization) return;
    
    const updatedPersonalization = {
      ...editedPersonalization,
      sectionHeadings: headings
    };
    
    setEditedPersonalization(updatedPersonalization);
    await savePersonalizationChanges(updatedPersonalization);
  };

  const handleTemplateTextUpdate = async (templateText: TemplateText) => {
    if (!editedPersonalization) return;
    
    const updatedPersonalization = {
      ...editedPersonalization,
      templateText: templateText
    };
    
    setEditedPersonalization(updatedPersonalization);
    await savePersonalizationChanges(updatedPersonalization);
  };

  // Content editing functions
  const addExperience = () => {
    if (!editedResumeData) return;
    const newExperience: Experience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: []
    };
    setEditedResumeData({
      ...editedResumeData,
      experience: [...editedResumeData.experience, newExperience]
    });
    setEditingSection('experience');
    setEditingIndex(editedResumeData.experience.length);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    if (!editedResumeData) return;
    const updated = [...editedResumeData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setEditedResumeData({ ...editedResumeData, experience: updated });
  };

  const deleteExperience = (index: number) => {
    if (!editedResumeData) return;
    const updated = editedResumeData.experience.filter((_, i) => i !== index);
    setEditedResumeData({ ...editedResumeData, experience: updated });
  };

  const addEducation = () => {
    if (!editedResumeData) return;
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    };
    setEditedResumeData({
      ...editedResumeData,
      education: [...editedResumeData.education, newEducation]
    });
    setEditingSection('education');
    setEditingIndex(editedResumeData.education.length);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    if (!editedResumeData) return;
    const updated = [...editedResumeData.education];
    updated[index] = { ...updated[index], [field]: value };
    setEditedResumeData({ ...editedResumeData, education: updated });
  };

  const deleteEducation = (index: number) => {
    if (!editedResumeData) return;
    const updated = editedResumeData.education.filter((_, i) => i !== index);
    setEditedResumeData({ ...editedResumeData, education: updated });
  };

  const addProject = () => {
    if (!editedResumeData) return;
    const newProject: Project = {
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: ''
    };
    setEditedResumeData({
      ...editedResumeData,
      projects: [...editedResumeData.projects, newProject]
    });
    setEditingSection('projects');
    setEditingIndex(editedResumeData.projects.length);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    if (!editedResumeData) return;
    const updated = [...editedResumeData.projects];
    
    // Validate and fix URLs for link and github fields
    if (field === 'link' || field === 'github') {
      value = validateAndFixUrl(value);
    }
    
    updated[index] = { ...updated[index], [field]: value };
    setEditedResumeData({ ...editedResumeData, projects: updated });
  };

  const deleteProject = (index: number) => {
    if (!editedResumeData) return;
    const updated = editedResumeData.projects.filter((_, i) => i !== index);
    setEditedResumeData({ ...editedResumeData, projects: updated });
  };

  const addSkillCategory = () => {
    if (!editedResumeData) return;
    const newCategory: SkillCategory = {
      category: '',
      items: []
    };
    setEditedResumeData({
      ...editedResumeData,
      skills: [...editedResumeData.skills, newCategory]
    });
    setEditingSection('skills');
    setEditingIndex(editedResumeData.skills.length);
  };

  const updateSkillCategory = (index: number, field: keyof SkillCategory, value: any) => {
    if (!editedResumeData) return;
    const updated = [...editedResumeData.skills];
    updated[index] = { ...updated[index], [field]: value };
    setEditedResumeData({ ...editedResumeData, skills: updated });
  };

  const deleteSkillCategory = (index: number) => {
    if (!editedResumeData) return;
    const updated = editedResumeData.skills.filter((_, i) => i !== index);
    setEditedResumeData({ ...editedResumeData, skills: updated });
  };

  const updateContact = (field: keyof Contact, value: string) => {
    if (!editedResumeData) return;
    
    // Validate and fix URLs for website and linkedin fields
    if (field === 'website' || field === 'linkedin') {
      value = validateAndFixUrl(value);
    }
    
    setEditedResumeData({
      ...editedResumeData,
      contact: { ...editedResumeData.contact, [field]: value }
    });
  };

  const tabs = [
    { id: 'overview', title: 'Overview', icon: BarChart3 },
    { id: 'design', title: 'Design & Theme', icon: Palette },
    { id: 'content', title: 'Content & Info', icon: User },
    { id: 'custom', title: 'Custom Sections', icon: Layers },
    { id: 'settings', title: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">No Portfolio Found</h1>
            <p className="text-gray-300 mb-8">
              You haven't created a portfolio yet. Create your first portfolio to get started!
            </p>
            <a 
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300"
            >
              <Upload className="w-5 h-5" />
              <span>Create Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-300 text-sm">Welcome back, {user?.displayName || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={`/${portfolio.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
                <span>View Live</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={signOut}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Portfolio Stats */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Portfolio Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{portfolio.views}</div>
                      <div className="text-gray-300 text-sm">Total Views</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <Link className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">1</div>
                      <div className="text-gray-300 text-sm">Portfolio</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <Palette className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white capitalize">{portfolio.templateId.replace('-', ' ')}</div>
                      <div className="text-gray-300 text-sm">Current Template</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('design')}
                      className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all duration-300"
                    >
                      <Palette className="w-6 h-6 text-purple-400" />
                      <div className="text-left">
                        <div className="text-white font-medium">Change Theme</div>
                        <div className="text-gray-300 text-sm">Switch templates & colors</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all duration-300"
                    >
                      <Edit className="w-6 h-6 text-green-400" />
                      <div className="text-left">
                        <div className="text-white font-medium">Edit Content</div>
                        <div className="text-gray-300 text-sm">Update your information</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Portfolio URL */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Your Portfolio URL</h3>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3">
                      <code className="text-purple-300 text-sm break-all">
                        {getPortfolioUrl(portfolio.slug)}
                      </code>
                    </div>
                    <button
                      onClick={copyPortfolioUrl}
                      className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  
                  {/* QR Code Section */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <QrCode className="w-5 h-5 text-purple-400" />
                      <h4 className="text-md font-semibold text-white">QR Code</h4>
                      <div className="flex items-center space-x-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                        <Smartphone className="w-3 h-3" />
                        <span>Scan to open on mobile</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="bg-white p-4 rounded-xl shadow-lg">
                        {qrCodeUrl ? (
                          <img 
                            src={qrCodeUrl} 
                            alt="QR Code for Portfolio" 
                            className="w-32 h-32 block"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-gray-300 text-sm">
                          Scan this QR code with your phone camera to quickly access your portfolio on mobile devices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && editedPersonalization && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Design & Theme</h2>
                
                {/* Template Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Choose Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { id: 'modern-glassmorphism', name: 'Modern Glassmorphism', desc: 'Sleek with glass effects' },
                      { id: 'minimalist-clean', name: 'Minimalist Clean', desc: 'Clean sidebar navigation' },
                      { id: 'creative-gradient', name: 'Creative Gradient', desc: 'Vibrant and artistic' },
                      { id: 'developer-terminal', name: 'Developer Terminal', desc: 'Code-inspired terminal UI' },
                      { id: 'dark-professional', name: 'Dark Professional', desc: 'Elegant dark theme' },
                      { id: 'corporate-executive', name: 'Corporate Executive', desc: 'Premium executive portfolio' },
                      { id: 'creative-portfolio', name: 'Creative Portfolio', desc: 'Visual-first creative showcase' },
                      { id: 'tech-innovator', name: 'Tech Innovator', desc: 'Futuristic developer showcase' },
                      { id: 'full-stack-developer', name: 'Full Stack Developer', desc: 'Modern web development focus' },
                                              { id: 'open-source-contributor', name: 'Open Source Contributor', desc: 'GitHub-focused community profile' },
                    ].map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setEditedPersonalization({ ...editedPersonalization, templateId: template.id })}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          editedPersonalization.templateId === template.id
                            ? 'border-purple-400 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-white font-medium">{template.name}</div>
                        <div className="text-gray-300 text-sm">{template.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Color Scheme</h3>
                  <div className="flex space-x-3">
                    {['blue', 'green', 'purple', 'orange', 'red'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditedPersonalization({ ...editedPersonalization, colorScheme: color as any })}
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                          editedPersonalization.colorScheme === color ? 'border-white scale-110' : 'border-transparent'
                        } bg-${color}-500`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}

            {activeTab === 'content' && editedResumeData && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <User className="w-6 h-6" />
                      <span>Contact Information</span>
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editedResumeData.contact.name}
                        onChange={(e) => updateContact('name', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={editedResumeData.contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editedResumeData.contact.phone || ''}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Location</label>
                      <input
                        type="text"
                        value={editedResumeData.contact.location || ''}
                        onChange={(e) => updateContact('location', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={editedResumeData.contact.linkedin || ''}
                        onChange={(e) => updateContact('linkedin', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Website/Portfolio</label>
                      <input
                        type="url"
                        value={editedResumeData.contact.website || ''}
                        onChange={(e) => updateContact('website', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-300 text-sm mb-2">Professional Summary</label>
                    <textarea
                      value={editedResumeData.summary}
                      onChange={(e) => setEditedResumeData({ ...editedResumeData, summary: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Write a brief professional summary..."
                    />
                  </div>

                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors mt-6"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Contact Info'}</span>
                  </button>
                </div>

                {/* Work Experience */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <Briefcase className="w-6 h-6" />
                      <span>Work Experience</span>
                    </h2>
                    <button
                      onClick={addExperience}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.experience.map((exp, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        {editingSection === 'experience' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Company</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Company name"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Position</label>
                                <input
                                  type="text"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Job title"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Location</label>
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="City, State/Country"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                  className="rounded"
                                />
                                <label className="text-gray-300 text-sm">Current position</label>
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="January 2023"
                                />
                              </div>
                              {!exp.current && (
                                <div>
                                  <label className="block text-gray-300 text-sm mb-2">End Date</label>
                                  <input
                                    type="text"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="December 2023"
                                  />
                                </div>
                              )}
                            </div>
                                                          <div>
                                <label className="block text-gray-300 text-sm mb-2">Responsibilities (one per line)</label>
                                <textarea
                                  value={(exp.responsibilities || []).join('\n')}
                                  onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n').filter(r => r.trim()))}
                                  rows={4}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Improved system performance by 40%"
                                />
                              </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection(null);
                                  setEditingIndex(null);
                                }}
                                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium">{exp.position || 'New Position'}</h4>
                              <p className="text-gray-300">{exp.company} {exp.location && `• ${exp.location}`}</p>
                              <p className="text-gray-400 text-sm">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                              {exp.responsibilities && exp.responsibilities.length > 0 && (
                                <ul className="text-gray-300 text-sm mt-2 space-y-1">
                                  {exp.responsibilities.slice(0, 2).map((resp, i) => (
                                    <li key={i}>• {resp}</li>
                                  ))}
                                  {exp.responsibilities.length > 2 && (
                                    <li className="text-gray-400">... and {exp.responsibilities.length - 2} more</li>
                                  )}
                                </ul>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection('experience');
                                  setEditingIndex(index);
                                }}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteExperience(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <FolderOpen className="w-6 h-6" />
                      <span>Projects</span>
                    </h2>
                    <button
                      onClick={addProject}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.projects.map((project, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        {editingSection === 'projects' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Project Name</label>
                                <input
                                  type="text"
                                  value={project.name}
                                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Project name"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Technologies (comma separated)</label>
                                <input
                                  type="text"
                                  value={(project.technologies || []).join(', ')}
                                  onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Live Demo URL</label>
                                <input
                                  type="url"
                                  value={project.link || ''}
                                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="https://project-demo.com"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">GitHub URL</label>
                                <input
                                  type="url"
                                  value={project.github || ''}
                                  onChange={(e) => updateProject(index, 'github', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="https://github.com/username/repo"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">Description</label>
                              <textarea
                                value={project.description}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Describe your project..."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection(null);
                                  setEditingIndex(null);
                                }}
                                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium">{project.name || 'New Project'}</h4>
                              <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.technologies.map((tech, i) => (
                                    <span key={i} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex space-x-4 mt-2">
                                {project.link && (
                                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
                                    <Globe className="w-3 h-3" />
                                    <span>Demo</span>
                                  </a>
                                )}
                                {project.github && (
                                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 text-sm flex items-center space-x-1">
                                    <Github className="w-3 h-3" />
                                    <span>Code</span>
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection('projects');
                                  setEditingIndex(index);
                                }}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProject(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <GraduationCap className="w-6 h-6" />
                      <span>Education</span>
                    </h2>
                    <button
                      onClick={addEducation}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.education.map((edu, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        {editingSection === 'education' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Institution</label>
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="University/School name"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Degree</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Bachelor's, Master's, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Field of Study</label>
                                <input
                                  type="text"
                                  value={edu.field}
                                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="Computer Science, Business, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">Graduation Date</label>
                                <input
                                  type="text"
                                  value={edu.graduationDate}
                                  onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="May 2023"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-300 text-sm mb-2">GPA (optional)</label>
                                <input
                                  type="text"
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="3.8/4.0"
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection(null);
                                  setEditingIndex(null);
                                }}
                                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium">{edu.degree || 'New Degree'} {edu.field && `in ${edu.field}`}</h4>
                              <p className="text-gray-300">{edu.institution}</p>
                              <p className="text-gray-400 text-sm">{edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection('education');
                                  setEditingIndex(index);
                                }}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteEducation(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <Code className="w-6 h-6" />
                      <span>Skills</span>
                    </h2>
                    <button
                      onClick={addSkillCategory}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.skills.map((skillGroup, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        {editingSection === 'skills' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">Category Name</label>
                              <input
                                type="text"
                                value={skillGroup.category}
                                onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Programming Languages, Frameworks, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">Skills (comma separated)</label>
                              <textarea
                                value={(skillGroup.items || []).join(', ')}
                                onChange={(e) => updateSkillCategory(index, 'items', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                rows={3}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="JavaScript, React, Node.js, Python, etc."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection(null);
                                  setEditingIndex(null);
                                }}
                                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-medium">{skillGroup.category || 'New Skill Category'}</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(skillGroup.items || []).map((skill, i) => (
                                  <span key={i} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection('skills');
                                  setEditingIndex(index);
                                }}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteSkillCategory(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'custom' && editedResumeData && (
              <div className="space-y-6">
                {/* Custom Sections Header */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                        <Layers className="w-6 h-6 text-purple-400" />
                        <span>Custom Sections</span>
                      </h2>
                      <p className="text-gray-300 mt-1">Add and organize custom sections for your portfolio</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {editedResumeData.customSections?.length || 0}
                      </div>
                      <div className="text-gray-300 text-sm">Custom Sections</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {editedPersonalization?.sectionOrder?.length || 0}
                      </div>
                      <div className="text-gray-300 text-sm">Total Sections</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {editedPersonalization?.hiddenSections?.length || 0}
                      </div>
                      <div className="text-gray-300 text-sm">Hidden Sections</div>
                    </div>
                  </div>
                </div>

                {/* Section Headings Customization */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                        <Edit className="w-5 h-5 text-purple-400" />
                        <span>Section Headings</span>
                      </h3>
                      <p className="text-gray-300 mt-1">
                        {editedPersonalization?.templateId === 'developer-terminal' 
                          ? 'Section headings are not customizable for this template'
                          : 'Customize section headings to match your profession'
                        }
                      </p>
                    </div>
                    {editedPersonalization?.templateId === 'developer-terminal' ? (
                      <span className="text-gray-400 px-4 py-2 rounded-lg bg-gray-500/20">
                        Not customizable
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowHeadingEditor(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Headings</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {Object.entries(getAllSectionHeadings(editedPersonalization?.sectionHeadings)).map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-3">
                        <div className="text-sm text-gray-400 capitalize">{key}</div>
                        <div className="text-white font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template Text Customization */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                        <Type className="w-5 h-5 text-purple-400" />
                        <span>Template Text</span>
                      </h3>
                      <p className="text-gray-300 mt-1">
                        {editedPersonalization?.templateId === 'developer-terminal' 
                          ? 'Template text is not customizable for this template'
                          : 'Customize template-specific text content'
                        }
                      </p>
                    </div>
                    {editedPersonalization?.templateId === 'developer-terminal' ? (
                      <span className="text-gray-400 px-4 py-2 rounded-lg bg-gray-500/20">
                        Not customizable
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowTemplateTextEditor(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        <Type className="w-4 h-4" />
                        <span>Edit Text</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {Object.entries(getAllTemplateText(editedPersonalization?.templateText, editedPersonalization?.templateId || 'corporate-executive')).map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-3">
                        <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-white font-medium text-sm truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Manager */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Section Manager</h3>
                  
                  <SectionManager
                    resumeData={editedResumeData}
                    onUpdateResumeData={(data: ResumeData) => setEditedResumeData(data)}
                    sectionOrder={editedPersonalization?.sectionOrder || []}
                    hiddenSections={editedPersonalization?.hiddenSections || []}
                    onSectionOrderChange={(order) => {
                      if (editedPersonalization) {
                        setEditedPersonalization({
                          ...editedPersonalization,
                          sectionOrder: order
                        });
                      }
                    }}
                    onHiddenSectionsChange={(hidden) => {
                      if (editedPersonalization) {
                        setEditedPersonalization({
                          ...editedPersonalization,
                          hiddenSections: hidden
                        });
                      }
                    }}
                  />
                </div>

                {/* Live Preview */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <a
                        href={`/${portfolio.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-300 hover:text-white text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in New Tab</span>
                      </a>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden" style={{ height: '600px' }}>
                    <div className="w-full h-full overflow-auto">
                      <PortfolioRenderer 
                        portfolio={{
                          ...portfolio,
                          resumeData: editedResumeData || portfolio.resumeData,
                          personalization: editedPersonalization || portfolio.personalization
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Portfolio Settings</h2>
                
                {/* Slug Editor */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Custom URL</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Portfolio URL Slug</label>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex">
                            <div className="bg-white/5 border border-white/20 border-r-0 rounded-l-lg px-3 py-2 text-gray-300 text-sm">
                              {getBaseUrl()}/
                            </div>
                            <input
                              type="text"
                              value={editedSlug}
                              onChange={(e) => {
                                const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                                setEditedSlug(newSlug);
                                checkSlugAvailability(newSlug);
                              }}
                              className="flex-1 bg-white/5 border border-white/20 rounded-r-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="your-custom-slug"
                            />
                          </div>
                        </div>
                        {checkingSlug && <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />}
                        {slugAvailable === true && editedSlug !== portfolio.slug && <Check className="w-5 h-5 text-green-400" />}
                        {slugAvailable === false && <span className="text-red-400 text-sm">Taken</span>}
                      </div>
                      {slugAvailable === false && (
                        <p className="text-red-400 text-sm mt-1">This URL is already taken. Please try a different one.</p>
                      )}
                      {slugAvailable === true && editedSlug !== portfolio.slug && (
                        <p className="text-green-400 text-sm mt-1">This URL is available!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Privacy</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Portfolio Visibility</div>
                        <div className="text-gray-300 text-sm">Your portfolio is currently public and searchable</div>
                      </div>
                      <div className="text-green-400 font-medium">Public</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={saveChanges}
                  disabled={saving || (editedSlug !== portfolio.slug && slugAvailable !== true)}
                  className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Preview */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
              <div className="aspect-video bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <div className="w-full h-full overflow-auto">
                  <PortfolioRenderer 
                    portfolio={{
                      ...portfolio,
                      resumeData: editedResumeData || portfolio.resumeData,
                      personalization: editedPersonalization || portfolio.personalization
                    }}
                  />
                </div>
              </div>
              <a
                href={`/${portfolio.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-4 text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 rounded-lg transition-colors"
              >
                Open in New Tab
              </a>
            </div>

            {/* Portfolio Info */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Portfolio Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Created:</span>
                  <span className="text-white">{new Date(portfolio.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Updated:</span>
                  <span className="text-white">{new Date(portfolio.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Template:</span>
                  <span className="text-white capitalize">{portfolio.templateId.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Views:</span>
                  <span className="text-white">{portfolio.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Section Heading Editor Modal */}
      {showHeadingEditor && editedPersonalization && (
        <SectionHeadingEditor
          sectionHeadings={editedPersonalization.sectionHeadings}
          onUpdate={handleSectionHeadingsUpdate}
          onClose={() => setShowHeadingEditor(false)}
        />
      )}

      {/* Template Text Editor Modal */}
      {showTemplateTextEditor && editedPersonalization && (
        <TemplateTextEditor
          templateId={editedPersonalization.templateId}
          templateText={editedPersonalization.templateText}
          onUpdate={handleTemplateTextUpdate}
          onClose={() => setShowTemplateTextEditor(false)}
        />
      )}
    </div>
  );
} 