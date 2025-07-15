'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { AuthWrapper } from '@/components/FirebaseAuthWrapper';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { ResumeData, PersonalizationData } from '@/types/resume';
import { ToastContainer, useToast } from '@/components/Toast';
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
  Check
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

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    if (user) {
      loadUserPortfolio();
    }
  }, [user]);

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
        setEditedResumeData(data.portfolio?.resumeData || null);
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
        setEditedResumeData(data.portfolio.resumeData);
        setPreviewKey(prev => prev + 1); // Force iframe refresh
        showSuccess('Portfolio updated successfully!');
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
    
    const url = `${window.location.origin}/${portfolio.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const tabs = [
    { id: 'overview', title: 'Overview', icon: BarChart3 },
    { id: 'design', title: 'Design & Theme', icon: Palette },
    { id: 'content', title: 'Content & Info', icon: User },
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
                      onClick={() => setActiveTab('settings')}
                      className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all duration-300"
                    >
                      <Link className="w-6 h-6 text-blue-400" />
                      <div className="text-left">
                        <div className="text-white font-medium">Edit URL</div>
                        <div className="text-gray-300 text-sm">Customize your portfolio URL</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Portfolio URL */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Your Portfolio URL</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3">
                      <code className="text-purple-300 text-sm break-all">
                        {window.location.origin}/{portfolio.slug}
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
                      { id: 'fullstack-developer', name: 'Full Stack Developer', desc: 'Modern web development focus' },
                      { id: 'opensource-contributor', name: 'Open Source Contributor', desc: 'GitHub-focused community profile' },
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
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Content & Information</h2>
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-2">Current Information</h3>
                    <div className="text-gray-300 space-y-1">
                      <p><strong>Name:</strong> {portfolio.resumeData.contact.name}</p>
                      <p><strong>Email:</strong> {portfolio.resumeData.contact.email}</p>
                      <p><strong>Experience:</strong> {portfolio.resumeData.experience.length} positions</p>
                      <p><strong>Projects:</strong> {portfolio.resumeData.projects.length} projects</p>
                      <p><strong>Skills:</strong> {portfolio.resumeData.skills.length} categories</p>
                    </div>
                  </div>

                  {/* Project Links Editor */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium mb-4">Project Links</h3>
                    <p className="text-gray-300 text-sm mb-4">Add or edit links for your projects (live demos, GitHub repositories, etc.)</p>
                    <div className="space-y-4">
                      {editedResumeData.projects.map((project, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-3">{project.name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">Live Demo URL</label>
                              <input
                                type="url"
                                value={project.link || ''}
                                onChange={(e) => {
                                  const updatedProjects = [...editedResumeData.projects];
                                  updatedProjects[index] = { ...project, link: e.target.value || undefined };
                                  setEditedResumeData({ ...editedResumeData, projects: updatedProjects });
                                }}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://your-project-demo.com"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm mb-2">GitHub Repository URL</label>
                              <input
                                type="url"
                                value={project.github || ''}
                                onChange={(e) => {
                                  const updatedProjects = [...editedResumeData.projects];
                                  updatedProjects[index] = { ...project, github: e.target.value || undefined };
                                  setEditedResumeData({ ...editedResumeData, projects: updatedProjects });
                                }}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://github.com/username/repo"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={saveChanges}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors mt-4"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>{saving ? 'Saving...' : 'Save Project Links'}</span>
                    </button>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                    <h4 className="text-blue-300 font-medium mb-2">Update Content</h4>
                    <p className="text-blue-200 text-sm">
                      To update your portfolio content, upload a new resume from the main page. 
                      Your template and design settings will be preserved.
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center space-x-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload New Resume</span>
                    </a>
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
                              {window.location.origin}/
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
                <iframe
                  key={previewKey}
                  src={`/${portfolio.slug}`}
                  className="w-full h-full"
                  title="Portfolio Preview"
                />
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
    </div>
  );
} 