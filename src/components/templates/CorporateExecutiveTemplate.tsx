'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, Linkedin, MapPin, Award, TrendingUp, Users, 
  Building2, Calendar, ExternalLink, ChevronRight, Star,
  Target, Globe, BarChart3, Briefcase, GraduationCap,
  Quote, ArrowUpRight, Play, Pause, Volume2, VolumeX,
  Code
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';

interface CorporateExecutiveTemplateProps {
  portfolio: DatabasePortfolio;
}

export function CorporateExecutiveTemplate({ portfolio }: CorporateExecutiveTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { sectionHeadings, templateText } = personalization;
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  
  // Corporate color schemes
  const getThemeColors = (scheme: string) => {
    const colors = {
      blue: {
        primary: 'from-blue-900 via-blue-800 to-blue-900',
        secondary: 'from-blue-600 to-blue-800',
        accent: '#1e40af',
        text: 'text-blue-600',
        light: 'bg-blue-50',
        gradient: 'from-blue-100 to-blue-50'
      },
      purple: {
        primary: 'from-purple-900 via-purple-800 to-purple-900',
        secondary: 'from-purple-600 to-purple-800',
        accent: '#7c3aed',
        text: 'text-purple-600',
        light: 'bg-purple-50',
        gradient: 'from-purple-100 to-purple-50'
      },
      green: {
        primary: 'from-emerald-900 via-emerald-800 to-emerald-900',
        secondary: 'from-emerald-600 to-emerald-800',
        accent: '#059669',
        text: 'text-emerald-600',
        light: 'bg-emerald-50',
        gradient: 'from-emerald-100 to-emerald-50'
      },
      orange: {
        primary: 'from-orange-900 via-orange-800 to-orange-900',
        secondary: 'from-orange-600 to-orange-800',
        accent: '#ea580c',
        text: 'text-orange-600',
        light: 'bg-orange-50',
        gradient: 'from-orange-100 to-orange-50'
      },
      red: {
        primary: 'from-red-900 via-red-800 to-red-900',
        secondary: 'from-red-600 to-red-800',
        accent: '#dc2626',
        text: 'text-red-600',
        light: 'bg-red-50',
        gradient: 'from-red-100 to-red-50'
      }
    };
    return colors[scheme as keyof typeof colors] || colors.blue;
  };

  const colors = getThemeColors(personalization?.colorScheme || 'blue');
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  // Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;
    
    return (
      <section id="experience" className="py-24 bg-white fade-in-section">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getSectionHeading(sectionHeadings, 'experience')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b hidden lg:block" 
                 style={{ background: `linear-gradient(to bottom, ${colors.accent}, ${colors.accent}30)` }} />

            <div className="space-y-12">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-start space-x-8">
                    {/* Timeline Dot */}
                    <div className="hidden lg:flex w-16 h-16 rounded-full items-center justify-center relative z-10 shadow-lg" 
                         style={{ backgroundColor: colors.accent }}>
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.position}</h3>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <div className="flex items-center">
                              <Building2 className="w-5 h-5 mr-2" style={{ color: colors.accent }} />
                              <span className="font-semibold">{exp.company}</span>
                            </div>
                            {exp.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0">
                          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(exp.responsibilities || []).map((desc: string, descIndex: number) => (
                          <div key={descIndex} className="flex items-start space-x-3">
                            <ChevronRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                            <p className="text-gray-700 leading-relaxed">{desc}</p>
                          </div>
                        ))}
                      </div>
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

  // Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;
    
    return (
      <section id="skills" className={`py-24 bg-gradient-to-b ${colors.gradient} fade-in-section`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getSectionHeading(sectionHeadings, 'skills')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeData.skills.map((skillCategory, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">{skillCategory.category}</h3>
                </div>
                
                <div className="space-y-4">
                  {(skillCategory.items || []).map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{skill}</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star 
                            key={starIndex} 
                            className={`w-4 h-4 ${starIndex < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;
    
    return (
      <section id="projects" className="py-24 bg-white fade-in-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getSectionHeading(sectionHeadings, 'projects')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Globe className="w-4 h-4 text-gray-600" />
                      </a>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;
    
    return (
      <section id="education" className={`py-24 bg-gradient-to-b ${colors.gradient} fade-in-section`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getSectionHeading(sectionHeadings, 'education')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-500">
                      {edu.graduationDate ? formatDate(edu.graduationDate) : 'In Progress'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                <p className="text-lg font-semibold mb-2" style={{ color: colors.accent }}>{edu.institution}</p>
                {edu.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{edu.location}</span>
                  </div>
                )}
                {edu.gpa && (
                  <p className="text-gray-600">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;
    
    return (
      <section id="certifications" className="py-24 bg-white fade-in-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getSectionHeading(sectionHeadings, 'certifications')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 ml-4">{cert}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className={`py-24 bg-gradient-to-b ${colors.gradient} fade-in-section`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {section.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {section.type === 'text' && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {section.content}
              </p>
            )}
            
            {section.type === 'list' && (
              <div className="space-y-4">
                {section.items?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <ChevronRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}
            
            {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
              <div className="space-y-6">
                {section.items?.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderColor: colors.accent }}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-700 mb-2">{item.description}</p>
                    )}
                    {item.date && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
    <div className="min-h-screen bg-gray-50">
      {/* Executive Hero Section */}
      <section ref={heroRef} className={`min-h-screen bg-gradient-to-r ${colors.primary} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Column - Executive Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                  {resumeData.contact?.name || 'Executive Leader'}
                </h1>
                <p className="text-2xl lg:text-3xl text-white/80 font-light">
                  {getTemplateText(templateText, 'corporate-executive', 'tagline')}
                </p>
                <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl">
                  {resumeData.summary || 'Seasoned executive with proven track record of transforming organizations and delivering exceptional results through strategic vision and operational excellence.'}
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-6">
                {resumeData.contact?.email && (
                  <div className="flex items-center space-x-3 text-white/80">
                    <Mail className="w-5 h-5" />
                    <span>{resumeData.contact.email}</span>
                  </div>
                )}
                {resumeData.contact?.phone && (
                  <div className="flex items-center space-x-3 text-white/80">
                    <Phone className="w-5 h-5" />
                    <span>{resumeData.contact.phone}</span>
                  </div>
                )}
                {resumeData.contact?.location && (
                  <div className="flex items-center space-x-3 text-white/80">
                    <MapPin className="w-5 h-5" />
                    <span>{resumeData.contact.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Executive CTA */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  {getTemplateText(templateText, 'corporate-executive', 'ctaTitle')}
                </h2>
                <p className="text-white/80 text-lg">
                  {getTemplateText(templateText, 'corporate-executive', 'ctaDescription')}
                </p>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <button 
                    className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(`mailto:${resumeData.contact?.email}?subject=Executive Opportunity Inquiry`, '_blank')}
                  >
                    {getTemplateText(templateText, 'corporate-executive', 'ctaButtonText')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}

      {/* Executive Contact CTA */}
      <section className={`py-24 bg-gradient-to-r ${colors.primary} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black text-white">
              Ready to Lead the Future?
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Transform your organization with proven leadership expertise and strategic vision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href={`mailto:${resumeData.contact?.email}?subject=Executive Opportunity Discussion`}
                className="inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <Mail className="w-5 h-5" />
                <span>Schedule Strategy Session</span>
              </a>
              
              {resumeData.contact?.linkedin && (
                <a
                  href={resumeData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-in-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-30px,0); }
          70% { transform: translate3d(0,-15px,0); }
          90% { transform: translate3d(0,-4px,0); }
        }
      `}</style>
    </div>
  );
} 