'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { AuthWrapper } from '@/components/FirebaseAuthWrapper';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { ResumeData, PersonalizationData, Experience, Education, Project, SkillCategory, Contact, SectionHeadings, TemplateText } from '@/types/resume';
import { ToastContainer, useToast } from '@/components/Toast';
import { SectionManager } from '@/components/SectionManager';
import { SectionHeadingEditor } from '@/components/SectionHeadingEditor';
import { TemplateTextEditor } from '@/components/TemplateTextEditor';
import { ResponsibilitiesEditor } from '@/components/ResponsibilitiesEditor';
import { ResponsibilityText } from '@/components/ResponsibilityText';
import { getPortfolioUrl, getBaseUrl, validateAndFixUrl } from '@/lib/utils';
import { fetchWithUser } from '@/lib/auth-fetch';
import { useNotifications } from '@/components/notifications/NotificationStore';
import { AppNotification } from '@/components/notifications/NotificationTypes';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Type,
  Menu,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import NavigationPadding from '@/components/NavigationPadding';

export default function DashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <DashboardContent />
    </AuthWrapper>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<DatabasePortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const tabParam = searchParams?.get('tab') ?? '';
  const validTabIds = ['overview', 'design', 'content', 'cover-letter', 'custom', 'jobs', 'settings'];
  const activeTab = validTabIds.includes(tabParam) ? tabParam : 'overview';
  const [showPreview, setShowPreview] = useState(false);
  const [jobs, setJobs] = useState<Array<{ id: string; company: string; status: 'APPLIED'|'ACCEPTED'|'REJECTED'; updatedAt?: string }>>([]);

  // Form states
  const [editedSlug, setEditedSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [editedPersonalization, setEditedPersonalization] = useState<PersonalizationData | null>(null);
  const [editedResumeData, setEditedResumeData] = useState<ResumeData | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  // Cover letter states
  const [jdText, setJdText] = useState('');
  const [extraPrompt, setExtraPrompt] = useState('');
  const [clBlocks, setClBlocks] = useState<{ greeting: string; intro: string; bodyParas: string[]; closing: string; signoff: string } | null>(null);
  const [clCompany, setClCompany] = useState('');
  const [clRole, setClRole] = useState('');
  const [clStatus, setClStatus] = useState<'Applied' | 'Approved' | 'Rejected' | 'Waiting'>('Waiting');
  const [clLoading, setClLoading] = useState(false);
  const [clEditMode, setClEditMode] = useState(false);
  const [clDownloading, setClDownloading] = useState(false);

  // Content editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showHeadingEditor, setShowHeadingEditor] = useState(false);
  const [showTemplateTextEditor, setShowTemplateTextEditor] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [privacyActionLoading, setPrivacyActionLoading] = useState<'export' | 'delete' | null>(null);

  // Settings: Update from Resume
  const [resumeUpdateMode, setResumeUpdateMode] = useState<'merge' | 'replace'>('merge');
  const [resumeUpdateLoading, setResumeUpdateLoading] = useState(false);
  const [resumeUpdateError, setResumeUpdateError] = useState<string | null>(null);
  const [resumeUpdateSummary, setResumeUpdateSummary] = useState<{ experience: number; projects: number; education: number; skills: number } | null>(null);
  const [resumeParsedPending, setResumeParsedPending] = useState<ResumeData | null>(null);
  type MergePreview = {
    experience: { toAdd: Experience[]; duplicates: Experience[] };
    education: { toAdd: Education[]; duplicates: Education[] };
    projects: { toAdd: Project[]; duplicates: Project[] };
    skills: {
      newCategories: SkillCategory[];
      addedItems: { category: string; items: string[] }[];
      duplicateItems: { category: string; items: string[] }[];
    };
  };
  const [resumeMergePreview, setResumeMergePreview] = useState<MergePreview | null>(null);
  const [showMergePreview, setShowMergePreview] = useState(false);

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();
  // Notification center
  const { addNotifications, removeByDedupeKey } = useNotifications();

  const hasUnsavedChanges = useMemo(() => {
    if (!portfolio || !editedResumeData || !editedPersonalization) return false;
    try {
      const resumeSame = JSON.stringify(portfolio.resumeData) === JSON.stringify(editedResumeData);
      const personalizationSame = JSON.stringify(portfolio.personalization) === JSON.stringify(editedPersonalization);
      const slugSame = editedSlug === portfolio.slug;
      return !resumeSame || !personalizationSame || !slugSame;
    } catch {
      return false;
    }
  }, [portfolio, editedResumeData, editedPersonalization, editedSlug]);

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
        github: resumeData?.contact?.github || '',
        linkedin: resumeData?.contact?.linkedin || '',
        website: resumeData?.contact?.website || ''
      }
    };
  };

  const mergeResumeData = (currentData: ResumeData, parsed: ResumeData): ResumeData => {
    // Helper: append and dedupe by a computed key
    const appendDedupe = <T,>(base: T[], incoming: T[], keyFn: (item: T) => string): T[] => {
      const result: T[] = [...(base || [])];
      const seen = new Set<string>(result.map(keyFn));
      for (const item of incoming || []) {
        const key = keyFn(item);
        if (!key || !seen.has(key)) {
          result.push(item);
          if (key) seen.add(key);
        }
      }
      return result;
    };

    // Experience key: company name only (per user request)
    const experience = parsed.experience && parsed.experience.length > 0
      ? appendDedupe(
          currentData.experience || [],
          parsed.experience,
          (e) => `${(e.company || '').trim().toLowerCase()}`
        )
      : currentData.experience;

    // Education key: institution only (per user request)
    const education = parsed.education && parsed.education.length > 0
      ? appendDedupe(
          currentData.education || [],
          parsed.education,
          (ed) => `${(ed.institution || '').trim().toLowerCase()}`
        )
      : currentData.education;

    // Projects key: project name only (per user request)
    const projects = parsed.projects && parsed.projects.length > 0
      ? appendDedupe(
          currentData.projects || [],
          parsed.projects,
          (p) => {
            const name = (p.name || '').trim().toLowerCase();
            return `${name}`;
          }
        )
      : currentData.projects;

    // Skills: merge categories by category name; dedupe items within each category
    const mergeSkills = (base: SkillCategory[] = [], incoming: SkillCategory[] = []): SkillCategory[] => {
      const categoryMap = new Map<string, SkillCategory>();
      for (const cat of base) {
        const key = (cat.category || '').trim().toLowerCase();
        categoryMap.set(key, { category: cat.category, items: [...(cat.items || [])] });
      }
      for (const cat of incoming) {
        const key = (cat.category || '').trim().toLowerCase();
        if (!categoryMap.has(key)) {
          categoryMap.set(key, { category: cat.category, items: [...(cat.items || [])] });
        } else {
          const existing = categoryMap.get(key)!;
          const seen = new Set(existing.items.map(i => i.trim().toLowerCase()));
          for (const item of cat.items || []) {
            const norm = item.trim().toLowerCase();
            if (!seen.has(norm)) {
              existing.items.push(item);
              seen.add(norm);
            }
          }
        }
      }
      return Array.from(categoryMap.values());
    };

    const merged: ResumeData = {
      ...currentData,
      contact: { ...currentData.contact, ...parsed.contact },
      summary: parsed.summary || currentData.summary,
      experience,
      education,
      projects,
      skills: parsed.skills && parsed.skills.length > 0 ? mergeSkills(currentData.skills || [], parsed.skills) : currentData.skills,
    };
    return ensureResumeDataStructure(merged);
  };

  const computeMergePreview = (currentData: ResumeData, parsed: ResumeData): MergePreview => {
    const norm = (s?: string) => (s || '').trim().toLowerCase();
    // Experience duplicate: company name only (per request)
    const expKey = (e: Experience) => `${norm(e.company)}`;
    // Education duplicate: institution only (per request)
    const eduKey = (e: Education) => `${norm(e.institution)}`;
    // Projects duplicate: name only (per request)
    const projKey = (p: Project) => `${norm(p.name)}`;

    const currentExpKeys = new Set((currentData.experience || []).map(expKey));
    const currentEduKeys = new Set((currentData.education || []).map(eduKey));
    const currentProjKeys = new Set((currentData.projects || []).map(projKey));

    const expIncoming = parsed.experience || [];
    const eduIncoming = parsed.education || [];
    const projIncoming = parsed.projects || [];

    const experience = {
      toAdd: expIncoming.filter(e => !currentExpKeys.has(expKey(e))),
      duplicates: expIncoming.filter(e => currentExpKeys.has(expKey(e)))
    };
    const education = {
      toAdd: eduIncoming.filter(e => !currentEduKeys.has(eduKey(e))),
      duplicates: eduIncoming.filter(e => currentEduKeys.has(eduKey(e)))
    };
    const projects = {
      toAdd: projIncoming.filter(p => !currentProjKeys.has(projKey(p))),
      duplicates: projIncoming.filter(p => currentProjKeys.has(projKey(p)))
    };

    // Skills
    const currentByCategory = new Map<string, SkillCategory>();
    for (const cat of currentData.skills || []) {
      currentByCategory.set(norm(cat.category), { category: cat.category, items: [...(cat.items || [])] });
    }
    const newCategories: SkillCategory[] = [];
    const addedItems: { category: string; items: string[] }[] = [];
    const duplicateItems: { category: string; items: string[] }[] = [];
    for (const cat of parsed.skills || []) {
      const key = norm(cat.category);
      const incomingItems = (cat.items || []);
      if (!currentByCategory.has(key)) {
        if ((cat.items || []).length > 0 || cat.category) newCategories.push({ category: cat.category, items: [...incomingItems] });
      } else {
        const existing = currentByCategory.get(key)!;
        const seen = new Set((existing.items || []).map(i => norm(i)));
        const toAddItems = incomingItems.filter(i => !seen.has(norm(i)));
        const dupItems = incomingItems.filter(i => seen.has(norm(i)));
        if (toAddItems.length) addedItems.push({ category: existing.category, items: toAddItems });
        if (dupItems.length) duplicateItems.push({ category: existing.category, items: dupItems });
      }
    }

    return { experience, education, projects, skills: { newCategories, addedItems, duplicateItems } };
  };

  const handleResumeUpdateUpload = async (file: File) => {
    setResumeUpdateError(null);
    setResumeUpdateSummary(null);
    setResumeUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to parse resume');
      }

      const data = await response.json();
      const parsed: ResumeData = ensureResumeDataStructure(data.data);

      const current = editedResumeData || portfolio?.resumeData || ({} as ResumeData);
      // Do not apply immediately; show preview and store parsed pending until Save
      setResumeParsedPending(parsed);
      const next = resumeUpdateMode === 'replace' ? parsed : mergeResumeData(current as ResumeData, parsed);
      if (resumeUpdateMode === 'replace') {
        setEditedResumeData(next);
      }

      if (resumeUpdateMode === 'merge') {
        const preview = computeMergePreview(current as ResumeData, parsed);
        setResumeMergePreview(preview);
        setShowMergePreview(true);
      } else {
        setResumeMergePreview(null);
        setShowMergePreview(false);
      }

      setResumeUpdateSummary({
        experience: parsed.experience.length,
        projects: parsed.projects.length,
        education: parsed.education.length,
        skills: parsed.skills.length,
      });
      showSuccess('Resume parsed. Review changes and Save Settings to apply.');
    } catch (e: any) {
      console.error('Resume update failed', e);
      setResumeUpdateError(e.message || 'Failed to update from resume');
      showError('Failed to update from resume');
    } finally {
      setResumeUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserPortfolio();
    }
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = await user?.getIdToken();
        if (!token) return;
        const res = await fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setJobs(data.items || []);
      } catch (e) {
        console.error('Failed to load jobs', e);
      }
    };
    if (activeTab === 'jobs') fetchJobs();
  }, [activeTab, user]);

  // Handle deep links from notifications to open specific editor context
  useEffect(() => {
    const tab = searchParams?.get('tab');
    const section = searchParams?.get('section');
    const indexParam = searchParams?.get('index');
    if (section && !tab) router.replace(`/dashboard?tab=content&section=${encodeURIComponent(section)}${indexParam != null ? `&index=${indexParam}` : ''}`);
    if (section) setEditingSection(section);
    if (indexParam) setEditingIndex(Number(indexParam));
  }, [searchParams, router]);

  const goToTab = (tabId: string) => router.replace(`/dashboard?tab=${tabId}`);

  // Listen for sidebar tab clicks (works when useSearchParams is stale on same-path nav)
  useEffect(() => {
    const handler = (e: CustomEvent<{ tab: string }>) => router.replace(`/dashboard?tab=${e.detail.tab}`);
    window.addEventListener('dashboard-tab', handler as EventListener);
    return () => window.removeEventListener('dashboard-tab', handler as EventListener);
  }, [router]);

  // Keep URL in sync when landing on /dashboard with no tab (so sidebar links work)
  useEffect(() => {
    if (!tabParam && portfolio) router.replace('/dashboard?tab=overview');
  }, [tabParam, portfolio, router]);

  // Generate QR code when portfolio changes
  useEffect(() => {
    if (portfolio?.slug) {
      generateQRCode();
    }
  }, [portfolio?.slug]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu && !(event.target as Element).closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

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
      if (!user) return;
      const response = await fetchWithUser(user, '/api/user-portfolio');

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio);
        setEditedSlug(data.portfolio?.slug || '');
        setEditedPersonalization(data.portfolio?.personalization || null);
        const normalized = data.portfolio?.resumeData ? ensureResumeDataStructure(data.portfolio.resumeData) : null;
        setEditedResumeData(normalized);
        if (normalized) {
          generateIssueNotifications(normalized);
        }
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

  // Create actionable issue notifications based on resumeData
  const generateIssueNotifications = (resume: ResumeData) => {
    const issues: AppNotification[] = [];

    // Contact name missing
    if (!resume.contact?.name) {
      issues.push({
        id: 'issue-contact-name-missing',
        kind: 'issue',
        title: 'Missing full name',
        message: 'Add your full name in Contact Information.',
        createdAt: Date.now(),
        read: false,
        dedupeKey: 'issue-contact-name-missing',
        action: { targetTab: 'content', section: 'contact' },
      });
    }

    // Invalid or missing experience dates
    (resume.experience || []).forEach((exp, i) => {
      const hasStart = !!exp.startDate && exp.startDate.trim().length > 0;
      const hasEnd = exp.current || (!!exp.endDate && exp.endDate.trim().length > 0);
      if (!hasStart || !hasEnd) {
        const key = `issue-experience-${i}-date`;
        issues.push({
          id: key,
          kind: 'issue',
          title: 'Experience has invalid dates',
          message: `Fix dates for experience #${i + 1}. Use formats like "Jan 2023".`,
          createdAt: Date.now(),
          read: false,
          dedupeKey: key,
          action: { targetTab: 'content', section: 'experience', index: i },
        });
      }
      if (!exp.position || !exp.company) {
        const key = `issue-experience-${i}-missing-fields`;
        issues.push({
          id: key,
          kind: 'issue',
          title: 'Experience is missing details',
          message: `Add position and company for experience #${i + 1}.`,
          createdAt: Date.now(),
          read: false,
          dedupeKey: key,
          action: { targetTab: 'content', section: 'experience', index: i },
        });
      }
    });

    // Project name and description
    (resume.projects || []).forEach((p, i) => {
      if (!p.name || !p.description) {
        const key = `issue-project-${i}-basics`;
        issues.push({
          id: key,
          kind: 'issue',
          title: 'Project missing basics',
          message: `Add name and description for project #${i + 1}.`,
          createdAt: Date.now(),
          read: false,
          dedupeKey: key,
          action: { targetTab: 'content', section: 'projects', index: i },
        });
      }
    });

    // Education degree and institution
    (resume.education || []).forEach((e, i) => {
      if (!e.degree || !e.institution) {
        const key = `issue-education-${i}-basics`;
        issues.push({
          id: key,
          kind: 'issue',
          title: 'Education missing basics',
          message: `Add degree and institution for education #${i + 1}.`,
          createdAt: Date.now(),
          read: false,
          dedupeKey: key,
          action: { targetTab: 'content', section: 'education', index: i },
        });
      }
    });

    if (issues.length > 0) {
      addNotifications(issues);
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
      // If merge mode and there's a parsed resume waiting, compute merged data locally
      let effectiveResumeData = editedResumeData;
      if (resumeUpdateMode === 'merge' && resumeParsedPending && editedResumeData) {
        const mergedNow = mergeResumeData(editedResumeData, resumeParsedPending);
        effectiveResumeData = mergedNow;
        setEditedResumeData(mergedNow);
      }

      // Create a timeout promise to handle long requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 12000); // 12 second timeout
      });

      // Sanitize resume data before saving (e.g., remove empty technologies from projects)
      const sanitizedResumeData = effectiveResumeData ? {
        ...effectiveResumeData,
        projects: (effectiveResumeData.projects || []).map((p) => ({
          ...p,
          technologies: (p.technologies || []).map(t => t.trim()).filter(t => t),
        })),
      } : effectiveResumeData;

      const fetchPromise = fetch('/api/update-portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          slug: editedSlug !== portfolio.slug ? editedSlug : undefined,
          personalization: editedPersonalization,
          resumeData: sanitizedResumeData
        })
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (response.ok) {
        const data = await response.json();
        setPortfolio(data.portfolio);
        setEditedSlug(data.portfolio.slug); // Update slug if changed
          const normalized = ensureResumeDataStructure(data.portfolio.resumeData);
          setEditedResumeData(normalized);
          // Re-generate issues for updated content
          generateIssueNotifications(normalized);
        setEditedPersonalization(data.portfolio.personalization); // Update personalization state
        setPreviewKey(prev => prev + 1); // Force iframe refresh
        showSuccess('Portfolio updated successfully!');
        setEditingSection(null);
        setEditingIndex(null);
        // Clear any pending merge/preview state after successful save
        setResumeParsedPending(null);
        setResumeMergePreview(null);
        setShowMergePreview(false);
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

  const exportAccountData = async () => {
    if (!user) return;

    setPrivacyActionLoading('export');
    try {
      const response = await fetch('/api/privacy/export', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        showError('Unable to export your data right now.');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showSuccess('Your data export has been downloaded.');
    } catch (error) {
      console.error('Data export failed:', error);
      showError('Unable to export your data right now.');
    } finally {
      setPrivacyActionLoading(null);
    }
  };

  const deleteAccountData = async () => {
    if (!user) return;

    const confirmation = window.prompt('Type DELETE to permanently delete your account and login. This cannot be undone. Signing in again will start a new account.');
    if (confirmation !== 'DELETE') return;

    setPrivacyActionLoading('delete');
    try {
      const response = await fetch('/api/privacy/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        showError('Unable to delete your account right now.');
        return;
      }

      try {
        window.localStorage.removeItem('portfolio.notifications.v1');
        window.localStorage.removeItem('portfolio.notifications.readIds.v1');
      } catch {
        // Ignore storage errors so sign-out still happens.
      }

      await signOut();
      window.location.replace('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
      showError('Unable to delete your account right now.');
    } finally {
      setPrivacyActionLoading(null);
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

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (!editedResumeData) return;
    const len = editedResumeData.experience.length;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= len) return;
    const updated = [...editedResumeData.experience];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEditedResumeData({ ...editedResumeData, experience: updated });
    if (editingSection === 'experience' && (editingIndex === index || editingIndex === newIndex)) {
      setEditingIndex(newIndex);
    }
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
    
    // Validate and fix URLs for website, linkedin, and github fields
    if (field === 'website' || field === 'linkedin' || field === 'github') {
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
    { id: 'cover-letter', title: 'Cover Letter', icon: FileText },
    { id: 'custom', title: 'Custom Sections', icon: Layers },
    { id: 'jobs', title: 'My Jobs', icon: Briefcase },
    { id: 'settings', title: 'Settings', icon: Settings },
  ];

  // Template preview component
  const renderTemplatePreview = (templateId: string) => {
    switch (templateId) {
      case 'full-stack-developer':
        return (
          <div className="w-full h-full bg-black text-green-400 p-2 text-xs font-mono">
            <div className="text-cyan-400">dev@portfolio:~$</div>
            <div className="text-green-400">whoami</div>
            <div className="text-white">Full Stack Developer</div>
            <div className="text-cyan-400">ls skills/</div>
            <div className="text-green-400">React TypeScript Node.js</div>
          </div>
        );
      case 'creative-portfolio':
        return (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 p-2 relative">
            <div className="absolute top-2 right-2 w-4 h-4 bg-red-400 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="text-center mt-4">
              <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-bold text-purple-800">Creative</div>
              <div className="text-xs text-purple-600">Portfolio</div>
            </div>
          </div>
        );
      case 'tech-innovator':
        return (
          <div className="w-full h-full bg-black text-blue-400 p-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"></div>
            <div className="relative z-10">
              <div className="text-xs text-cyan-400">◆ TECH INNOVATOR</div>
              <div className="text-xs text-blue-300 mt-1">▲ Neural Networks</div>
              <div className="text-xs text-cyan-300">● Machine Learning</div>
              <div className="text-xs text-blue-200">◇ AI Development</div>
            </div>
          </div>
        );
      case 'minimalist-clean':
        return (
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
        );
      case 'dark-professional':
        return (
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
        );
      case 'modern-glassmorphism':
        return (
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
        );
      case 'creative-gradient':
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 p-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20"></div>
            <div className="relative z-10 text-center">
              <div className="w-6 h-6 bg-white rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-semibold text-white">Creative</div>
              <div className="text-xs text-purple-100">Gradient</div>
              <div className="mt-2 space-y-1">
                <div className="w-full h-1 bg-white/30 rounded"></div>
                <div className="w-3/4 h-1 bg-white/30 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'developer-terminal':
        return (
          <div className="w-full h-full bg-black text-green-400 p-2 text-xs font-mono">
            <div className="text-gray-400">$ whoami</div>
            <div className="text-green-400">developer</div>
            <div className="text-gray-400">$ ls -la</div>
            <div className="text-green-400">skills projects experience</div>
          </div>
        );
      case 'corporate-executive':
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 p-2">
            <div className="text-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-semibold text-gray-800">Executive</div>
              <div className="text-xs text-gray-600">Corporate</div>
              <div className="mt-2 space-y-1">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'open-source-contributor':
        return (
          <div className="w-full h-full bg-white p-2 border border-gray-200">
            <div className="text-center">
              <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-xs font-semibold text-gray-800">Open Source</div>
              <div className="text-xs text-gray-600">Contributor</div>
              <div className="mt-2 space-y-1">
                <div className="w-full h-1 bg-green-200 rounded"></div>
                <div className="w-3/4 h-1 bg-green-200 rounded"></div>
              </div>
            </div>
          </div>
        );
      case 'data-science-analyst':
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 p-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20"></div>
            <div className="relative z-10 text-center">
              <div className="w-6 h-6 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-xs font-semibold text-white">Data Science</div>
              <div className="text-xs text-blue-200">Analyst</div>
              <div className="mt-2 space-y-1">
                <div className="w-full h-1 bg-white/30 rounded"></div>
                <div className="w-3/4 h-1 bg-white/30 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-100 p-2 flex items-center justify-center">
            <div className="text-xs text-gray-500">Template Preview</div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <FileText className="w-16 h-16 text-[rgb(var(--accent-600))] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">No Portfolio Found</h1>
            <p className="text-gray-300 mb-8">
              You haven't created a portfolio yet. Create your first portfolio to get started!
            </p>
            <a 
              href="/"
              className="inline-flex items-center space-x-2 bg-[rgb(var(--accent-600))] hover:bg-[rgb(var(--accent))] text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300"
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
    <NavigationPadding>
      <div className="min-h-screen bg-[rgb(var(--bg))]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className="relative bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg mb-6 sm:mb-8 mobile-menu-container z-40">
          {/* Mobile: Hamburger Menu */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabData?.icon || BarChart3;
                  return (
                    <>
                      <Icon className="w-5 h-5 text-[rgb(var(--fg))]" />
                      <span className="text-[rgb(var(--fg))] font-medium">{activeTabData?.title}</span>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-[rgb(var(--fg))] transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className="absolute top-full left-0 right-0 z-40 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] ">
                <div className="px-4 py-3 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        goToTab(tab.id);
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[rgb(var(--accent-600))]/15 text-[rgb(var(--fg))]'
                          : 'text-gray-700 hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.title}</span>
                    </button>
                  );
                })}
                </div>
              </div>
            )}
          </div>

          {/* Show horizontal tabs on small/medium only; hide on desktop where sidebar is used */}
          <div className="hidden sm:block lg:hidden p-1">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => goToTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-lg border border-[rgb(var(--border))]'
                        : 'text-gray-600 hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content - key forces re-render when tab from URL changes */}
        <div key={activeTab} className={`grid ${activeTab === 'cover-letter' ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1 lg:grid-cols-3'} gap-4 sm:gap-6 lg:gap-8`}>
          {/* Main Content */}
          <div className={`${activeTab === 'cover-letter' ? 'xl:col-span-12' : 'lg:col-span-2'} order-2 lg:order-1`}>
            {activeTab === 'cover-letter' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-4 sm:p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[rgb(var(--fg))] mb-4">Generate your cover letter</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    {/* Left: JD input and controls */}
                    <div className="space-y-3 xl:col-span-4">
                      <label className="block text-sm text-[rgb(var(--muted))]">Paste job description</label>
                      <textarea className="w-full rounded-lg p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] min-h-[260px]" value={jdText} onChange={(e)=>setJdText(e.target.value)} />
                      <label className="block text-sm text-[rgb(var(--muted))]">Optional prompt to guide tone/focus</label>
                      <input className="w-full rounded-lg p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--fg))]" placeholder="Optional: emphasize leadership, keep to 350 words, etc." value={extraPrompt} onChange={(e)=>setExtraPrompt(e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Company name (required)" className="rounded-lg p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--fg))]" value={clCompany} onChange={(e)=>setClCompany(e.target.value)} />
                        <select className="rounded-lg p-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--fg))]" value={clStatus} onChange={(e)=>setClStatus(e.target.value as any)}>
                          <option className="text-black" value="Waiting">Applied (waiting)</option>
                          <option className="text-black" value="Approved">Approved</option>
                          <option className="text-black" value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <button
                        onClick={async ()=>{
                          if (!clCompany.trim()) { alert('Please enter the company name.'); return; }
                          setClLoading(true);
                          try {
                            const token = await user?.getIdToken();
                            const toAppStatus = (s: 'Applied'|'Approved'|'Rejected'|'Waiting'): 'APPLIED'|'ACCEPTED'|'REJECTED' => {
                              if (s === 'Approved') return 'ACCEPTED';
                              if (s === 'Rejected') return 'REJECTED';
                              return 'APPLIED';
                            };
                            const res = await fetch('/api/cover-letter/generate', { 
                              method: 'POST', 
                              headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, 
                              body: JSON.stringify({ 
                                jobDescription: jdText, 
                                resumeData: editedResumeData, 
                                prompt: `${extraPrompt}\nDo not use generic openers like \"I am excited to apply\".`,
                                company: clCompany.trim(),
                                status: toAppStatus(clStatus)
                              }) 
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setClBlocks(data.contentBlocks);
                            }
                          } finally {
                            setClLoading(false);
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        disabled={clLoading || jdText.trim().length < 30 || !clCompany.trim()}
                      >{clLoading ? 'Generating…' : 'Generate'}</button>
                    </div>
                    {/* Right: Demo-style preview with quick edits */}
                    <div className="bg-white rounded-xl p-0 border border-[rgb(var(--border))] text-gray-900 overflow-hidden xl:col-span-8">
                      <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600" />
                      <div className="p-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <input className="text-2xl font-extrabold text-gray-900 w-full" value={editedResumeData?.contact?.name || ''} onChange={(e)=> setEditedResumeData(prev => prev ? ({ ...prev, contact: { ...prev.contact, name: e.target.value } }) : prev)} placeholder="Your Name" />
                            <input className="text-gray-600 w-full" value={clRole} onChange={(e)=> setClRole(e.target.value)} placeholder="Role you’re applying for (e.g., Frontend Engineer)" />
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            <div className="flex flex-wrap gap-x-3 gap-y-1 justify-end">
                              {editedResumeData?.contact?.email && <span>{editedResumeData.contact.email}</span>}
                              {editedResumeData?.contact?.phone && <><span>•</span><span>{editedResumeData.contact.phone}</span></>}
                              {editedResumeData?.contact?.location && <><span>•</span><span>{editedResumeData.contact.location}</span></>}
                            </div>
                            {editedResumeData?.contact?.linkedin && <div className="mt-1">{editedResumeData.contact.linkedin}</div>}
                          </div>
                        </div>
                        <hr className="my-5" />
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <div>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          <div className="font-medium text-gray-900">Hiring Manager</div>
                          <div>
                            <input className="w-full text-sm text-gray-700" value={clCompany} onChange={(e)=>setClCompany(e.target.value)} placeholder="Company Name" />
                          </div>
                        </div>
                        <div className="space-y-5 leading-relaxed text-gray-800">
                          <input className="font-medium w-full" value={clBlocks?.greeting || ''} onChange={(e)=> setClBlocks(prev => prev ? ({ ...prev, greeting: e.target.value }) : prev)} placeholder="Dear Hiring Manager," />
                          <textarea className="w-full" rows={3} value={clBlocks?.intro || ''} onChange={(e)=> setClBlocks(prev => prev ? ({ ...prev, intro: e.target.value }) : prev)} placeholder={`What I like about ${clCompany || 'your company'} is ... I believe I can add value by ...`} />
                          {(clBlocks?.bodyParas || []).map((p, i)=> (
                            <textarea key={i} className="w-full" rows={3} value={p} onChange={(e)=> setClBlocks(prev => prev ? ({ ...prev, bodyParas: prev.bodyParas.map((bp, idx)=> idx===i ? e.target.value : bp) }) : prev)} />
                          ))}
                          <textarea className="w-full" rows={2} value={clBlocks?.closing || ''} onChange={(e)=> setClBlocks(prev => prev ? ({ ...prev, closing: e.target.value }) : prev)} placeholder="Closing sentence" />
                          <textarea className="w-full font-semibold" rows={2} value={clBlocks?.signoff || ''} onChange={(e)=> setClBlocks(prev => prev ? ({ ...prev, signoff: e.target.value }) : prev)} placeholder={`Sincerely,\n${editedResumeData?.contact?.name || 'Your Name'}`} />
                        </div>
                        <div className="mt-6 flex gap-3 justify-end">
                          <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
                            disabled={clDownloading}
                            onClick={async ()=>{
                              if (clDownloading) return;
                              setClDownloading(true);
                              try {
                                const params = new URLSearchParams();
                                params.set('pdf', '1');
                                params.set('name', editedResumeData?.contact?.name || '');
                                if (editedResumeData?.contact?.email) params.set('email', editedResumeData.contact.email);
                                if (editedResumeData?.contact?.phone) params.set('phone', editedResumeData.contact.phone);
                                if (editedResumeData?.contact?.location) params.set('location', editedResumeData.contact.location);
                                if (editedResumeData?.contact?.linkedin) params.set('linkedin', editedResumeData.contact.linkedin);
                                params.set('company', clCompany || 'Company Name');
                                if (clRole) params.set('role', clRole);
                                params.set('greeting', clBlocks?.greeting || 'Dear Hiring Manager,');
                                params.set('intro', clBlocks?.intro || 'I am excited to apply...');
                                (clBlocks?.bodyParas || []).forEach(p => params.append('bp', p));
                                if (clBlocks?.closing) params.set('closing', clBlocks.closing);
                                if (clBlocks?.signoff) params.set('signoff', clBlocks.signoff);
                                const origin = window.location.origin;
                                const res = await fetch(`/api/cover-letter-demo/pdf?url=${encodeURIComponent(`${origin}/cover-letter-render?${params.toString()}`)}`);
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a'); a.href = url; a.download = `Cover_Letter_${clCompany||'Company'}.pdf`; a.click(); URL.revokeObjectURL(url);
                              } finally {
                                setClDownloading(false);
                              }
                            }}
                          >
                            {clDownloading && <RefreshCw className="w-4 h-4 animate-spin" />}
                            <span>{clDownloading ? 'Downloading…' : 'Download PDF'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-3">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                        <span>My Jobs</span>
                      </h2>
                      <p className="text-[rgb(var(--muted))] mt-1">Track your applications and update their status</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-[rgb(var(--border))]">
                    <table className="min-w-full divide-y divide-[rgb(var(--border))]">
                      <thead className="bg-[rgb(var(--card))]">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-[rgb(var(--fg))]">Company</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-[rgb(var(--fg))]">Status</th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-[rgb(var(--fg))]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgb(var(--border))]">
                        {jobs.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-6 text-center text-[rgb(var(--muted))]">No applications yet.</td>
                          </tr>
                        )}
                        {jobs.map((j) => (
                          <tr key={j.id}>
                            <td className="px-4 py-3 text-[rgb(var(--fg))]">{j.company}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${j.status === 'APPLIED' ? 'bg-blue-100 text-blue-700' : j.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} dark:${j.status === 'APPLIED' ? 'bg-blue-500/20 text-blue-300' : j.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{j.status}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <select
                                className="rounded-lg p-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--fg))]"
                                defaultValue={j.status}
                                onChange={async (e)=>{
                                  const next = e.target.value as 'APPLIED'|'ACCEPTED'|'REJECTED';
                                  try {
                                    const token = await user?.getIdToken();
                                    await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ company: j.company, status: next }) });
                                    setJobs(prev => prev.map(p => p.id === j.id ? { ...p, status: next } : p));
                                  } catch (err) {
                                    console.error('Update status failed', err);
                                  }
                                }}
                              >
                                <option className="text-black" value="APPLIED">APPLIED</option>
                                <option className="text-black" value="ACCEPTED">ACCEPTED</option>
                                <option className="text-black" value="REJECTED">REJECTED</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Portfolio Stats */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-4 sm:p-6 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--fg))] mb-4 sm:mb-6">Portfolio Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 text-center shadow-sm">
                      <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[rgb(var(--fg))]">{portfolio.views}</div>
                      <div className="text-[rgb(var(--muted))] text-sm">Total Views</div>
                    </div>
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 text-center shadow-sm">
                      <Link className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[rgb(var(--fg))]">1</div>
                      <div className="text-[rgb(var(--muted))] text-sm">Portfolio</div>
                    </div>
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 text-center shadow-sm">
                      <Palette className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[rgb(var(--fg))] capitalize">{portfolio.templateId.replace('-', ' ')}</div>
                      <div className="text-[rgb(var(--muted))] text-sm">Current Template</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[rgb(var(--fg))] mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => goToTab('design')}
                      className="flex items-center space-x-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--border))]/40 p-4 rounded-xl transition-all duration-300 shadow-sm"
                    >
                      <Palette className="w-6 h-6 text-purple-400" />
                      <div className="text-left">
                        <div className="text-[rgb(var(--fg))] font-medium">Change Theme</div>
                        <div className="text-[rgb(var(--muted))] text-sm">Switch templates & colors</div>
                      </div>
                    </button>
                    <button
                      onClick={() => goToTab('content')}
                      className="flex items-center space-x-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--border))]/40 p-4 rounded-xl transition-all duration-300 shadow-sm"
                    >
                      <Edit className="w-6 h-6 text-green-400" />
                      <div className="text-left">
                        <div className="text-[rgb(var(--fg))] font-medium">Edit Content</div>
                        <div className="text-[rgb(var(--muted))] text-sm">Update your information</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Portfolio URL */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[rgb(var(--fg))] mb-4">Your Portfolio URL</h3>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-3 shadow-sm">
                      <code className="text-[rgb(var(--fg))] text-sm break-all">
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
                  <div className="border-t border-[rgb(var(--border))] pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <QrCode className="w-5 h-5 text-purple-400" />
                      <h4 className="text-md font-semibold text-[rgb(var(--fg))]">QR Code</h4>
                      <div className="flex items-center space-x-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                        <Smartphone className="w-3 h-3" />
                        <span>Scan to open on mobile</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] p-4 rounded-xl shadow-sm">
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
                        <p className="text-[rgb(var(--muted))] text-sm">
                          Scan this QR code with your phone camera to quickly access your portfolio on mobile devices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && editedPersonalization && (
              <div className="bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Design & Theme</h2>
                
                {/* Template Selection */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Choose Template</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                      { id: 'data-science-analyst', name: 'Data Science Analyst', desc: 'Analytical data science portfolio' },
                    ].map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setEditedPersonalization({ ...editedPersonalization, templateId: template.id })}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          editedPersonalization.templateId === template.id
                            ? 'border-purple-400 bg-purple-500/20 text-white ring-2 ring-purple-400/40 ring-offset-2 ring-offset-gray-800'
                            : 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        <div className="font-medium text-white">{template.name}</div>
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
                          editedPersonalization.colorScheme === color 
                            ? 'border-gray-300 scale-110 ring-2 ring-gray-300 ring-offset-2 ring-offset-gray-800' 
                            : 'border-transparent hover:scale-105'
                        } bg-${color}-500`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}

            {activeTab === 'content' && editedResumeData && (
              <div className="space-y-4 sm:space-y-6">
                {/* Contact Information */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-2">
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span>Contact Information</span>
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editedResumeData.contact.name}
                        onChange={(e) => updateContact('name', e.target.value)}
                        className="w-full input-field"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={editedResumeData.contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full input-field"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editedResumeData.contact.phone || ''}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full input-field"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">Location</label>
                      <input
                        type="text"
                        value={editedResumeData.contact.location || ''}
                        onChange={(e) => updateContact('location', e.target.value)}
                        className="w-full input-field"
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={editedResumeData.contact.linkedin || ''}
                        onChange={(e) => updateContact('linkedin', e.target.value)}
                        className="w-full input-field"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={editedResumeData.contact.github || ''}
                        onChange={(e) => updateContact('github', e.target.value)}
                        className="w-full input-field"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">Website/Portfolio</label>
                      <input
                        type="url"
                        value={editedResumeData.contact.website || ''}
                        onChange={(e) => updateContact('website', e.target.value)}
                        className="w-full input-field"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-[rgb(var(--muted))] text-sm mb-2">Professional Summary</label>
                    <textarea
                      value={editedResumeData.summary}
                      onChange={(e) => setEditedResumeData({ ...editedResumeData, summary: e.target.value })}
                      rows={4}
                      className="w-full input-field"
                      placeholder="Write a brief professional summary..."
                    />
                  </div>

                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors mt-6"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Contact Info'}</span>
                  </button>
                </div>

                {/* Work Experience */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-2">
                      <Briefcase className="w-6 h-6" />
                      <span>Work Experience</span>
                    </h2>
                    <button
                      onClick={addExperience}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.experience.map((exp, index) => (
                      <div key={index} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-4">
                        {editingSection === 'experience' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Company</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="Company name"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Position</label>
                                <input
                                  type="text"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="Job title"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Location</label>
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                  className="w-full input-field"
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
                                <label className="text-[rgb(var(--muted))] text-sm">Current position</label>
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="January 2023"
                                />
                              </div>
                              {!exp.current && (
                                <div>
                                  <label className="block text-[rgb(var(--muted))] text-sm mb-2">End Date</label>
                                  <input
                                    type="text"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                    className="w-full input-field"
                                    placeholder="December 2023"
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-[rgb(var(--muted))] text-sm mb-2">Responsibilities</label>
                              <ResponsibilitiesEditor
                                value={exp.responsibilities || []}
                                onChange={(items) => updateExperience(index, 'responsibilities', items)}
                                placeholder="Type - or * then space for bullets, or use the toolbar"
                              />
                            </div>
                            <div className="flex flex-nowrap items-center gap-2">
                              <div className="flex items-center rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1 gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => moveExperience(index, 'up')}
                                  disabled={index === 0}
                                  className="p-2 rounded-md text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Move up"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveExperience(index, 'down')}
                                  disabled={index === editedResumeData.experience.length - 1}
                                  className="p-2 rounded-md text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Move down"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="w-px h-5 bg-[rgb(var(--border))]" aria-hidden />
                              <button
                                onClick={() => { setEditingSection(null); setEditingIndex(null); }}
                                className="btn-secondary flex items-center space-x-2"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[rgb(var(--fg))] font-medium">{exp.position || 'New Position'}</h4>
                              <p className="text-[rgb(var(--muted))]">{exp.company} {exp.location && `• ${exp.location}`}</p>
                              <p className="text-[rgb(var(--muted))] text-sm">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                              {exp.responsibilities && exp.responsibilities.length > 0 && (
                                <ul className="text-[rgb(var(--muted))] text-sm mt-2 space-y-1">
                                  {exp.responsibilities.slice(0, 2).map((resp, i) => (
                                    <li key={i}>• <ResponsibilityText text={resp} as="span" /></li>
                                  ))}
                                  {exp.responsibilities.length > 2 && (
                                    <li className="text-[rgb(var(--muted))]">... and {exp.responsibilities.length - 2} more</li>
                                  )}
                                </ul>
                              )}
                            </div>
                            <div className="flex items-center shrink-0 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1 gap-0.5">
                              <button
                                type="button"
                                onClick={() => moveExperience(index, 'up')}
                                disabled={index === 0}
                                className="p-2 rounded-md text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move up"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveExperience(index, 'down')}
                                disabled={index === editedResumeData.experience.length - 1}
                                className="p-2 rounded-md text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Move down"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <span className="w-px h-5 bg-[rgb(var(--border))]" aria-hidden />
                              <button
                                type="button"
                                onClick={() => { setEditingSection('experience'); setEditingIndex(index); }}
                                className="p-2 rounded-md text-blue-500 hover:bg-blue-500/20 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteExperience(index)}
                                className="p-2 rounded-md text-red-500 hover:bg-red-500/20 transition-colors"
                                title="Delete"
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
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-2">
                      <FolderOpen className="w-6 h-6" />
                      <span>Projects</span>
                    </h2>
                    <button
                      onClick={addProject}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.projects.map((project, index) => (
                      <div key={index} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-4">
                        {editingSection === 'projects' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Project Name</label>
                                <input
                                  type="text"
                                  value={project.name}
                                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="Project name"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Technologies (comma separated)</label>
                                <input
                                  type="text"
                                  value={(project.technologies || []).join(', ')}
                                  onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                                  className="w-full input-field"
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Live Demo URL</label>
                                <input
                                  type="url"
                                  value={project.link || ''}
                                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="https://project-demo.com"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">GitHub URL</label>
                                <input
                                  type="url"
                                  value={project.github || ''}
                                  onChange={(e) => updateProject(index, 'github', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="https://github.com/username/repo"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[rgb(var(--muted))] text-sm mb-2">Description</label>
                              <textarea
                                value={project.description}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full input-field"
                                placeholder="Describe your project..."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection(null);
                                  setEditingIndex(null);
                                }}
                                className="btn-secondary flex items-center space-x-2"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-[rgb(var(--fg))] font-medium">{project.name || 'New Project'}</h4>
                              <p className="text-[rgb(var(--muted))] text-sm mt-1">{project.description}</p>
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.technologies.map((tech, i) => (
                                    <span key={i} className="bg-[rgb(var(--accent-600))]/20 text-[rgb(var(--accent-600))] px-2 py-1 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex space-x-4 mt-2">
                                {project.link && (
                                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--accent-600))] hover:underline text-sm flex items-center space-x-1">
                                    <Globe className="w-3 h-3" />
                                    <span>Demo</span>
                                  </a>
                                )}
                                {project.github && (
                                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] text-sm flex items-center space-x-1">
                                    <Github className="w-3 h-3" />
                                    <span>Code</span>
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex shrink-0 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1 gap-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSection('projects');
                                  setEditingIndex(index);
                                }}
                                className="p-2 rounded-md text-blue-500 hover:bg-blue-500/20 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProject(index)}
                                className="p-2 rounded-md text-red-500 hover:bg-red-500/20 transition-colors"
                                title="Delete"
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
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-2">
                      <GraduationCap className="w-6 h-6" />
                      <span>Education</span>
                    </h2>
                    <button
                      onClick={addEducation}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.education.map((edu, index) => (
                      <div key={index} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-4">
                        {editingSection === 'education' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Institution</label>
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="University/School name"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Degree</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="Bachelor's, Master's, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Field of Study</label>
                                <input
                                  type="text"
                                  value={edu.field}
                                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="Computer Science, Business, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">Graduation Date</label>
                                <input
                                  type="text"
                                  value={edu.graduationDate}
                                  onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                                  className="w-full input-field"
                                  placeholder="May 2023"
                                />
                              </div>
                              <div>
                                <label className="block text-[rgb(var(--muted))] text-sm mb-2">GPA (optional)</label>
                                <input
                                  type="text"
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                  className="w-full input-field"
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
                                className="btn-secondary flex items-center space-x-2"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-[rgb(var(--fg))] font-medium">{edu.degree || 'New Degree'} {edu.field && `in ${edu.field}`}</h4>
                              <p className="text-[rgb(var(--muted))]">{edu.institution}</p>
                              <p className="text-[rgb(var(--muted))] text-sm">{edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                            </div>
                            <div className="flex shrink-0 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1 gap-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSection('education');
                                  setEditingIndex(index);
                                }}
                                className="p-2 rounded-md text-blue-500 hover:bg-blue-500/20 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteEducation(index)}
                                className="p-2 rounded-md text-red-500 hover:bg-red-500/20 transition-colors"
                                title="Delete"
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
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-2">
                      <Code className="w-6 h-6" />
                      <span>Skills</span>
                    </h2>
                    <button
                      onClick={addSkillCategory}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedResumeData.skills.map((skillGroup, index) => (
                      <div key={index} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-4">
                        {editingSection === 'skills' && editingIndex === index ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[rgb(var(--muted))] text-sm mb-2">Category Name</label>
                              <input
                                type="text"
                                value={skillGroup.category}
                                onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                                className="w-full input-field"
                                placeholder="Programming Languages, Frameworks, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-[rgb(var(--muted))] text-sm mb-2">Skills (comma separated)</label>
                              <textarea
                                value={(skillGroup.items || []).join(', ')}
                                onChange={(e) => updateSkillCategory(index, 'items', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                rows={3}
                                className="w-full input-field"
                                placeholder="JavaScript, React, Node.js, Python, etc."
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingSection(null);
                                  setEditingIndex(null);
                                }}
                                className="btn-secondary flex items-center space-x-2"
                              >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                              <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-[rgb(var(--fg))] font-medium">{skillGroup.category || 'New Skill Category'}</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(skillGroup.items || []).map((skill, i) => (
                                  <span key={i} className="bg-[rgb(var(--accent-600))]/20 text-[rgb(var(--accent-600))] px-2 py-1 rounded text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex shrink-0 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-1 gap-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSection('skills');
                                  setEditingIndex(index);
                                }}
                                className="p-2 rounded-md text-blue-500 hover:bg-blue-500/20 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSkillCategory(index)}
                                className="p-2 rounded-md text-red-500 hover:bg-red-500/20 transition-colors"
                                title="Delete"
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
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[rgb(var(--fg))] flex items-center space-x-3">
                        <Layers className="w-6 h-6 text-purple-400" />
                        <span>Custom Sections</span>
                      </h2>
                      <p className="text-[rgb(var(--muted))] mt-1">Add and organize custom sections for your portfolio</p>
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
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-[rgb(var(--fg))]">
                        {editedResumeData.customSections?.length || 0}
                      </div>
                      <div className="text-[rgb(var(--muted))] text-sm">Custom Sections</div>
                    </div>
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-[rgb(var(--fg))]">
                        {(() => {
                          const defaultSectionIds = ['summary','experience','education','skills','projects','certifications'];
                          const customCount = editedResumeData.customSections?.length || 0;
                          return defaultSectionIds.length + customCount;
                        })()}
                      </div>
                      <div className="text-[rgb(var(--muted))] text-sm">Total Sections</div>
                    </div>
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-[rgb(var(--fg))]">
                        {(() => {
                          const defaultSectionIds = ['summary','experience','education','skills','projects','certifications'];
                          const customCount = editedResumeData.customSections?.length || 0;
                          const total = defaultSectionIds.length + customCount;
                          const hidden = editedPersonalization?.hiddenSections?.length || 0;
                          return Math.max(total - hidden, 0);
                        })()}
                      </div>
                      <div className="text-[rgb(var(--muted))] text-sm">Visible Sections</div>
                    </div>
                  </div>
                </div>

                {/* Section Headings Customization */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[rgb(var(--fg))] flex items-center space-x-3">
                        <Edit className="w-5 h-5 text-purple-400" />
                        <span>Section Headings</span>
                      </h3>
                      <p className="text-[rgb(var(--muted))] mt-1">
                        {editedPersonalization?.templateId === 'developer-terminal' 
                          ? 'Section headings are not customizable for this template'
                          : 'Customize section headings to match your profession'
                        }
                      </p>
                    </div>
                    {editedPersonalization?.templateId === 'developer-terminal' ? (
                      <span className="text-[rgb(var(--muted))] px-4 py-2 rounded-lg bg-[rgb(var(--border))]/40">
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
                      <div key={key} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-3">
                        <div className="text-sm text-[rgb(var(--muted))] capitalize">{key}</div>
                        <div className="text-[rgb(var(--fg))] font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template Text Customization */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[rgb(var(--fg))] flex items-center space-x-3">
                        <Type className="w-5 h-5 text-purple-400" />
                        <span>Template Text</span>
                      </h3>
                      <p className="text-[rgb(var(--muted))] mt-1">
                        {editedPersonalization?.templateId === 'developer-terminal' 
                          ? 'Template text is not customizable for this template'
                          : 'Customize template-specific text content'
                        }
                      </p>
                    </div>
                    {editedPersonalization?.templateId === 'developer-terminal' ? (
                      <span className="text-[rgb(var(--muted))] px-4 py-2 rounded-lg bg-[rgb(var(--border))]/40">
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
                      <div key={key} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-3">
                        <div className="text-sm text-[rgb(var(--muted))] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-[rgb(var(--fg))] font-medium text-sm truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Manager */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[rgb(var(--fg))] mb-6">Section Manager</h3>
                  
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
                    sectionRenderStyle={editedPersonalization?.sectionRenderStyle || {}}
                    onSectionRenderStyleChange={(styleMap) => {
                      if (editedPersonalization) {
                        setEditedPersonalization({
                          ...editedPersonalization,
                          sectionRenderStyle: styleMap
                        });
                      }
                    }}
                  />
                </div>

                {/* Live Preview */}
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[rgb(var(--fg))]">Live Preview</h3>
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
                        className="flex items-center space-x-1 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in New Tab</span>
                      </a>
                    </div>
                  </div>
                  
                  {/* iframe contains template so fixed elements cannot cover the sidebar */}
                  <iframe
                    src={`/${portfolio.slug}`}
                    title="Portfolio preview"
                    className="w-full border-0 rounded-lg"
                    style={{ height: '600px' }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[rgb(var(--fg))] mb-6">Portfolio Settings</h2>
                
                {/* Slug Editor */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[rgb(var(--fg))] mb-4">Custom URL</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-2">Portfolio URL Slug</label>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex">
                            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] border-r-0 rounded-l-lg px-3 py-2 text-[rgb(var(--muted))] text-sm">
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
                              className="flex-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-r-lg px-3 py-2 text-[rgb(var(--fg))] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                              placeholder="your-custom-slug"
                            />
                          </div>
                        </div>
                        {checkingSlug && <RefreshCw className="w-5 h-5 text-[rgb(var(--muted))] animate-spin" />}
                        {slugAvailable === true && editedSlug !== portfolio.slug && <Check className="w-5 h-5 text-green-400" />}
                        {slugAvailable === false && <span className="text-red-400 text-sm">Taken</span>}
                      </div>
                      {slugAvailable === false && (
                        <p className="text-red-600 text-sm mt-1">This URL is already taken. Please try a different one.</p>
                      )}
                      {slugAvailable === true && editedSlug !== portfolio.slug && (
                        <p className="text-green-600 text-sm mt-1">This URL is available!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[rgb(var(--fg))] mb-4">Privacy</h3>
                  <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[rgb(var(--fg))] font-medium">Portfolio Visibility</div>
                        <div className="text-[rgb(var(--muted))] text-sm">Your portfolio is currently public and searchable</div>
                      </div>
                      <div className="text-green-600 font-medium">Public</div>
                    </div>
                    <div className="border-t border-[rgb(var(--border))] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-[rgb(var(--fg))] font-medium">Download Your Data</div>
                        <div className="text-[rgb(var(--muted))] text-sm">Export your account, portfolio, resume, jobs, and notification data as JSON.</div>
                      </div>
                      <button
                        type="button"
                        onClick={exportAccountData}
                        disabled={privacyActionLoading !== null}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        {privacyActionLoading === 'export' ? 'Exporting...' : 'Export Data'}
                      </button>
                    </div>
                    <div className="border-t border-[rgb(var(--border))] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-[rgb(var(--fg))] font-medium">Delete Account</div>
                        <div className="text-[rgb(var(--muted))] text-sm">Permanently delete your login and all account data. Signing in again starts a new account. This cannot be undone.</div>
                      </div>
                      <button
                        type="button"
                        onClick={deleteAccountData}
                        disabled={privacyActionLoading !== null}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        {privacyActionLoading === 'delete' ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Update from Resume */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[rgb(var(--fg))] mb-4">Update from Resume</h3>
                  <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-[rgb(var(--muted))] text-sm">Upload a new resume to refresh your portfolio content.</div>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 text-[rgb(var(--muted))] text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="resume-update-mode"
                            checked={resumeUpdateMode === 'merge'}
                            onChange={() => setResumeUpdateMode('merge')}
                          />
                          <span>Merge</span>
                        </label>
                        <label className="inline-flex items-center gap-2 text-[rgb(var(--muted))] text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="resume-update-mode"
                            checked={resumeUpdateMode === 'replace'}
                            onChange={() => setResumeUpdateMode('replace')}
                          />
                          <span>Replace</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleResumeUpdateUpload(file);
                          }
                          // Reset so same file can be reselected if needed
                          e.currentTarget.value = '' as any;
                        }}
                        disabled={resumeUpdateLoading}
                        className="hidden"
                        id="settings-resume-upload"
                      />
                      <label
                        htmlFor="settings-resume-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${resumeUpdateLoading ? 'bg-gray-600 text-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>{resumeUpdateLoading ? 'Processing…' : 'Upload Resume'}</span>
                      </label>
                      {resumeUpdateError && <span className="text-red-600 text-sm">{resumeUpdateError}</span>}
                    </div>

                    {resumeUpdateSummary && (
                      <div className="text-[rgb(var(--muted))] text-sm">
                        Parsed: {resumeUpdateSummary.experience} experience, {resumeUpdateSummary.projects} projects, {resumeUpdateSummary.education} education, {resumeUpdateSummary.skills} skill groups.
                      </div>
                    )}

                    {resumeUpdateMode === 'merge' && resumeMergePreview && (
                      <div className="mt-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg">
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="text-[rgb(var(--fg))] font-medium">Merge Preview</div>
                          <button
                            type="button"
                            onClick={() => setShowMergePreview(v => !v)}
                            className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                          >
                            {showMergePreview ? 'Hide details' : 'Show details'}
                          </button>
                        </div>
                        <div className="px-3 pb-3 text-sm text-[rgb(var(--muted))] space-y-2">
                          <div>
                            <span className="text-[rgb(var(--fg))]">Experience:</span> +{resumeMergePreview.experience.toAdd.length} new, {resumeMergePreview.experience.duplicates.length} duplicates
                          </div>
                          <div>
                            <span className="text-[rgb(var(--fg))]">Projects:</span> +{resumeMergePreview.projects.toAdd.length} new, {resumeMergePreview.projects.duplicates.length} duplicates
                          </div>
                          <div>
                            <span className="text-[rgb(var(--fg))]">Education:</span> +{resumeMergePreview.education.toAdd.length} new, {resumeMergePreview.education.duplicates.length} duplicates
                          </div>
                          <div>
                            <span className="text-[rgb(var(--fg))]">Skills:</span> +{resumeMergePreview.skills.newCategories.length} new categories, +{resumeMergePreview.skills.addedItems.reduce((n, g) => n + g.items.length, 0)} new items, {resumeMergePreview.skills.duplicateItems.reduce((n, g) => n + g.items.length, 0)} duplicates
                          </div>

                          {showMergePreview && (
                            <div className="mt-2 space-y-3">
                              {/* Experience details */}
                              {(resumeMergePreview.experience.toAdd.length > 0 || resumeMergePreview.experience.duplicates.length > 0) && (
                                <div>
                                  <div className="text-white font-medium mb-1">Experience</div>
                                  {resumeMergePreview.experience.toAdd.length > 0 && (
                                    <div className="mb-1">
                                      <div className="text-green-400">To add</div>
                                      <ul className="list-disc list-inside">
                                        {resumeMergePreview.experience.toAdd.map((e, i) => (
                                          <li key={`exp-add-${i}`}>{e.position || e.title} @ {e.company} {e.startDate ? `(${e.startDate})` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {resumeMergePreview.experience.duplicates.length > 0 && (
                                    <div>
                                      <div className="text-gray-400">Duplicates</div>
                                      <ul className="list-disc list-inside text-gray-400">
                                        {resumeMergePreview.experience.duplicates.map((e, i) => (
                                          <li key={`exp-dup-${i}`}>{e.position || e.title} @ {e.company} {e.startDate ? `(${e.startDate})` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Projects details */}
                              {(resumeMergePreview.projects.toAdd.length > 0 || resumeMergePreview.projects.duplicates.length > 0) && (
                                <div>
                                  <div className="text-white font-medium mb-1">Projects</div>
                                  {resumeMergePreview.projects.toAdd.length > 0 && (
                                    <div className="mb-1">
                                      <div className="text-green-400">To add</div>
                                      <ul className="list-disc list-inside">
                                        {resumeMergePreview.projects.toAdd.map((p, i) => (
                                          <li key={`proj-add-${i}`}>{p.name}{p.link || p.github ? ` – ${p.link || p.github}` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {resumeMergePreview.projects.duplicates.length > 0 && (
                                    <div>
                                      <div className="text-gray-400">Duplicates</div>
                                      <ul className="list-disc list-inside text-gray-400">
                                        {resumeMergePreview.projects.duplicates.map((p, i) => (
                                          <li key={`proj-dup-${i}`}>{p.name}{p.link || p.github ? ` – ${p.link || p.github}` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Education details */}
                              {(resumeMergePreview.education.toAdd.length > 0 || resumeMergePreview.education.duplicates.length > 0) && (
                                <div>
                                  <div className="text-white font-medium mb-1">Education</div>
                                  {resumeMergePreview.education.toAdd.length > 0 && (
                                    <div className="mb-1">
                                      <div className="text-green-400">To add</div>
                                      <ul className="list-disc list-inside">
                                        {resumeMergePreview.education.toAdd.map((e, i) => (
                                          <li key={`edu-add-${i}`}>{e.degree} @ {e.institution}{e.graduationDate ? ` – ${e.graduationDate}` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {resumeMergePreview.education.duplicates.length > 0 && (
                                    <div>
                                      <div className="text-gray-400">Duplicates</div>
                                      <ul className="list-disc list-inside text-gray-400">
                                        {resumeMergePreview.education.duplicates.map((e, i) => (
                                          <li key={`edu-dup-${i}`}>{e.degree} @ {e.institution}{e.graduationDate ? ` – ${e.graduationDate}` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Skills details */}
                              {(resumeMergePreview.skills.newCategories.length > 0 || resumeMergePreview.skills.addedItems.length > 0 || resumeMergePreview.skills.duplicateItems.length > 0) && (
                                <div>
                                  <div className="text-white font-medium mb-1">Skills</div>
                                  {resumeMergePreview.skills.newCategories.length > 0 && (
                                    <div className="mb-1">
                                      <div className="text-green-400">New categories</div>
                                      <ul className="list-disc list-inside">
                                        {resumeMergePreview.skills.newCategories.map((c, i) => (
                                          <li key={`skill-cat-add-${i}`}>{c.category} {c.items?.length ? `(${c.items.length})` : ''}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {resumeMergePreview.skills.addedItems.length > 0 && (
                                    <div className="mb-1">
                                      <div className="text-green-400">New items</div>
                                      <ul className="list-disc list-inside">
                                        {resumeMergePreview.skills.addedItems.map((g, i) => (
                                          <li key={`skill-add-${i}`}>
                                            <span className="text-white">{g.category}:</span> {g.items.join(', ')}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {resumeMergePreview.skills.duplicateItems.length > 0 && (
                                    <div>
                                      <div className="text-gray-400">Duplicates</div>
                                      <ul className="list-disc list-inside text-gray-400">
                                        {resumeMergePreview.skills.duplicateItems.map((g, i) => (
                                          <li key={`skill-dup-${i}`}>
                                            <span className="text-white/80">{g.category}:</span> {g.items.join(', ')}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {hasUnsavedChanges && (
                  <button
                    onClick={saveChanges}
                    disabled={saving || (editedSlug !== portfolio.slug && slugAvailable !== true)}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {activeTab !== 'cover-letter' && (
            <>
            {/* Current Template Preview */}
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[rgb(var(--fg))] mb-4">Current Template</h3>
              <div className="aspect-video bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg overflow-hidden">
                {renderTemplatePreview(portfolio.templateId)}
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-center">
                  <div className="text-sm font-medium text-[rgb(var(--fg))] capitalize">
                    {portfolio.templateId.replace('-', ' ')}
                  </div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {portfolio.personalization?.colorScheme && (
                      <span className="capitalize">{portfolio.personalization.colorScheme} theme</span>
                    )}
                  </div>
                </div>
                {hasUnsavedChanges ? (
                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={saving || (editedSlug !== portfolio.slug && slugAvailable !== true)}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2.5 rounded-lg transition-colors text-sm sm:text-base font-medium"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                ) : (
                  <a
                    href={`/${portfolio.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[rgb(var(--card))] hover:bg-[rgb(var(--border))]/40 border border-[rgb(var(--border))] text-[rgb(var(--fg))] py-2.5 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Live Portfolio
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Portfolio Info */}
            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[rgb(var(--fg))] mb-4">Portfolio Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--muted))]">Created:</span>
                  <span className="text-[rgb(var(--fg))]">{new Date(portfolio.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--muted))]">Last Updated:</span>
                  <span className="text-[rgb(var(--fg))]">{new Date(portfolio.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--muted))]">Template:</span>
                  <span className="text-[rgb(var(--fg))] capitalize">{portfolio.templateId.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--muted))]">Views:</span>
                  <span className="text-[rgb(var(--fg))]">{portfolio.views}</span>
                </div>
              </div>
            </div>
            </>
            )}
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
    </NavigationPadding>
  );
} 