'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, 
  MapPin, GraduationCap, Building, ExternalLink, Download,
  ArrowRight, Star, Heart
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate, safeUrl } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';

interface ModernGlassmorphismTemplateProps {
  portfolio: DatabasePortfolio;
}

export function ModernGlassmorphismTemplate({ portfolio }: ModernGlassmorphismTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { sectionHeadings, templateText } = personalization;
  const [activeSection, setActiveSection] = useState('about');

  // Subtle purple theme colors
  const getThemeColors = (scheme: string) => {
    const themes = {
      blue: {
        primary: 'from-purple-500 to-violet-600',
        secondary: 'from-violet-500 to-purple-600',
        accent: 'text-purple-600',
        bg: 'bg-gradient-to-br from-purple-50/30 to-violet-50/50',
        card: 'bg-white/90 backdrop-blur-sm border border-purple-100/60 shadow-purple-100/20',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700'
      },
      green: {
        primary: 'from-purple-500 to-violet-600',
        secondary: 'from-violet-500 to-purple-600',
        accent: 'text-purple-600',
        bg: 'bg-gradient-to-br from-purple-50/30 to-violet-50/50',
        card: 'bg-white/90 backdrop-blur-sm border border-purple-100/60 shadow-purple-100/20',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700'
      },
      purple: {
        primary: 'from-purple-500 to-violet-600',
        secondary: 'from-violet-500 to-purple-600',
        accent: 'text-purple-600',
        bg: 'bg-gradient-to-br from-purple-50/30 to-violet-50/50',
        card: 'bg-white/90 backdrop-blur-sm border border-purple-100/60 shadow-purple-100/20',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700'
      },
      orange: {
        primary: 'from-purple-500 to-violet-600',
        secondary: 'from-violet-500 to-purple-600',
        accent: 'text-purple-600',
        bg: 'bg-gradient-to-br from-purple-50/30 to-violet-50/50',
        card: 'bg-white/90 backdrop-blur-sm border border-purple-100/60 shadow-purple-100/20',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700'
      }
    };
    return themes[scheme as keyof typeof themes] || themes.purple;
  };

  const theme = getThemeColors(personalization?.colorScheme || 'purple');
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  // Simple Header Section
  const renderHeader = () => (
    <header className={`min-h-screen ${theme.bg} flex items-center`}>
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${theme.primary} p-1`}>
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 
                       getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center lg:text-left">
              <h1 className={`text-5xl md:text-6xl font-bold ${theme.text} mb-4`}>
                {resumeData.contact?.name || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName')}
              </h1>
              <p className={`text-2xl ${theme.textSecondary} font-medium mb-2`}>
                {resumeData.experience?.[0]?.position || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackPosition')}
              </p>
              <p className={`text-lg ${theme.textSecondary} italic`}>
                {getTemplateText(templateText, 'modern-glassmorphism', 'tagline')}
              </p>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className={`${theme.card} rounded-2xl p-6 shadow-sm`}>
                <p className={`${theme.textSecondary} leading-relaxed`}>
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4">
              {resumeData.contact?.email && (
                <a 
                  href={`mailto:${resumeData.contact.email}`}
                  className={`flex items-center gap-2 ${theme.card} px-4 py-2 rounded-lg hover:shadow-md transition-shadow`}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{resumeData.contact.email}</span>
                </a>
              )}
              {resumeData.contact?.phone && (
                <a 
                  href={`tel:${resumeData.contact.phone}`}
                  className={`flex items-center gap-2 ${theme.card} px-4 py-2 rounded-lg hover:shadow-md transition-shadow`}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{resumeData.contact.phone}</span>
                </a>
              )}
              {resumeData.contact?.location && (
                <div className={`flex items-center gap-2 ${theme.card} px-4 py-2 rounded-lg`}>
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{resumeData.contact.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {resumeData.contact?.linkedin && (
                <a 
                  href={safeUrl(resumeData.contact.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 ${theme.card} rounded-lg hover:shadow-md transition-all hover:scale-105`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {resumeData.contact?.github && (
                <a 
                  href={safeUrl(resumeData.contact.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 ${theme.card} rounded-lg hover:shadow-md transition-all hover:scale-105`}
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {resumeData.contact?.website && (
                <a 
                  href={safeUrl(resumeData.contact.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 ${theme.card} rounded-lg hover:shadow-md transition-all hover:scale-105`}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Side - Simple Visual */}
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`w-80 h-80 rounded-3xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-2xl shadow-purple-200/50`}>
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                  <Code className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Portfolio</h3>
                <p className="text-white/80">Creative & Professional</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );

  // Simple Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className={`py-20 ${theme.bg}`}>
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold ${theme.text} mb-4`}>
              {getSectionHeading(sectionHeadings, 'experience')}
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto rounded-full`} />
          </motion.div>

          <div className="space-y-8">
            {resumeData.experience.map((exp, index) => (
              <motion.div 
                key={index} 
                className={`${theme.card} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${theme.text} mb-1`}>{exp.position}</h3>
                        <div className="flex items-center gap-2">
                          <Building className={`w-5 h-5 ${theme.accent}`} />
                          <span className={`text-lg ${theme.textSecondary} font-medium`}>{exp.company}</span>
                        </div>
                      </div>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className={`w-4 h-4 ${theme.accent}`} />
                        <span className={theme.textSecondary}>{exp.location}</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 ${theme.card} px-4 py-2 rounded-lg`}>
                    <Calendar className={`w-4 h-4 ${theme.accent}`} />
                    <span className={`${theme.textSecondary} text-sm`}>
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>
                </div>

                {exp.responsibilities && (
                  <div className="space-y-3">
                    {exp.responsibilities.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primary} mt-2 flex-shrink-0`} />
                        <p className={`${theme.textSecondary} leading-relaxed`}>{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Simple Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold ${theme.text} mb-4`}>
              {getSectionHeading(sectionHeadings, 'skills')}
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto rounded-full`} />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeData.skills.map((skillCategory, index) => (
              <motion.div 
                key={index} 
                className={`${theme.card} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme.text}`}>
                    {skillCategory.category}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {skillCategory.items.map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 ${theme.card} rounded-lg`}>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primary} flex-shrink-0`} />
                      <span className={`${theme.textSecondary} text-sm`}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Simple Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className={`py-20 ${theme.bg}`}>
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold ${theme.text} mb-4`}>
              {getSectionHeading(sectionHeadings, 'projects')}
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto rounded-full`} />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resumeData.projects.map((project, index) => (
              <motion.div 
                key={index} 
                className={`${theme.card} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.secondary} shadow-lg`}>
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${theme.text}`}>
                        {project.name}
                      </h3>
                    </div>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${theme.secondary} text-white`}
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
                        href={safeUrl(project.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 ${theme.card} rounded-lg hover:shadow-md transition-all hover:scale-105`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={safeUrl(project.github)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 ${theme.card} rounded-lg hover:shadow-md transition-all hover:scale-105`}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                {project.description && (
                  <p className={`${theme.textSecondary} leading-relaxed mb-4`}>
                    {project.description}
                  </p>
                )}
                
                {(project.startDate || project.endDate) && (
                  <div className={`flex items-center gap-2 ${theme.card} px-4 py-2 rounded-lg`}>
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`${theme.textSecondary} text-sm`}>
                      {project.startDate ? formatDate(project.startDate) : ''} {project.endDate && `- ${formatDate(project.endDate)}`}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Simple Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold ${theme.text} mb-4`}>
              {getSectionHeading(sectionHeadings, 'education')}
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto rounded-full`} />
          </motion.div>

          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <motion.div 
                key={index} 
                className={`${theme.card} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${theme.text}`}>{edu.degree}</h3>
                        <p className={`text-lg ${theme.textSecondary} font-medium`}>{edu.institution}</p>
                      </div>
                    </div>
                    {edu.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${theme.accent}`} />
                        <span className={theme.textSecondary}>{edu.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0">
                    {edu.graduationDate && (
                      <div className={`flex items-center gap-2 ${theme.card} px-4 py-2 rounded-lg`}>
                        <Calendar className={`w-4 h-4 ${theme.accent}`} />
                        <span className={`${theme.textSecondary} text-sm`}>
                          {formatDate(edu.graduationDate)}
                        </span>
                      </div>
                    )}
                    {edu.gpa && (
                      <p className={`${theme.textSecondary} mt-2 text-sm`}>GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Simple Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className={`py-20 ${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold ${theme.text} mb-4`}>
              {getSectionHeading(sectionHeadings, 'certifications')}
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto rounded-full`} />
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {resumeData.certifications.map((cert, index) => (
              <motion.div 
                key={index} 
                className={`${theme.card} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold ${theme.text}`}>{cert}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Simple Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold ${theme.text} mb-4`}>
              {section.title}
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.primary} mx-auto rounded-full`} />
          </motion.div>
          
          <div className={`${theme.card} rounded-2xl p-8 shadow-sm`}>
            {section.type === 'text' && (
              <p className={`${theme.textSecondary} leading-relaxed text-lg`}>
                {section.content}
              </p>
            )}
            
            {section.type === 'list' && (
              <ul className="space-y-4">
                {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.primary} mt-2 flex-shrink-0`} />
                    <span className={`${theme.textSecondary} text-lg`}>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    );
  };

  // Dynamic Section Renderer
  const renderSection = (sectionId: string) => {
    if (hiddenSections.includes(sectionId)) {
      return null;
    }

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
        const customSection = customSections.find((section: any) => section.id === sectionId);
        if (customSection) {
          return renderCustomSection(customSection);
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      {renderHeader()}
      
      {/* Sections */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}
      
      {/* Simple Footer */}
      <footer className={`py-16 ${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div 
            className={`${theme.card} rounded-2xl p-8 shadow-sm`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full bg-gradient-to-r ${theme.primary} shadow-lg`}>
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className={`text-3xl font-bold ${theme.text} mb-4`}>
              Thank you for viewing my portfolio!
            </h3>
            <p className={`${theme.textSecondary} text-lg mb-6`}>
              Built with passion and modern web technologies
            </p>
            <div className="flex justify-center gap-4">
              <div className={`px-4 py-2 ${theme.card} rounded-lg`}>
                <Star className={`w-5 h-5 ${theme.accent}`} />
              </div>
              <div className={`px-4 py-2 ${theme.card} rounded-lg`}>
                <Code className={`w-5 h-5 ${theme.accent}`} />
              </div>
              <div className={`px-4 py-2 ${theme.card} rounded-lg`}>
                <Award className={`w-5 h-5 ${theme.accent}`} />
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}