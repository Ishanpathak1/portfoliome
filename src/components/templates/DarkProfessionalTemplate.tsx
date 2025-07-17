'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, ExternalLink, Briefcase, GraduationCap, Code, Award, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';

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
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{job.position}</h3>
                  <p className="text-lg" style={{ color: currentColors.accent }}>{job.company}</p>
                  {job.location && (
                    <p className="text-gray-400 text-sm">{job.location}</p>
                  )}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {formatDate(job.startDate)} - {job.endDate ? formatDate(job.endDate) : 'Present'}
                  </span>
                </div>
              </div>
              <ul className="space-y-2">
                {(job.responsibilities || []).map((item, descIndex) => (
                  <li key={descIndex} className="text-gray-300 flex items-start">
                    <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: currentColors.accent }}></span>
                    {item}
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                <div className="flex space-x-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 shadow-md"
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
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                  <p className="text-lg" style={{ color: currentColors.accent }}>{edu.institution}</p>
                  {edu.location && (
                    <p className="text-gray-400 text-sm">{edu.location}</p>
                  )}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {edu.graduationDate ? formatDate(edu.graduationDate) : 'In Progress'}
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
                  <h3 className="text-lg font-semibold text-white">{cert}</h3>
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
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
          <Award className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
          {section.title}
        </h2>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {section.type === 'text' && (
            <p className="text-gray-300 leading-relaxed">
              {section.content}
            </p>
          )}
          
          {section.type === 'list' && (
            <ul className="space-y-2">
              {section.items?.map((item: string, index: number) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: currentColors.accent }}></span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          
          {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
            <div className="space-y-4">
              {section.items?.map((item: any, index: number) => (
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 shadow-lg transition-all duration-300 lg:hidden"
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
        <div className={`w-80 bg-gray-800 min-h-screen p-4 lg:p-8 border-r border-gray-700 fixed lg:static h-full z-40 transition-transform duration-300 overflow-y-auto ${
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
        <div className="flex-1 p-4 lg:p-12 lg:ml-0">
          {/* About Section */}
          {summary && (
            <section className="mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 pb-2 lg:pb-3 border-b border-gray-700">About</h2>
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