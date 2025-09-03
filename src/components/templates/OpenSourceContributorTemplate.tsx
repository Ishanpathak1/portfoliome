'use client';

import { useState, useEffect } from 'react';
import { 
  Github, Users, Award, 
  ExternalLink, MessageSquare, Heart, Zap, Folder,
  Code2, Calendar, MapPin, Mail, Phone, Linkedin,
  Briefcase, GraduationCap, Activity, TrendingUp,
  Terminal, Bug, GitPullRequest, Shield, Eye
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';

interface OpenSourceContributorTemplateProps {
  portfolio: DatabasePortfolio;
}

interface GitHubColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
}

export function OpenSourceContributorTemplate({ portfolio }: OpenSourceContributorTemplateProps) {
  const { resumeData, personalization } = portfolio;
  

  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];
  const sectionRenderStyle = personalization?.sectionRenderStyle || {};

  // GitHub color schemes
  const getGitHubColors = (scheme: string): GitHubColors => {
    const palettes: Record<string, GitHubColors> = {
      blue: {
        primary: '#0969DA',
        secondary: '#218BFF',
        accent: '#54A3FF',
        success: '#1A7F37',
        warning: '#9A6700',
        error: '#DA3633',
        background: '#0D1117',
        surface: '#161B22',
        border: '#30363D',
        text: '#F0F6FC',
        textSecondary: '#7D8590'
      },
      purple: {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#C084FC',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        background: '#0F0A1A',
        surface: '#1A1625',
        border: '#2D2438',
        text: '#F8FAFC',
        textSecondary: '#94A3B8'
      },
      green: {
        primary: '#2EA043',
        secondary: '#3FB950',
        accent: '#56D364',
        success: '#238636',
        warning: '#D29922',
        error: '#F85149',
        background: '#0A0E0A',
        surface: '#15201B',
        border: '#1B2E20',
        text: '#F0F6FC',
        textSecondary: '#7D8590'
      },
      orange: {
        primary: '#FB8500',
        secondary: '#FFB627',
        accent: '#FFC947',
        success: '#39D353',
        warning: '#E36209',
        error: '#DA3633',
        background: '#1A0F00',
        surface: '#261A00',
        border: '#3D2914',
        text: '#F0F6FC',
        textSecondary: '#7D8590'
      }
    };
    return palettes[scheme] || palettes.blue;
  };

  const colors = getGitHubColors(personalization?.colorScheme || 'blue');

  // Remove fake/random GitHub stats generation

  // Header Section
  const renderHeader = () => (
    <header className="min-h-screen flex items-center justify-center px-8 relative" style={{ backgroundColor: colors.background }}>
      {/* GitHub-style grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-1 h-full">
          {Array.from({ length: 144 }, (_, i) => (
            <div key={i} className="rounded-sm" style={{ backgroundColor: colors.border }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-block p-2 rounded-full mb-8" style={{ backgroundColor: colors.surface, border: `2px solid ${colors.border}` }}>
            <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Github className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: colors.text }}>
            {resumeData.contact?.name || getTemplateText(personalization?.templateText, 'open-source-contributor', 'fallbackName') || 'Open Source Contributor'}
          </h1>

          <div className="text-2xl md:text-3xl mb-8 font-mono" style={{ color: colors.secondary }}>
            {getTemplateText(personalization?.templateText, 'open-source-contributor', 'tagline') || 'Building the future, one commit at a time'}
          </div>

          {resumeData.summary && (
            <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              {resumeData.summary}
            </p>
          )}
        </div>

        {/* GitHub Stats removed to avoid fake numbers. Show nothing unless real data is provided. */}

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {resumeData.contact?.email && (
            <a
              href={`mailto:${resumeData.contact.email}`}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors hover:border-current"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            >
              <Mail className="w-5 h-5" />
              <span>{resumeData.contact.email}</span>
            </a>
          )}
          {resumeData.contact?.phone && (
            <a
              href={`tel:${resumeData.contact.phone}`}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors hover:border-current"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            >
              <Phone className="w-5 h-5" />
              <span>{resumeData.contact.phone}</span>
            </a>
          )}
          {resumeData.contact?.location && (
            <div className="flex items-center space-x-2 px-6 py-3 rounded-lg border"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            >
              <MapPin className="w-5 h-5" />
              <span>{resumeData.contact.location}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          {resumeData.contact?.github && (
            <a
              href={resumeData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <Github className="w-6 h-6 inline mr-2" />
              GitHub
            </a>
          )}
          {resumeData.contact?.linkedin && (
            <a
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-semibold text-lg border transition-colors hover:border-current"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            >
              <Linkedin className="w-6 h-6 inline mr-2" />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </header>
  );

  // Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: colors.text }}>
            {getSectionHeading(personalization?.sectionHeadings, 'experience')}
          </h2>

          <div className="space-y-8">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border rounded-lg p-8 transition-colors hover:border-current" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>{exp.position}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-5 h-5" style={{ color: colors.primary }} />
                      <span className="text-lg" style={{ color: colors.textSecondary }}>{exp.company}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center space-x-2" style={{ color: colors.textSecondary }}>
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                      <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                      <span className="font-mono text-sm" style={{ color: colors.text }}>
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                    </div>
                  </div>
                </div>

                {exp.responsibilities && (
                  <div className="space-y-3">
                    {exp.responsibilities.map((item, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.primary }} />
                        <p className="leading-relaxed" style={{ color: colors.textSecondary }}>{item}</p>
                      </div>
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

  // Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: colors.text }}>
            {getSectionHeading(personalization?.sectionHeadings, 'skills')}
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {resumeData.skills.map((skillCategory, index) => (
              <div key={index} className="border rounded-lg p-8 transition-colors hover:border-current" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: colors.text }}>{skillCategory.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillCategory.items.map((item, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}>
                      {item}
                    </span>
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
      <section className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: colors.text }}>
            {getSectionHeading(personalization?.sectionHeadings, 'projects')}
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="border rounded-lg overflow-hidden transition-colors hover:border-current" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="p-6 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold" style={{ color: colors.text }}>{project.name}</h3>
                    <div className="flex space-x-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors hover:bg-gray-700"
                          style={{ backgroundColor: colors.background }}
                        >
                          <Github className="w-5 h-5" style={{ color: colors.text }} />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors hover:bg-gray-700"
                          style={{ backgroundColor: colors.background }}
                        >
                          <ExternalLink className="w-5 h-5" style={{ color: colors.text }} />
                        </a>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
                      {project.description}
                    </p>
                  )}

                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm font-mono border"
                          style={{ 
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.text
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between" style={{ backgroundColor: colors.background }}>
                  {(project.startDate || project.endDate) && (
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {project.startDate ? formatDate(project.startDate) : ''} {project.endDate && `- ${formatDate(project.endDate)}`}
                    </div>
                  )}
                </div>
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
      <section className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: colors.text }}>
            {getSectionHeading(personalization?.sectionHeadings, 'education')}
          </h2>

          <div className="space-y-8">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border rounded-lg p-8 transition-colors hover:border-current" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>{edu.degree}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="w-5 h-5" style={{ color: colors.primary }} />
                      <span className="text-lg" style={{ color: colors.textSecondary }}>{edu.institution}</span>
                    </div>
                    {edu.location && (
                      <div className="flex items-center space-x-2" style={{ color: colors.textSecondary }}>
                        <MapPin className="w-4 h-4" />
                        <span>{edu.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0">
                    {edu.graduationDate && (
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                        <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                        <span className="font-mono text-sm" style={{ color: colors.text }}>
                          {formatDate(edu.graduationDate)}
                        </span>
                      </div>
                    )}
                    {edu.gpa && (
                      <p className="mt-2" style={{ color: colors.textSecondary }}>GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
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
      <section className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: colors.text }}>
            {getSectionHeading(personalization?.sectionHeadings, 'certifications')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="border rounded-lg p-6 transition-colors hover:border-current" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>{cert}</h3>
                  </div>
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
    const style = sectionRenderStyle[section.id] || 'grouped';
    return (
      <section className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: colors.text }}>
            {section.title}
          </h2>

          <div className={style === 'cards' ? '' : 'border rounded-lg p-8'} style={style === 'cards' ? undefined : { backgroundColor: colors.surface, borderColor: colors.border }}>
            {section.type === 'text' && (
              <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
                {section.content}
              </p>
            )}

            {section.type === 'list' && style === 'grouped' && (
              <ul className="space-y-4">
                {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.primary }} />
                    <span className="text-lg" style={{ color: colors.textSecondary }}>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.type === 'list' && style === 'cards' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                  <div key={index} className="rounded-lg p-4 border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: colors.primary }} />
                      <span style={{ color: colors.textSecondary }}>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'cards' && style === 'grouped' && (
              <div className="space-y-8">
                {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                  <div key={index} className="border-l-4 pl-6" style={{ borderLeftColor: colors.primary }}>
                    {item.title && (
                      <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="mb-4 text-lg" style={{ color: colors.textSecondary }}>{item.description}</p>
                    )}
                    {item.link && (
                      <div className="mt-2" style={{ color: colors.text }}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.9 3h3.6A4.5 4.5 0 0 1 21 7.5v3.6a1 1 0 1 1-2 0V7.5A2.5 2.5 0 0 0 16.5 5h-3.6a1 1 0 0 1 0-2z"/><path d="M7.5 21h3.6a1 1 0 1 0 0-2H7.5A2.5 2.5 0 0 1 5 16.5v-3.6a1 1 0 1 0-2 0v3.6A4.5 4.5 0 0 0 7.5 21z"/><path d="M8 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M15 15a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1z"/><path d="M20 4a1 1 0 0 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 4 4 0 0 1 4-4z"/></svg>
                          <span>Open link</span>
                        </a>
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center space-x-2" style={{ color: colors.textSecondary }}>
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === 'cards' && style === 'cards' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                  <div key={index} className="rounded-lg p-6 border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                    {item.title && (
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{item.description}</p>
                    )}
                    {item.link && (
                      <div className="mt-2 text-sm" style={{ color: colors.text }}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.9 3h3.6A4.5 4.5 0 0 1 21 7.5v3.6a1 1 0 1 1-2 0V7.5A2.5 2.5 0 0 0 16.5 5h-3.6a1 1 0 0 1 0-2z"/><path d="M7.5 21h3.6a1 1 0 1 0 0-2H7.5A2.5 2.5 0 0 1 5 16.5v-3.6a1 1 0 1 0-2 0v3.6A4.5 4.5 0 0 0 7.5 21z"/><path d="M8 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M15 15a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1z"/><path d="M20 4a1 1 0 0 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 4 4 0 0 1 4-4z"/></svg>
                          <span>Open link</span>
                        </a>
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center space-x-2 text-sm" style={{ color: colors.textSecondary }}>
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
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Render Header */}
      {renderHeader()}

      {/* Render Sections in Order */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}

      {/* Footer */}
      <footer className="py-20 px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="border rounded-lg p-12" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-4" style={{ color: colors.text }}>
              {getTemplateText(personalization?.templateText, 'open-source-contributor', 'footerTitle') || 'Open Source Enthusiast'}
            </h3>
            <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
              {getTemplateText(personalization?.templateText, 'open-source-contributor', 'footerDescription') || 'Passionate about building tools that make developers\' lives easier'}
            </p>
            <div className="flex justify-center gap-6">
              <div className="px-6 py-3 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                <Github className="w-6 h-6 mx-auto" style={{ color: colors.primary }} />
              </div>
              {/* Removed star icon to avoid fake ratings */}
              <div className="px-6 py-3 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                <Users className="w-6 h-6 mx-auto" style={{ color: colors.success }} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 