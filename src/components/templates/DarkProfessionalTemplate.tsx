'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, ExternalLink, Briefcase, GraduationCap, Code, Award, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { formatDate, formatExperienceDateRange, formatGraduationDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { ResponsibilityText } from '@/components/ResponsibilityText';

interface DarkProfessionalTemplateProps {
  portfolio: DatabasePortfolio;
}

export function DarkProfessionalTemplate({ portfolio }: DarkProfessionalTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { sectionHeadings } = personalization;
  const { contact, summary, experience, education, skills, projects, certifications } = resumeData;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Color scheme based on personalization
  const colors = {
    blue: { accent: '#3B82F6', light: '#60A5FA', border: '#1E40AF' },
    green: { accent: '#10B981', light: '#34D399', border: '#047857' },
    purple: { accent: '#8B5CF6', light: '#A78BFA', border: '#6D28D9' },
    orange: { accent: '#F59E0B', light: '#FBBF24', border: '#D97706' },
    red: { accent: '#EF4444', light: '#F87171', border: '#DC2626' },
  };

  const currentColors = colors[personalization?.colorScheme as keyof typeof colors] || colors.blue;
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];
  const sectionRenderStyle = personalization?.sectionRenderStyle || {};

  // Experience Section
  const renderExperienceSection = () => {
    if (!experience?.length) return null;
    
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <Briefcase className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {getSectionHeading(sectionHeadings, 'experience')}
        </h2>
        <div className="space-y-8">
          {experience.map((job, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{job.position}</h3>
                  <p className="text-lg" style={{ color: currentColors.accent }}>{job.company}</p>
                  {job.location && (
                    <p className="text-gray-400 text-sm">{job.location}</p>
                  )}
                </div>
                <div className="mt-3 sm:mt-0 flex items-center text-gray-400 text-sm bg-gray-900/40 rounded-md px-2 py-1 self-start sm:self-auto">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="whitespace-nowrap">
                    {formatExperienceDateRange(job)}
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {(job.responsibilities || []).map((item, descIndex) => (
                  <li key={descIndex} className="text-gray-300 flex items-start">
                    <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: currentColors.accent }}></span>
                    <ResponsibilityText text={item} as="span" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Skills Section
  const renderSkillsSection = () => {
    if (!skills?.length) return null;
    
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <Code className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {getSectionHeading(sectionHeadings, 'skills')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillCategory, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold mb-3 text-white">{skillCategory.category}</h3>
              <div className="flex flex-wrap gap-2">
                {(skillCategory.items || []).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border"
                    style={{ borderColor: currentColors.accent }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Projects Section
  const renderProjectsSection = () => {
    if (!projects?.length) return null;
    
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <Code className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {getSectionHeading(sectionHeadings, 'projects')}
        </h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 shadow-md w-full sm:w-auto"
                      style={{ backgroundColor: currentColors.accent }}
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
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md w-full sm:w-auto"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Code</span>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-gray-300 mb-4">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300 border"
                      style={{ borderColor: currentColors.accent }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Education Section
  const renderEducationSection = () => {
    if (!education?.length) return null;
    
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <GraduationCap className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {getSectionHeading(sectionHeadings, 'education')}
        </h2>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                  <p className="text-lg" style={{ color: currentColors.accent }}>{edu.institution}</p>
                  {edu.location && (
                    <p className="text-gray-400 text-sm">{edu.location}</p>
                  )}
                </div>
                <div className="mt-3 sm:mt-0 flex items-center text-gray-400 text-sm bg-gray-900/40 rounded-md px-2 py-1 self-start sm:self-auto">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="whitespace-nowrap">
                    {formatGraduationDate(edu.graduationDate)}
                  </span>
                </div>
              </div>
              {edu.gpa && (
                <p className="text-gray-300 mt-2">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Certifications Section
  const renderCertificationsSection = () => {
    if (!certifications?.length) return null;
    
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <Award className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {getSectionHeading(sectionHeadings, 'certifications')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start">
                <Award className="w-6 h-6 mr-3 mt-1" style={{ color: currentColors.accent }} />
                <div>
                  <h3 className="text-lg font-semibold text-white break-words break-all sm:break-normal">{cert}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Custom Section Renderer
  const renderCustomSection = (section: any) => {
    const style = sectionRenderStyle[section.id] || 'grouped';
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <Award className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {section.title}
        </h2>
        <div className={style === 'cards' ? '' : 'bg-gray-800 rounded-lg p-6 border border-gray-700'}>
          {section.type === 'text' && (
            <p className="text-gray-300 leading-relaxed">
              {section.content}
            </p>
          )}

          {section.type === 'list' && style === 'grouped' && (
            <ul className="space-y-2">
              {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: currentColors.accent }}></span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.type === 'list' && style === 'cards' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: currentColors.accent }}></span>
                    <span className="text-gray-300">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.type === 'cards' && style === 'grouped' && (
            <div className="space-y-4">
              {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                <div key={index} className="border-l-4 pl-6" style={{ borderColor: currentColors.accent }}>
                  {item.title && (
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-gray-300 mt-1">{item.description}</p>
                  )}
                  {item.link && (
                    <div className="mt-2 text-gray-300">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.9 3h3.6A4.5 4.5 0 0 1 21 7.5v3.6a1 1 0 1 1-2 0V7.5A2.5 2.5 0 0 0 16.5 5h-3.6a1 1 0 0 1 0-2z"/><path d="M7.5 21h3.6a1 1 0 1 0 0-2H7.5A2.5 2.5 0 0 1 5 16.5v-3.6a1 1 0 1 0-2 0v3.6A4.5 4.5 0 0 0 7.5 21z"/><path d="M8 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M15 15a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1z"/><path d="M20 4a1 1 0 0 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 4 4 0 0 1 4-4z"/></svg>
                        <span>Open link</span>
                      </a>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                      <Calendar className="w-4 h-4 mr-1" />
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
                <div key={index} className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                  {item.title && (
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  )}
                  {item.link && (
                    <div className="mt-2 text-gray-300 text-sm">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.9 3h3.6A4.5 4.5 0 0 1 21 7.5v3.6a1 1 0 1 1-2 0V7.5A2.5 2.5 0 0 0 16.5 5h-3.6a1 1 0 0 1 0-2z"/><path d="M7.5 21h3.6a1 1 0 1 0 0-2H7.5A2.5 2.5 0 0 1 5 16.5v-3.6a1 1 0 1 0-2 0v3.6A4.5 4.5 0 0 0 7.5 21z"/><path d="M8 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M15 15a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1z"/><path d="M20 4a1 1 0 0 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 4 4 0 0 1 4-4z"/></svg>
                        <span>Open link</span>
                      </a>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex items-center text-gray-400 text-xs mt-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && style === 'grouped' && (
            <div className="space-y-4">
              {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                <div key={index} className="border-l-4 pl-6" style={{ borderColor: currentColors.accent }}>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-300 mt-1">{item.description}</p>
                  )}
                  {item.date && (
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && style === 'cards' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                <div key={index} className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  )}
                  {item.date && (
                    <div className="flex items-center text-gray-400 text-xs mt-3">
                      <Calendar className="w-4 h-4 mr-1" />
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
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 shadow-lg transition-all duration-300 lg:hidden"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-80 bg-gray-800 min-h-screen p-4 lg:p-8 border-r border-gray-700 fixed top-0 left-0 lg:static h-full z-40 transition-transform duration-300 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: currentColors.accent }}>
                {contact?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">{contact?.name || 'John Doe'}</h1>
            <p className="text-gray-400 text-sm mb-4">Professional Portfolio</p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-left">
              {contact?.email && (
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact?.phone && (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact?.location && (
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <span className="text-gray-400">{contact.location}</span>
                </div>
              )}
              {contact?.linkedin && (
                <div className="flex items-center space-x-3 text-sm">
                  <Linkedin className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </div>
              )}
              {contact?.github && (
                <div className="flex items-center space-x-3 text-sm">
                  <Github className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </div>
              )}
              {contact?.website && (
                <div className="flex items-center space-x-3 text-sm">
                  <Globe className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills in Sidebar */}
          {skills && skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-600">{getSectionHeading(sectionHeadings, 'skills')}</h3>
              <div className="space-y-4">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-2 text-gray-300">{skillCategory.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border"
                          style={{ borderColor: currentColors.accent }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-12 lg:ml-0 w-full mx-auto max-w-3xl lg:max-w-none lg:mx-0">
          {/* About Section */}
          {summary && (
            <section className="mb-8 lg:mb-12">
              <div className="flex justify-center lg:justify-start">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 pb-2 lg:pb-3 border-b border-gray-700">About</h2>
              </div>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Dynamic Sections */}
          {sectionOrder.map((sectionId) => (
            <div key={sectionId}>
              {renderSection(sectionId)}
            </div>
          ))}

          {/* Footer */}
          <footer className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {contact?.name || 'Professional Portfolio'}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
} 