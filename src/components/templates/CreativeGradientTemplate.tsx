'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, Star, Zap, Heart, Target, Sparkles, ExternalLink, Sun, Moon, Palette, GraduationCap, MapPin } from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface CreativeGradientTemplateProps {
  portfolio: DatabasePortfolio;
}

export function CreativeGradientTemplate({ portfolio }: CreativeGradientTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [isDark, setIsDark] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const gradients = {
    blue: {
      primary: 'from-blue-400 via-cyan-500 to-teal-600',
      secondary: 'from-purple-400 via-pink-500 to-red-500',
      accent: 'from-indigo-400 to-purple-600',
    },
    green: {
      primary: 'from-emerald-400 via-teal-500 to-cyan-600',
      secondary: 'from-green-400 via-emerald-500 to-teal-500',
      accent: 'from-lime-400 to-green-600',
    },
    purple: {
      primary: 'from-purple-400 via-pink-500 to-rose-600',
      secondary: 'from-violet-400 via-purple-500 to-indigo-500',
      accent: 'from-fuchsia-400 to-purple-600',
    },
    orange: {
      primary: 'from-orange-400 via-amber-500 to-yellow-600',
      secondary: 'from-red-400 via-pink-500 to-purple-500',
      accent: 'from-orange-400 to-red-600',
    },
    red: {
      primary: 'from-red-400 via-pink-500 to-purple-600',
      secondary: 'from-rose-400 via-pink-500 to-fuchsia-500',
      accent: 'from-red-400 to-pink-600',
    },
  };

  const colors = gradients[personalization?.colorScheme as keyof typeof gradients] || gradients.purple;
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  // Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;
    
    return (
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 md:mb-12 lg:mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Professional <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>Experience</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {resumeData.experience.map((exp, index) => (
              <div 
                key={index}
                className={`group relative transform transition-all duration-500 hover:scale-105 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl`}
                onMouseEnter={() => setHoveredCard(`exp-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 md:p-4 bg-gradient-to-r ${colors.primary} rounded-2xl`}>
                      <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </p>
                      {!exp.endDate && (
                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${colors.accent} text-white text-xs rounded-full mt-2 animate-pulse`}>
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {exp.position}
                    </h3>
                    <p className={`text-base md:text-lg font-semibold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {exp.location}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {(exp.responsibilities || []).map((desc: string, i: number) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${colors.accent} rounded-full mt-2 flex-shrink-0`}></div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm md:text-base`}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 md:mb-12 lg:mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Technical <span className={`bg-gradient-to-r ${colors.secondary} bg-clip-text text-transparent`}>Skills</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {resumeData.skills.map((skillGroup, index) => (
              <div 
                key={index}
                className={`group relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105`}
              >
                <div className="flex items-center mb-6 space-x-4">
                  <div className={`p-3 md:p-4 bg-gradient-to-r ${
                    index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.accent
                  } rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <Code className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className={`text-lg md:text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {skillGroup.category}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {(skillGroup.items || []).map((skill, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center justify-between p-3 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                      } rounded-xl transition-all duration-300 hover:scale-105 group/skill`}
                    >
                      <span className={`font-medium text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {skill}
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star 
                            key={starIndex} 
                            className={`w-3 h-3 md:w-4 md:h-4 ${
                              starIndex < 4 
                                ? `text-yellow-400 fill-current` 
                                : 'text-gray-400'
                            } group-hover/skill:text-yellow-400 group-hover/skill:fill-current transition-colors duration-300`}
                            style={{ transitionDelay: `${starIndex * 50}ms` }}
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
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 md:mb-12 lg:mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Creative <span className={`bg-gradient-to-r ${colors.secondary} bg-clip-text text-transparent`}>Projects</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {resumeData.projects.map((project, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-3xl ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1`}
              >
                <div className={`h-3 md:h-4 bg-gradient-to-r ${index % 2 === 0 ? colors.primary : colors.secondary}`}></div>
                
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 bg-gradient-to-r ${colors.accent} rounded-2xl`}>
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${colors.primary} text-white rounded-full text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg`}
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
                          className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${colors.secondary} text-white rounded-full text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg`}
                        >
                          <Github className="w-4 h-4" />
                          <span>View Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className={`text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {project.name}
                    </h3>
                    <p className={`text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                      {project.description}
                    </p>
                    
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            } hover:scale-105 transition-transform duration-200`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
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

  // Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;
    
    return (
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 md:mb-12 lg:mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Educational <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>Background</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {resumeData.education.map((edu, index) => (
              <div 
                key={index}
                className={`group relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 md:p-4 bg-gradient-to-r ${colors.primary} rounded-2xl`}>
                    <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {edu.graduationDate ? formatDate(edu.graduationDate) : 'In Progress'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {edu.degree}
                  </h3>
                  <p className={`text-base md:text-lg font-semibold bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                    {edu.institution}
                  </p>
                  {edu.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {edu.location}
                      </span>
                    </div>
                  )}
                  {edu.gpa && (
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      GPA: {edu.gpa}
                    </p>
                  )}
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
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 md:mb-12 lg:mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Professional <span className={`bg-gradient-to-r ${colors.secondary} bg-clip-text text-transparent`}>Certifications</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {resumeData.certifications.map((cert, index) => (
              <div 
                key={index}
                className={`group relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:scale-105`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 bg-gradient-to-r ${colors.accent} rounded-2xl`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cert}
                  </h3>
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
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-8 md:mb-12 lg:mb-16 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {section.title}
          </h2>
          
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 md:p-8 shadow-xl`}>
            {section.type === 'text' && (
              <p className={`text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                {section.content}
              </p>
            )}
            
            {section.type === 'list' && (
              <div className="space-y-4">
                {section.items?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 bg-gradient-to-r ${colors.accent} rounded-full mt-2 flex-shrink-0`}></div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            
            {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
              <div className="space-y-6">
                {section.items?.map((item: any, index: number) => (
                  <div key={index} className={`border-l-4 border-gradient-to-b ${colors.primary} pl-6`}>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>{item.title}</h3>
                    {item.description && (
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{item.description}</p>
                    )}
                    {item.date && (
                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 md:p-4 bg-gradient-to-r ${colors.primary} text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-r ${colors.primary} rounded-full blur-3xl opacity-20 animate-pulse`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r ${colors.secondary} rounded-full blur-3xl opacity-20 animate-pulse`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${colors.accent} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <header className="relative z-10 py-20 md:py-32 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
          <div className="space-y-6">
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Hey, I'm{' '}
              <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent animate-pulse`}>
                {resumeData.contact?.name || 'Creative Mind'}
              </span>
            </h1>
            <p className={`text-lg md:text-xl lg:text-2xl leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}>
              {resumeData.summary || 'Passionate about creating amazing experiences through innovative design and technology'}
            </p>
          </div>
          
          {/* Contact Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {resumeData.contact?.email && (
              <a 
                href={`mailto:${resumeData.contact.email}`}
                className={`inline-flex items-center space-x-2 md:space-x-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r ${colors.primary} text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                <span>Let's Connect</span>
              </a>
            )}
            {resumeData.contact?.linkedin && (
              <a 
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 md:space-x-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r ${colors.secondary} text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                <span>LinkedIn</span>
              </a>
            )}
            {resumeData.contact?.github && (
              <a 
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 md:space-x-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r ${colors.accent} text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
              >
                <Github className="w-4 h-4 md:w-5 md:h-5" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}

      {/* Contact CTA */}
      <section className="py-12 md:py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`relative ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} opacity-10`}></div>
            
            <div className="relative z-10 space-y-6 md:space-y-8">
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to Create
                <span className={`block bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent mt-2`}>
                  Something Amazing?
                </span>
              </h2>
              <p className={`text-lg md:text-xl leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto`}>
                Let's collaborate and bring your wildest ideas to life with creativity and innovation.
              </p>
              
              {resumeData.contact?.email && (
                <a 
                  href={`mailto:${resumeData.contact.email}`}
                  className={`inline-flex items-center space-x-3 md:space-x-4 px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r ${colors.primary} text-white rounded-full font-bold text-base md:text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
                >
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Start the Magic</span>
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 