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
import BlurText from '../BlurText';
import TrueFocus from '../TrueFocus';

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

  // Enhanced Header Section
  const renderHeader = () => {
    return (
    <header className="min-h-screen bg-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side - Content */}
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 
                       getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center lg:text-left space-y-3">
              <div className="mb-2 text-5xl md:text-6xl font-bold text-gray-100 overflow-hidden flex justify-center lg:justify-start">
                <TrueFocus 
                  sentence={resumeData.contact?.name || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName')}
                  manualMode={false}
                  blurAmount={5}
                  borderColor="#a855f7"
                  animationDuration={2}
                  pauseBetweenAnimations={1}
                />
              </div>
              <p className="text-2xl text-gray-300 font-medium">
                {resumeData.experience?.[0]?.position || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackPosition')}
              </p>
              <p className="text-lg text-gray-400 italic">
                {getTemplateText(templateText, 'modern-glassmorphism', 'tagline')}
              </p>
            </div>

            {/* Summary with Blur Text Effect */}
            {resumeData.summary && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                <BlurText
                  text={resumeData.summary}
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-lg text-gray-300 leading-relaxed"
                />
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
              {resumeData.contact?.email && (
                <a 
                  href={`mailto:${resumeData.contact.email}`}
                  className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 px-6 py-4 rounded-xl hover:bg-gray-700/50 transition-all group"
                >
                  <Mail className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  <span className="text-gray-300 group-hover:text-gray-200">{resumeData.contact.email}</span>
                </a>
              )}
              {resumeData.contact?.phone && (
                <a 
                  href={`tel:${resumeData.contact.phone}`}
                  className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 px-6 py-4 rounded-xl hover:bg-gray-700/50 transition-all group"
                >
                  <Phone className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  <span className="text-gray-300 group-hover:text-gray-200">{resumeData.contact.phone}</span>
                </a>
              )}
              {resumeData.contact?.location && (
                <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 px-6 py-4 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">{resumeData.contact.location}</span>
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
                  className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all hover:scale-105 group"
                >
                  <Linkedin className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </a>
              )}
              {resumeData.contact?.github && (
                <a 
                  href={safeUrl(resumeData.contact.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all hover:scale-105 group"
                >
                  <Github className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </a>
              )}
              {resumeData.contact?.website && (
                <a 
                  href={safeUrl(resumeData.contact.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all hover:scale-105 group"
                >
                  <ExternalLink className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Side - Enhanced Visual */}
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-96 h-96 rounded-3xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <div className="text-center text-white">
                <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                  <Code className="w-14 h-14" />
                </div>
                <h3 className="text-3xl font-bold mb-3">Portfolio</h3>
                <p className="text-white/90 text-lg">Creative & Professional</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
    );
  };

  // Enhanced Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              {getSectionHeading(sectionHeadings, 'experience')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-600 mx-auto rounded-full" />
          </motion.div>

          <div className="space-y-8">
            {resumeData.experience.map((exp, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 hover:bg-gray-700/70 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-1">{exp.position}</h3>
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-purple-400" />
                          <span className="text-lg text-gray-300 font-medium">{exp.company}</span>
                        </div>
                      </div>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">{exp.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-600/50 px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>
                </div>

                {exp.responsibilities && (
                  <div className="space-y-3">
                    {exp.responsibilities.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 mt-2 flex-shrink-0" />
                        <p className="text-gray-300 leading-relaxed">{item}</p>
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

  // Enhanced Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              {getSectionHeading(sectionHeadings, 'skills')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeData.skills.map((skillCategory, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100">
                    {skillCategory.category}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {skillCategory.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{item}</span>
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

  // Enhanced Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              {getSectionHeading(sectionHeadings, 'projects')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resumeData.projects.map((project, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-8 hover:bg-gray-700/70 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-100">
                        {project.name}
                      </h3>
                    </div>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white"
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
                        className="p-3 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={safeUrl(project.github)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 transition-all hover:scale-105"
                      >
                        <Github className="w-4 h-4 text-purple-400" />
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
                  <div className="flex items-center gap-2 bg-gray-600/50 px-4 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">
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

  // Enhanced Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              {getSectionHeading(sectionHeadings, 'education')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-600 mx-auto rounded-full" />
          </motion.div>

          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-100">{edu.degree}</h3>
                        <p className="text-lg text-gray-300 font-medium">{edu.institution}</p>
                      </div>
                    </div>
                    {edu.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">{edu.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0">
                    {edu.graduationDate && (
                      <div className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300 text-sm">
                          {formatDate(edu.graduationDate)}
                        </span>
                      </div>
                    )}
                    {edu.gpa && (
                      <p className="text-gray-400 mt-2 text-sm">GPA: {edu.gpa}</p>
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

  // Enhanced Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              {getSectionHeading(sectionHeadings, 'certifications')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-600 mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {resumeData.certifications.map((cert, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6 hover:bg-gray-700/70 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-100">{cert}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              {section.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-600 mx-auto rounded-full" />
          </motion.div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            {section.type === 'text' && (
              <p className="text-gray-300 leading-relaxed text-lg">
                {section.content}
              </p>
            )}
            
            {section.type === 'list' && (
              <ul className="space-y-4">
                {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{item}</span>
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      {renderHeader()}
      
      {/* Sections */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}
      
      {/* Enhanced Footer */}
      <footer className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-100 mb-4">
              Thank you for viewing my portfolio!
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Built with passion and modern web technologies
            </p>
            <div className="flex justify-center gap-4">
              <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                <Code className="w-5 h-5 text-purple-400" />
              </div>
              <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}