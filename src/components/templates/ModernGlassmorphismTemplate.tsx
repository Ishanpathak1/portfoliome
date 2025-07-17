'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, 
  Star, Zap, Heart, Target, Sparkles, ExternalLink, ArrowRight, 
  FileText, MapPin, GraduationCap, Building, Users, Trophy, Globe
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';

interface ModernGlassmorphismTemplateProps {
  portfolio: DatabasePortfolio;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  glass: string;
  glassDark: string;
  glow: string;
  text: string;
  textSecondary: string;
}

export function ModernGlassmorphismTemplate({ portfolio }: ModernGlassmorphismTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { sectionHeadings } = personalization;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Enhanced theme color schemes
  const getThemeColors = (scheme: string): ThemeColors => {
    const themes: Record<string, ThemeColors> = {
      blue: {
        primary: 'from-blue-400 via-indigo-500 to-purple-600',
        secondary: 'from-cyan-400 via-blue-500 to-indigo-600',
        accent: 'text-blue-400',
        bg: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-blue-500/20',
        text: 'text-blue-100',
        textSecondary: 'text-blue-200'
      },
      green: {
        primary: 'from-emerald-400 via-teal-500 to-cyan-600',
        secondary: 'from-green-400 via-emerald-500 to-teal-600',
        accent: 'text-emerald-400',
        bg: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-emerald-500/20',
        text: 'text-emerald-100',
        textSecondary: 'text-emerald-200'
      },
      purple: {
        primary: 'from-purple-400 via-pink-500 to-rose-600',
        secondary: 'from-violet-400 via-purple-500 to-pink-600',
        accent: 'text-purple-400',
        bg: 'bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-purple-500/20',
        text: 'text-purple-100',
        textSecondary: 'text-purple-200'
      },
      orange: {
        primary: 'from-orange-400 via-amber-500 to-yellow-600',
        secondary: 'from-red-400 via-orange-500 to-amber-600',
        accent: 'text-orange-400',
        bg: 'bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-orange-500/20',
        text: 'text-orange-100',
        textSecondary: 'text-orange-200'
      }
    };
    return themes[scheme] || themes.blue;
  };

  const themeColors = getThemeColors(personalization?.colorScheme || 'blue');
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  // Enhanced Header Section
  const renderHeader = () => (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
      </div>
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-20 animate-pulse`} />
        <div className={`absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-15 animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-10 right-1/3 w-48 h-48 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '3s' }} />
      </div>

      {/* Interactive Mouse Follower */}
      <div 
        className={`fixed w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-5 pointer-events-none transition-all duration-700 ease-out z-0`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
          opacity: isHovering ? 0.15 : 0.05
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${themeColors.primary} rounded-full animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        {/* Enhanced Hero Content */}
        <div className={`${themeColors.glassDark} rounded-3xl p-12 border backdrop-blur-3xl`}>
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${themeColors.primary} p-1 animate-pulse`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {resumeData.contact?.name || 'Your Name'}
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
              {resumeData.experience?.[0]?.position || 'Professional Portfolio'}
            </p>

            {/* Enhanced Summary */}
            {resumeData.summary && (
              <div className={`${themeColors.glass} rounded-2xl p-8 border backdrop-blur-2xl mb-8`}>
                <p className="text-lg text-gray-200 leading-relaxed">
                  {resumeData.summary}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {resumeData.contact?.email && (
              <a 
                href={`mailto:${resumeData.contact.email}`}
                className={`group flex items-center gap-3 ${themeColors.glass} px-8 py-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-2xl text-white`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{resumeData.contact.email}</span>
              </a>
            )}
            {resumeData.contact?.phone && (
              <a 
                href={`tel:${resumeData.contact.phone}`}
                className={`group flex items-center gap-3 ${themeColors.glass} px-8 py-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-2xl text-white`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{resumeData.contact.phone}</span>
              </a>
            )}
            {resumeData.contact?.location && (
              <div className={`flex items-center gap-3 ${themeColors.glass} px-8 py-4 rounded-2xl border text-white`}>
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{resumeData.contact.location}</span>
              </div>
            )}
          </div>

          {/* Enhanced Social Links */}
          <div className="flex justify-center gap-6">
            {resumeData.contact?.linkedin && (
              <a 
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-2xl text-white`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Linkedin className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            )}
            {resumeData.contact?.github && (
              <a 
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-2xl text-white`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Github className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            )}
            {resumeData.contact?.website && (
              <a 
                href={resumeData.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-2xl text-white`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Globe className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Enhanced Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-40 right-20 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'experience')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">{exp.position}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Building className={`w-6 h-6 ${themeColors.accent}`} />
                            <span className="text-2xl text-gray-300 font-semibold">{exp.company}</span>
                          </div>
                        </div>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-400">{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-3 mt-4 lg:mt-0 ${themeColors.glassDark} px-6 py-3 rounded-2xl border`}>
                      <Calendar className={`w-5 h-5 ${themeColors.accent}`} />
                      <span className="text-gray-300 font-medium">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                    </div>
                  </div>

                  {exp.responsibilities && (
                    <div className="space-y-4">
                      {exp.responsibilities.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                          <p className="text-gray-300 leading-relaxed text-lg">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'skills')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumeData.skills.map((skillCategory, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-105 ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {skillCategory.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {skillCategory.items.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-4 ${themeColors.glassDark} rounded-xl border transition-all duration-300 hover:scale-105`}>
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} flex-shrink-0`} />
                        <span className="text-gray-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-40 left-10 w-80 h-80 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'projects')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {resumeData.projects.map((project, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.secondary} shadow-lg`}>
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-3 mb-6">
                          {project.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className={`px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r ${themeColors.secondary} text-white shadow-lg`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 ml-6">
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/btn p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
                        >
                          <ExternalLink className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/btn p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
                        >
                          <Github className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                      {project.description}
                    </p>
                  )}
                  
                  {(project.startDate || project.endDate) && (
                    <div className={`flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border`}>
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400 font-medium">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 right-20 w-72 h-72 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'education')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">{edu.degree}</h3>
                          <p className="text-2xl text-gray-300 font-semibold">{edu.institution}</p>
                        </div>
                      </div>
                      {edu.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-400">{edu.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 lg:mt-0">
                      {edu.graduationDate && (
                        <div className={`flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border`}>
                          <Calendar className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-300 font-medium">
                            {formatDate(edu.graduationDate)}
                          </span>
                        </div>
                      )}
                      {edu.gpa && (
                        <p className="text-gray-300 mt-3 font-medium">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-40 left-1/3 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-40 right-1/3 w-80 h-80 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                Certifications
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-105 ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">{cert}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 right-1/4 w-72 h-72 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {section.title}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className={`${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl`}>
              {section.type === 'text' && (
                <p className="text-gray-300 leading-relaxed text-xl">
                  {section.content}
                </p>
              )}
              
              {section.type === 'list' && (
                <ul className="space-y-4">
                  {section.items?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                      <span className="text-gray-300 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
                <div className="space-y-6">
                  {section.items?.map((item: any, index: number) => (
                    <div key={index} className={`border-l-4 border-gradient-to-b ${themeColors.primary} pl-6 py-4`}>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 mb-3 text-lg">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Parallax Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-20 animate-pulse`}
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className={`absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-20 animate-pulse`}
          style={{ 
            transform: `translateY(${scrollY * -0.3}px)`,
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Render Header */}
      {renderHeader()}
      
      {/* Render Sections in Order */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}
      
      {/* Enhanced Footer */}
      <footer className="py-20 relative overflow-hidden">
        {/* Footer Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>
        
        <div className="container mx-auto px-8 text-center relative z-10">
          <div className={`${themeColors.glass} rounded-3xl p-12 border backdrop-blur-2xl max-w-3xl mx-auto`}>
            <div className="flex justify-center mb-8">
              <div className={`p-6 rounded-full bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">
              Thank you for viewing my portfolio!
            </h3>
            <p className="text-gray-300 text-xl mb-8">
              Built with passion and modern web technologies
            </p>
            <div className="flex justify-center gap-6">
              <div className={`px-6 py-3 ${themeColors.glassDark} rounded-2xl border`}>
                <Sparkles className={`w-6 h-6 ${themeColors.accent} animate-pulse`} />
              </div>
              <div className={`px-6 py-3 ${themeColors.glassDark} rounded-2xl border`}>
                <Zap className={`w-6 h-6 ${themeColors.accent} animate-pulse`} />
              </div>
              <div className={`px-6 py-3 ${themeColors.glassDark} rounded-2xl border`}>
                <Trophy className={`w-6 h-6 ${themeColors.accent} animate-pulse`} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 