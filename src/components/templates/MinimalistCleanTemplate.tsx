'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Github, Linkedin, MapPin, ExternalLink, Sun, Moon, Code, Briefcase, User, Award, FolderOpen, GraduationCap } from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface MinimalistCleanTemplateProps {
  portfolio: DatabasePortfolio;
}

export function MinimalistCleanTemplate({ portfolio }: MinimalistCleanTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  // Refs for sections
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const getThemeColors = (scheme: string) => {
    const colorMap = {
      blue: {
        primary: '#2563eb', // blue-600
        accent: '#dbeafe', // blue-100
        hover: '#eff6ff', // blue-50
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        bgAccent: 'bg-blue-100',
        bgHover: 'bg-blue-50',
        border: 'border-blue-600'
      },
      green: {
        primary: '#059669', // emerald-600
        accent: '#d1fae5', // emerald-100
        hover: '#ecfdf5', // emerald-50
        text: 'text-emerald-600',
        bg: 'bg-emerald-600',
        bgAccent: 'bg-emerald-100',
        bgHover: 'bg-emerald-50',
        border: 'border-emerald-600'
      },
      purple: {
        primary: '#9333ea', // purple-600
        accent: '#f3e8ff', // purple-100
        hover: '#faf5ff', // purple-50
        text: 'text-purple-600',
        bg: 'bg-purple-600',
        bgAccent: 'bg-purple-100',
        bgHover: 'bg-purple-50',
        border: 'border-purple-600'
      },
      orange: {
        primary: '#ea580c', // orange-600
        accent: '#fed7aa', // orange-100
        hover: '#fff7ed', // orange-50
        text: 'text-orange-600',
        bg: 'bg-orange-600',
        bgAccent: 'bg-orange-100',
        bgHover: 'bg-orange-50',
        border: 'border-orange-600'
      },
      red: {
        primary: '#dc2626', // red-600
        accent: '#fecaca', // red-100
        hover: '#fef2f2', // red-50
        text: 'text-red-600',
        bg: 'bg-red-600',
        bgAccent: 'bg-red-100',
        bgHover: 'bg-red-50',
        border: 'border-red-600'
      }
    };
    return colorMap[scheme as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getThemeColors(personalization.colorScheme);

  // Navigation sections
  const sections = [
    { id: 'about', title: 'About', icon: User },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: FolderOpen },
    { id: 'education', title: 'Education', icon: GraduationCap },
  ];

  // Filter sections based on available data
  const availableSections = sections.filter(section => {
    switch (section.id) {
      case 'about': return true; // Always available
      case 'experience': return resumeData.experience.length > 0;
      case 'skills': return resumeData.skills.length > 0;
      case 'projects': return resumeData.projects.length > 0;
      case 'education': return resumeData.education.length > 0;
      default: return false;
    }
  });

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
        top: elementTop - 40, // 40px offset for better visibility
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const container = contentRef.current;
      const scrollTop = container.scrollTop;
      
      let currentSection = availableSections[0]?.id || 'about';
      
      // Find which section is currently most visible
      availableSections.forEach(section => {
        const element = sectionRefs.current[section.id];
        if (element) {
          const elementTop = element.offsetTop - container.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          // Check if section is in view (with some offset)
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

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className={`w-80 fixed h-full transition-all duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r flex flex-col`}>
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: colors.primary }}
              >
                {resumeData.contact.name.charAt(0)}
              </div>
              <h1 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {resumeData.contact.name}
              </h1>
              <p 
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {resumeData.experience[0]?.title || 'Professional'}
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
              {resumeData.contact.email && (
                <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{resumeData.contact.email}</span>
                </div>
              )}
              {resumeData.contact.phone && (
                <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.contact.phone}</span>
                </div>
              )}
              {resumeData.contact.location && (
                <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.contact.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-4">
              {resumeData.contact.linkedin && (
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
              {resumeData.contact.github && (
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
        <main className="flex-1 ml-80">
          <div 
            ref={contentRef}
            className="h-screen overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto p-8 space-y-16">
              {/* About Section */}
              <section 
                id="about" 
                ref={setSectionRef('about')}
                className="pt-8"
              >
                <div className={`rounded-2xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <User 
                      className="w-8 h-8 mr-3"
                      style={{ color: colors.primary }}
                    />
                    About Me
                  </h2>
                  <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {resumeData.summary || 'Passionate professional dedicated to creating exceptional solutions and delivering outstanding results.'}
                  </p>
                </div>
              </section>

              {/* Experience Section */}
              {resumeData.experience.length > 0 && (
                <section 
                  id="experience" 
                  ref={setSectionRef('experience')}
                >
                  <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <Briefcase 
                      className="w-8 h-8 mr-3"
                      style={{ color: colors.primary }}
                    />
                    Experience
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
                              {exp.title}
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
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </p>
                            {exp.current && (
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
                        <ul className="space-y-2">
                          {exp.description.map((desc, i) => (
                            <li key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-start`}>
                              <span 
                              className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                              style={{ backgroundColor: colors.primary }}
                            ></span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills Section */}
              {resumeData.skills.length > 0 && (
                <section 
                  id="skills" 
                  ref={setSectionRef('skills')}
                >
                  <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <Code 
                      className="w-8 h-8 mr-3"
                      style={{ color: colors.primary }}
                    />
                    Skills & Expertise
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
              )}

              {/* Projects Section */}
              {resumeData.projects.length > 0 && (
                <section 
                  id="projects" 
                  ref={setSectionRef('projects')}
                >
                  <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <FolderOpen 
                      className="w-8 h-8 mr-3"
                      style={{ color: colors.primary }}
                    />
                    Featured Projects
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
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
                            {/* Enhanced Project Links */}
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
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className={`px-2 py-1 text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-md`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {resumeData.education.length > 0 && (
                <section 
                  id="education" 
                  ref={setSectionRef('education')}
                  className="pb-16"
                >
                  <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <GraduationCap 
                      className="w-8 h-8 mr-3"
                      style={{ color: colors.primary }}
                    />
                    Education
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
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {formatDate(edu.graduationDate)}
                            </p>
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 