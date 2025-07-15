'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, Star, Zap, Heart, Target, Sparkles, Mouse, ExternalLink } from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface ModernGlassmorphismTemplateProps {
  portfolio: DatabasePortfolio;
}

export function ModernGlassmorphismTemplate({ portfolio }: ModernGlassmorphismTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getThemeColors = (scheme: string) => {
    const colors = {
      blue: {
        primary: 'from-blue-500 via-purple-500 to-indigo-600',
        secondary: 'from-blue-400 to-cyan-400',
        accent: 'text-blue-500',
        bg: 'bg-blue-50/50',
        glass: 'bg-blue-500/10 backdrop-blur-xl border-blue-200/20',
        glow: 'shadow-blue-500/25'
      },
      green: {
        primary: 'from-emerald-400 via-teal-500 to-green-600',
        secondary: 'from-green-400 to-emerald-400',
        accent: 'text-emerald-500',
        bg: 'bg-emerald-50/50',
        glass: 'bg-emerald-500/10 backdrop-blur-xl border-emerald-200/20',
        glow: 'shadow-emerald-500/25'
      },
      purple: {
        primary: 'from-purple-500 via-pink-500 to-violet-600',
        secondary: 'from-purple-400 to-pink-400',
        accent: 'text-purple-500',
        bg: 'bg-purple-50/50',
        glass: 'bg-purple-500/10 backdrop-blur-xl border-purple-200/20',
        glow: 'shadow-purple-500/25'
      },
      orange: {
        primary: 'from-orange-400 via-red-500 to-pink-500',
        secondary: 'from-orange-400 to-yellow-400',
        accent: 'text-orange-500',
        bg: 'bg-orange-50/50',
        glass: 'bg-orange-500/10 backdrop-blur-xl border-orange-200/20',
        glow: 'shadow-orange-500/25'
      },
      red: {
        primary: 'from-red-500 via-pink-500 to-rose-600',
        secondary: 'from-red-400 to-pink-400',
        accent: 'text-red-500',
        bg: 'bg-red-50/50',
        glass: 'bg-red-500/10 backdrop-blur-xl border-red-200/20',
        glow: 'shadow-red-500/25'
      },
    };
    return colors[scheme as keyof typeof colors] || colors.blue;
  };

  const colors = getThemeColors(personalization.colorScheme);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-600/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Cursor Follower */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: isHovering ? 'scale(2)' : 'scale(1)',
        }}
      />

      {/* Portfolio Created Badge */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-white text-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Portfolio created with AI</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${colors.primary} rounded-2xl flex items-center justify-center shadow-2xl ${colors.glow}`}>
                  <span className="text-2xl font-bold text-white">{resumeData.contact.name.charAt(0)}</span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Available for work</span>
                  </div>
                  <div>Portfolio • {new Date().getFullYear()}</div>
                </div>
              </div>

              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Hi, I'm</span>
                <br />
                <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent animate-pulse`}>
                  {resumeData.contact.name.split(' ')[0]}
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                {resumeData.summary || 'Creative professional passionate about building exceptional digital experiences that make a difference.'}
              </p>

              <div className="flex flex-wrap gap-4">
                {resumeData.contact.email && (
                  <a 
                    href={`mailto:${resumeData.contact.email}`}
                    className={`group px-8 py-4 bg-gradient-to-r ${colors.primary} rounded-full text-white font-semibold hover:scale-105 transition-all duration-300 shadow-2xl ${colors.glow} hover:shadow-3xl`}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Let's Talk</span>
                    </span>
                  </a>
                )}
                <button className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300">
                  View Work
                </button>
              </div>

              {/* Social Links */}
              <div className="flex space-x-6 pt-8">
                {resumeData.contact.linkedin && (
                  <a href={resumeData.contact.linkedin} className="group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <Linkedin className="w-5 h-5 text-white" />
                    </div>
                  </a>
                )}
                {resumeData.contact.github && (
                  <a href={resumeData.contact.github} className="group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                  </a>
                )}
                {resumeData.contact.phone && (
                  <div className="group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="relative">
            <div className="relative z-10">
              {/* Floating Cards */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colors.secondary} rounded-2xl flex items-center justify-center`}>
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Full Stack Developer</h3>
                      <p className="text-gray-400 text-sm">Bringing ideas to life</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 group ml-12">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colors.primary} rounded-2xl flex items-center justify-center`}>
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Innovation Focused</h3>
                      <p className="text-gray-400 text-sm">Always pushing boundaries</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colors.secondary} rounded-2xl flex items-center justify-center`}>
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">User-Centered Design</h3>
                      <p className="text-gray-400 text-sm">Creating meaningful experiences</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2 text-white/60">
            <Mouse className="w-6 h-6 animate-bounce" />
            <span className="text-sm">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <section className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">
                Professional
                <span className={`block bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                  Journey
                </span>
              </h2>
              <p className="text-xl text-gray-400">Building the future, one project at a time</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              
              <div className="space-y-24">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full shadow-2xl z-10 animate-pulse"></div>
                    
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:mr-auto lg:pr-16' : 'lg:ml-auto lg:pl-16'}`}>
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105 group">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`p-4 bg-gradient-to-r ${colors.primary} rounded-2xl`}>
                            <Briefcase className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </div>
                            {exp.current && (
                              <div className="flex items-center justify-end space-x-1 mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-sm">Current</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">{exp.position}</h3>
                        <p className={`text-lg font-semibold ${colors.accent} mb-6`}>{exp.company}</p>
                        
                        <div className="space-y-3">
                          {(exp.responsibilities || []).map((desc, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-300 leading-relaxed">{desc}</p>
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
      )}

      {/* Skills Section */}
      {resumeData.skills.length > 0 && (
        <section className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">
                Skills &
                <span className={`block bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                  Expertise
                </span>
              </h2>
              <p className="text-xl text-gray-400">Technologies I love working with</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index} className="group">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105">
                    <div className="flex items-center mb-6">
                      <div className={`p-4 bg-gradient-to-r ${colors.primary} rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Code className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{skillGroup.category}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {(skillGroup.items || []).map((skill, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group/skill">
                          <span className="text-gray-300 font-medium">{skill}</span>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, starIndex) => (
                              <Star 
                                key={starIndex} 
                                className={`w-4 h-4 ${starIndex < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'} group-hover/skill:text-yellow-400 group-hover/skill:fill-current transition-colors duration-300`}
                                style={{ transitionDelay: `${starIndex * 50}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {resumeData.projects.length > 0 && (
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">
                Featured
                <span className={`block bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                  Projects
                </span>
              </h2>
              <p className="text-xl text-gray-400">Bringing ideas to life through code</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-500 hover:scale-105">
                    <div className={`h-2 bg-gradient-to-r ${colors.primary}`}></div>
                    
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 bg-gradient-to-r ${colors.secondary} rounded-2xl`}>
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        {/* Enhanced Project Links */}
                        <div className="flex flex-col space-y-3">
                          {project.link && (
                            <a 
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl ${colors.glow}`}
                            >
                              <ExternalLink className="w-5 h-5" />
                              <span>View Live</span>
                            </a>
                          )}
                          {project.github && (
                            <a 
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                              <Github className="w-5 h-5" />
                              <span>View Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-white mb-4">{project.name}</h3>
                      <p className="text-gray-300 mb-8 leading-relaxed text-lg">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        {(project.technologies || []).map((tech, i) => (
                          <span 
                            key={i}
                            className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <section className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">
                Education &
                <span className={`block bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                  Learning
                </span>
              </h2>
              <p className="text-xl text-gray-400">Building knowledge, expanding horizons</p>
            </div>

            <div className="space-y-8">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-4 bg-gradient-to-r ${colors.primary} rounded-2xl mr-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                        <p className={`text-lg font-semibold ${colors.accent} mb-1`}>{edu.institution}</p>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Graduated {formatDate(edu.graduationDate)}
                        </div>
                      </div>
                    </div>
                    {edu.gpa && (
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl">
                        <p className="text-white font-semibold">GPA: {edu.gpa}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 hover:bg-white/20 transition-all duration-500">
            <h2 className="text-5xl font-black text-white mb-8">
              Let's Create
              <span className={`block bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                Something Amazing
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Ready to bring your ideas to life? Let's start a conversation and build something incredible together.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {resumeData.contact.email && (
                <a 
                  href={`mailto:${resumeData.contact.email}`}
                  className={`group px-12 py-6 bg-gradient-to-r ${colors.primary} rounded-full text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl ${colors.glow} hover:shadow-3xl`}
                >
                  <span className="flex items-center space-x-3">
                    <Mail className="w-6 h-6" />
                    <span>Start a Project</span>
                    <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 