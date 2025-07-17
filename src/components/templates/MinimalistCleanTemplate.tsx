'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Github, Linkedin, MapPin, ExternalLink, Sun, Moon, Code, Briefcase, User, Award, FolderOpen, GraduationCap, Menu, X, Calendar, Building, Trophy } from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';

interface MinimalistCleanTemplateProps {
  portfolio: DatabasePortfolio;
}

export function MinimalistCleanTemplate({ portfolio }: MinimalistCleanTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for sections
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);

  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'about', 'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  const getThemeColors = (scheme: string) => {
    const colorMap = {
      blue: {
        primary: '#2563eb',
        accent: '#dbeafe',
        hover: '#eff6ff',
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        bgAccent: 'bg-blue-100',
        bgHover: 'bg-blue-50',
        border: 'border-blue-600'
      },
      green: {
        primary: '#059669',
        accent: '#d1fae5',
        hover: '#ecfdf5',
        text: 'text-emerald-600',
        bg: 'bg-emerald-600',
        bgAccent: 'bg-emerald-100',
        bgHover: 'bg-emerald-50',
        border: 'border-emerald-600'
      },
      purple: {
        primary: '#9333ea',
        accent: '#f3e8ff',
        hover: '#faf5ff',
        text: 'text-purple-600',
        bg: 'bg-purple-600',
        bgAccent: 'bg-purple-100',
        bgHover: 'bg-purple-50',
        border: 'border-purple-600'
      },
      orange: {
        primary: '#ea580c',
        accent: '#fed7aa',
        hover: '#fff7ed',
        text: 'text-orange-600',
        bg: 'bg-orange-600',
        bgAccent: 'bg-orange-100',
        bgHover: 'bg-orange-50',
        border: 'border-orange-600'
      },
      red: {
        primary: '#dc2626',
        accent: '#fecaca',
        hover: '#fef2f2',
        text: 'text-red-600',
        bg: 'bg-red-600',
        bgAccent: 'bg-red-100',
        bgHover: 'bg-red-50',
        border: 'border-red-600'
      }
    };
    return colorMap[scheme as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getThemeColors(personalization?.colorScheme || 'blue');

  // Navigation sections with icons
  const getSectionIcon = (sectionId: string) => {
    const iconMap: { [key: string]: any } = {
      about: User,
      experience: Briefcase,
      skills: Code,
      projects: FolderOpen,
      education: GraduationCap,
      certifications: Award,
      achievements: Trophy
    };
    return iconMap[sectionId] || User;
  };

  // Get section title
  const getSectionTitle = (sectionId: string) => {
    const titleMap: { [key: string]: string } = {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      education: 'Education',
      certifications: 'Certifications',
      achievements: 'Achievements'
    };
    return titleMap[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  };

  // Check if section has data
  const hasData = (sectionId: string) => {
    switch (sectionId) {
      case 'about': return true; // Always available
      case 'experience': return resumeData.experience && resumeData.experience.length > 0;
      case 'skills': return resumeData.skills && resumeData.skills.length > 0;
      case 'projects': return resumeData.projects && resumeData.projects.length > 0;
      case 'education': return resumeData.education && resumeData.education.length > 0;
      case 'certifications': return resumeData.certifications && resumeData.certifications.length > 0;
      default: 
        // Check if it's a custom section
        return customSections.some((section: any) => section.id === sectionId);
    }
  };

  // Get available sections based on section order and data availability
  const availableSections = sectionOrder
    .filter(sectionId => !hiddenSections.includes(sectionId) && hasData(sectionId))
    .map(sectionId => ({
      id: sectionId,
      title: getSectionTitle(sectionId),
      icon: getSectionIcon(sectionId)
    }));

  // Set section ref
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      const container = contentRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elementTop - 40,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const container = contentRef.current;
      const scrollTop = container.scrollTop;
      
      let currentSection = availableSections[0]?.id || 'about';
      
      availableSections.forEach(section => {
        const element = sectionRefs.current[section.id];
        if (element) {
          const elementTop = element.offsetTop - container.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollTop + 200 >= elementTop && scrollTop + 200 < elementBottom) {
            currentSection = section.id;
          }
        }
      });
      
      setActiveSection(currentSection);
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [availableSections]);

  // Section Renderers
  const renderAboutSection = () => (
    <section 
      id="about" 
      ref={setSectionRef('about')}
      className="pt-4 lg:pt-8"
    >
      <div className={`rounded-2xl p-4 lg:p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <User 
            className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3"
            style={{ color: colors.primary }}
          />
          {getSectionHeading(personalization?.sectionHeadings, 'summary') || 'About Me'}
        </h2>
        <p className={`text-base lg:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {resumeData.summary || getTemplateText(personalization?.templateText, 'minimalist-clean', 'fallbackSummary') || 'Passionate professional dedicated to creating exceptional solutions and delivering outstanding results.'}
        </p>
      </div>
    </section>
  );

  const renderExperienceSection = () => {
    if (!resumeData.experience || resumeData.experience.length === 0) return null;

    return (
      <section 
        id="experience" 
        ref={setSectionRef('experience')}
      >
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <Briefcase 
            className="w-8 h-8 mr-3"
            style={{ color: colors.primary }}
          />
          {getSectionHeading(personalization?.sectionHeadings, 'experience')}
        </h2>
        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border-l-4`}
              style={{ borderLeftColor: colors.primary }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {exp.position}
                  </h3>
                  <p 
                    className="text-lg font-semibold mb-1"
                    style={{ color: colors.primary }}
                  >
                    {exp.company}
                  </p>
                  {exp.location && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {exp.location}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </p>
                  {!exp.endDate && (
                    <span 
                      className="inline-block px-2 py-1 text-xs rounded-full mt-1"
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary 
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
              </div>
              {exp.responsibilities && (
                <ul className="space-y-2">
                  {exp.responsibilities.map((desc: string, i: number) => (
                    <li key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-start`}>
                      <span 
                        className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      ></span>
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkillsSection = () => {
    if (!resumeData.skills || resumeData.skills.length === 0) return null;

    return (
      <section 
        id="skills" 
        ref={setSectionRef('skills')}
      >
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <Code 
            className="w-8 h-8 mr-3"
            style={{ color: colors.primary }}
          />
          {getSectionHeading(personalization?.sectionHeadings, 'skills')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {resumeData.skills.map((skillGroup, index) => (
            <div key={index} className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <Code 
                  className="w-5 h-5 mr-2"
                  style={{ color: colors.primary }}
                />
                {skillGroup.category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {skillGroup.items.map((skill, i) => (
                  <div key={i} className={`p-2 text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'} rounded-lg`}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjectsSection = () => {
    if (!resumeData.projects || resumeData.projects.length === 0) return null;

    return (
      <section 
        id="projects" 
        ref={setSectionRef('projects')}
      >
        <h2 className={`text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <FolderOpen 
            className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3"
            style={{ color: colors.primary }}
          />
          {getSectionHeading(personalization?.sectionHeadings, 'projects')}
        </h2>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {resumeData.projects.map((project, index) => (
            <div key={index} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}>
              <div 
                className="h-3"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md"
                        style={{ 
                          backgroundColor: colors.primary, 
                          color: 'white' 
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Live</span>
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md ${
                          isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>View Code</span>
                      </a>
                    )}
                  </div>
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {project.description}
                </p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className={`px-2 py-1 text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-md`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducationSection = () => {
    if (!resumeData.education || resumeData.education.length === 0) return null;

    return (
      <section 
        id="education" 
        ref={setSectionRef('education')}
      >
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <GraduationCap 
            className="w-8 h-8 mr-3"
            style={{ color: colors.primary }}
          />
          {getSectionHeading(personalization?.sectionHeadings, 'education')}
        </h2>
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border-l-4`}
              style={{ borderLeftColor: colors.primary }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {edu.degree}
                  </h3>
                  <p 
                    className="text-lg font-semibold mb-1"
                    style={{ color: colors.primary }}
                  >
                    {edu.institution}
                  </p>
                  {edu.location && (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {edu.location}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {edu.graduationDate && (
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDate(edu.graduationDate)}
                    </p>
                  )}
                  {edu.gpa && (
                    <p 
                      className="text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertificationsSection = () => {
    if (!resumeData.certifications || resumeData.certifications.length === 0) return null;

    return (
      <section 
        id="certifications" 
        ref={setSectionRef('certifications')}
      >
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <Award 
            className="w-8 h-8 mr-3"
            style={{ color: colors.primary }}
          />
          {getSectionHeading(personalization?.sectionHeadings, 'certifications')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cert}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomSection = (section: any) => {
    return (
      <section 
        id={section.id} 
        ref={setSectionRef(section.id)}
      >
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <User 
            className="w-8 h-8 mr-3"
            style={{ color: colors.primary }}
          />
          {section.title}
        </h2>
        
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {section.type === 'text' && (
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {section.content}
            </p>
          )}
          
          {section.type === 'list' && (
            <ul className="space-y-3">
              {section.items?.map((item: string, index: number) => (
                <li key={index} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-start`}>
                  <span 
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          
          {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
            <div className="space-y-6">
              {section.items?.map((item: any, index: number) => (
                <div key={index} className={`border-l-4 pl-6`} style={{ borderLeftColor: colors.primary }}>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {item.description}
                    </p>
                  )}
                  {item.date && (
                    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  // Dynamic Section Renderer
  const renderSection = (sectionId: string) => {
    // Skip hidden sections
    if (hiddenSections.includes(sectionId)) {
      return null;
    }

    // Render standard sections
    switch (sectionId) {
      case 'about':
        return renderAboutSection();
      case 'experience':
        return renderExperienceSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      case 'education':
        return renderEducationSection();
      case 'certifications':
        return renderCertificationsSection();
      default:
        // Check if it's a custom section
        const customSection = customSections.find((section: any) => section.id === sectionId);
        if (customSection) {
          return renderCustomSection(customSection);
        }
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`fixed top-4 left-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 lg:hidden ${
          isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className={`w-80 fixed h-full transition-all duration-300 z-40 overflow-y-auto ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                {resumeData.contact?.name?.charAt(0) || 'U'}
              </div>
              <h1 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {resumeData.contact?.name || getTemplateText(personalization?.templateText, 'minimalist-clean', 'fallbackName') || 'Your Name'}
              </h1>
              <p 
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {resumeData.experience?.[0]?.position || getTemplateText(personalization?.templateText, 'minimalist-clean', 'fallbackPosition') || 'Professional'}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {availableSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        isActive
                          ? 'text-white shadow-md'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      style={isActive ? { backgroundColor: colors.primary } : {}}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Contact Info Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3 text-sm">
              {resumeData.contact?.email && (
                <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{resumeData.contact.email}</span>
                </div>
              )}
              {resumeData.contact?.phone && (
                <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.contact.phone}</span>
                </div>
              )}
              {resumeData.contact?.location && (
                <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.contact.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-4">
              {resumeData.contact?.linkedin && (
                <a 
                  href={resumeData.contact.linkedin} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {resumeData.contact?.github && (
                <a 
                  href={resumeData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80">
          <div 
            ref={contentRef}
            className="h-screen overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8 lg:space-y-16">
              {/* Render Sections in Order */}
              {sectionOrder.map((sectionId) => (
                <div key={sectionId}>
                  {renderSection(sectionId)}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 