'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, 
  Star, Zap, Heart, Target, Sparkles, ExternalLink, ArrowRight, 
  FileText, MapPin, GraduationCap, Building, Users, Trophy
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface ModernGlassmorphismTemplateProps {
  portfolio: DatabasePortfolio;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  glass: string;
  glow: string;
}

export function ModernGlassmorphismTemplate({ portfolio }: ModernGlassmorphismTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Theme color schemes
  const getThemeColors = (scheme: string): ThemeColors => {
    const themes: Record<string, ThemeColors> = {
      blue: {
        primary: 'from-blue-500 via-purple-500 to-indigo-600',
        secondary: 'from-blue-400 to-cyan-400',
        accent: 'text-blue-400',
        bg: 'bg-blue-50/50',
        glass: 'bg-blue-500/10 backdrop-blur-xl border-blue-200/20',
        glow: 'shadow-blue-500/25'
      },
      green: {
        primary: 'from-emerald-400 via-teal-500 to-green-600',
        secondary: 'from-green-400 to-emerald-400',
        accent: 'text-emerald-400',
        bg: 'bg-emerald-50/50',
        glass: 'bg-emerald-500/10 backdrop-blur-xl border-emerald-200/20',
        glow: 'shadow-emerald-500/25'
      },
      purple: {
        primary: 'from-purple-500 via-pink-500 to-violet-600',
        secondary: 'from-purple-400 to-pink-400',
        accent: 'text-purple-400',
        bg: 'bg-purple-50/50',
        glass: 'bg-purple-500/10 backdrop-blur-xl border-purple-200/20',
        glow: 'shadow-purple-500/25'
      },
      orange: {
        primary: 'from-orange-400 via-red-500 to-pink-600',
        secondary: 'from-orange-400 to-yellow-400',
        accent: 'text-orange-400',
        bg: 'bg-orange-50/50',
        glass: 'bg-orange-500/10 backdrop-blur-xl border-orange-200/20',
        glow: 'shadow-orange-500/25'
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

  // Header Section
  const renderHeader = () => (
    <header className="relative z-10 min-h-screen flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-90" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-30 animate-pulse`} />
        <div className={`absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-20 animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-25 animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Mouse follower */}
      <div 
        className={`fixed w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-300 ease-out z-0`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)'
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Name and Title */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
          <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
            {resumeData.contact?.name || 'Your Name'}
                </span>
              </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
          Professional Portfolio
              </p>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {resumeData.contact?.email && (
                  <a 
                    href={`mailto:${resumeData.contact.email}`}
              className={`flex items-center gap-2 ${themeColors.glass} px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-xl text-white hover:text-blue-300`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Mail className="w-5 h-5" />
              <span>{resumeData.contact.email}</span>
            </a>
          )}
          {resumeData.contact?.phone && (
            <a 
              href={`tel:${resumeData.contact.phone}`}
              className={`flex items-center gap-2 ${themeColors.glass} px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-xl text-white hover:text-blue-300`}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
              <Phone className="w-5 h-5" />
              <span>{resumeData.contact.phone}</span>
                  </a>
                )}
          {resumeData.contact?.location && (
            <div className={`flex items-center gap-2 ${themeColors.glass} px-6 py-3 rounded-full border text-white`}>
              <MapPin className="w-5 h-5" />
              <span>{resumeData.contact.location}</span>
            </div>
          )}
              </div>

              {/* Social Links */}
        <div className="flex justify-center gap-4">
          {resumeData.contact?.linkedin && (
            <a 
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 ${themeColors.glass} rounded-full border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-xl text-white hover:text-blue-300`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Linkedin className="w-6 h-6" />
                  </a>
                )}
          {resumeData.contact?.github && (
            <a 
              href={resumeData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 ${themeColors.glass} rounded-full border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-xl text-white hover:text-blue-300`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Github className="w-6 h-6" />
                  </a>
                )}
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mt-16 max-w-3xl mx-auto">
            <div className={`${themeColors.glass} p-8 rounded-3xl border backdrop-blur-xl`}>
              <p className="text-lg text-gray-200 leading-relaxed">
                {resumeData.summary}
              </p>
                    </div>
                  </div>
                )}
              </div>
    </header>
  );

  // Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                Experience
              </span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className={`${themeColors.glass} p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.position}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Building className={`w-5 h-5 ${themeColors.accent}`} />
                        <span className="text-xl text-gray-300">{exp.company}</span>
                    </div>
                      {exp.location && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className={`w-4 h-4 ${themeColors.accent}`} />
                          <span className="text-gray-400">{exp.location}</span>
                    </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4 lg:mt-0">
                      <Calendar className={`w-5 h-5 ${themeColors.accent}`} />
                      <span className="text-gray-300 font-medium">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                  </div>
                </div>

                  {exp.responsibilities && (
                    <div className="space-y-3">
                      {exp.responsibilities.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                          <p className="text-gray-300 leading-relaxed">{item}</p>
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

  // Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                Skills
                </span>
              </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
            </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeData.skills.map((skillCategory, index) => (
                <div 
                  key={index} 
                  className={`${themeColors.glass} p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-xl group`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.primary}`}>
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {skillCategory.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {skillCategory.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeColors.primary} flex-shrink-0`} />
                        <span className="text-gray-300">{item}</span>
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

  // Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                  Projects
                </span>
              </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
            </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {resumeData.projects.map((project, index) => (
                <div 
                  key={index} 
                  className={`${themeColors.glass} p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl group`}
                >
                      <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {project.name}
                      </h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${themeColors.secondary} text-white`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                          {project.link && (
                            <a 
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                          className={`p-2 ${themeColors.glass} rounded-full border transition-all duration-300 hover:scale-110 text-white hover:text-blue-300`}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          {project.github && (
                            <a 
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                          className={`p-2 ${themeColors.glass} rounded-full border transition-all duration-300 hover:scale-110 text-white hover:text-blue-300`}
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                  {project.description && (
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  )}
                  
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
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

  // Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                Education
                </span>
              </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
            </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div 
                  key={index} 
                  className={`${themeColors.glass} p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${themeColors.glow} hover:shadow-xl`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className={`w-6 h-6 ${themeColors.accent}`} />
                        <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                      </div>
                      <p className="text-xl text-gray-300 mb-2">{edu.institution}</p>
                      {edu.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${themeColors.accent}`} />
                          <span className="text-gray-400">{edu.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 lg:mt-0">
                      {edu.graduationDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-300 font-medium">
                            {formatDate(edu.graduationDate)}
                          </span>
                      </div>
                    )}
                      {edu.gpa && (
                        <p className="text-gray-300 mt-2">GPA: {edu.gpa}</p>
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

  // Achievements Section - Skip since not in ResumeData type
  const renderAchievementsSection = () => {
    return null;
  };

  // Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                Certifications
              </span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className={`${themeColors.glass} p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-xl`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.primary} flex-shrink-0`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{cert}</h3>
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

  // Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {section.title}
                  </span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className={`${themeColors.glass} p-8 rounded-3xl border backdrop-blur-xl`}>
              {section.type === 'text' && (
                <p className="text-gray-300 leading-relaxed text-lg">
                  {section.content}
                </p>
              )}
              
              {section.type === 'list' && (
                <ul className="space-y-3">
                  {section.items?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
                <div className="space-y-6">
                  {section.items?.map((item: any, index: number) => (
                    <div key={index} className="border-l-4 border-gradient-to-b from-blue-400 to-purple-500 pl-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 mb-2">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
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
      {/* Render Header */}
      {renderHeader()}
      
      {/* Render Sections in Order */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}
      
      {/* Footer */}
      <footer className="py-12 relative">
        <div className="container mx-auto px-8 text-center">
          <div className={`${themeColors.glass} p-8 rounded-3xl border backdrop-blur-xl max-w-2xl mx-auto`}>
            <p className="text-gray-300 text-lg">
              Thank you for viewing my portfolio!
            </p>
            <p className="text-gray-400 mt-2">
              Built with passion and modern web technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 