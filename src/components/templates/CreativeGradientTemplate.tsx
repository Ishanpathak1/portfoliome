'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, Star, Zap, Heart, Target, Sparkles, ExternalLink, Sun, Moon, Palette } from 'lucide-react';
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

  const colors = gradients[personalization.colorScheme as keyof typeof gradients] || gradients.purple;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50'
    }`}>
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r ${colors.primary} rounded-full opacity-20 animate-pulse`}></div>
        <div className={`absolute top-1/2 -left-40 w-64 h-64 bg-gradient-to-r ${colors.secondary} rounded-full opacity-20 animate-bounce`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-r ${colors.accent} rounded-full opacity-20 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
          isDark 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900' 
            : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-7xl mx-auto w-full">
          {/* Floating Hero Card */}
          <div className={`relative transform transition-all duration-700 hover:scale-105 ${
            isDark ? 'bg-gray-800/90' : 'bg-white/90'
          } backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border ${
            isDark ? 'border-gray-700' : 'border-white/50'
          }`}>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4 lg:space-y-6">
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${colors.primary} text-white rounded-full text-sm font-bold animate-pulse`}>
                    ✨ Creative Portfolio
                  </div>
                  
                  <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>
                      {resumeData.contact.name.split(' ')[0]}
                    </span>
                    <br />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      {resumeData.contact.name.split(' ').slice(1).join(' ')}
                    </span>
                  </h1>

                  <p className={`text-lg md:text-xl leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {resumeData.summary || 'Creative professional passionate about innovative design and cutting-edge solutions.'}
                  </p>
                </div>

                {/* Animated Skills Tags */}
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {resumeData.skills[0]?.items.slice(0, 4).map((skill, i) => (
                    <span 
                      key={i}
                      className={`px-3 py-2 md:px-4 bg-gradient-to-r ${colors.accent} text-white rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-110 hover:rotate-3`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {resumeData.contact.email && (
                    <a 
                      href={`mailto:${resumeData.contact.email}`}
                      className={`group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r ${colors.primary} text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3`}
                    >
                      <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                      <span>Let's Create Magic</span>
                    </a>
                  )}
                  <button className={`px-6 py-3 md:px-8 md:py-4 ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  } rounded-full font-bold hover:scale-105 transition-all duration-300`}>
                    View Projects
                  </button>
                </div>
              </div>

              {/* Animated Avatar */}
              <div className="relative flex justify-center">
                <div className="relative z-10">
                  <div className={`w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-r ${colors.primary} rounded-full flex items-center justify-center text-white text-4xl md:text-5xl lg:text-6xl font-black shadow-2xl transform transition-all duration-500 hover:rotate-12`}>
                    {resumeData.contact.name.charAt(0)}
                  </div>
                  
                  {/* Floating Icons */}
                  <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 animate-bounce">
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${colors.secondary} rounded-full flex items-center justify-center text-white shadow-lg`}>
                      <Code className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${colors.accent} rounded-full flex items-center justify-center text-white shadow-lg`}>
                      <Palette className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-6 md:-left-8 animate-pulse">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${colors.primary} rounded-full flex items-center justify-center text-white shadow-lg`}>
                      <Heart className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 md:space-x-6 mt-8 md:mt-12">
            {resumeData.contact.linkedin && (
              <a href={resumeData.contact.linkedin} 
                 className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${colors.primary} rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                <Linkedin className="w-6 h-6 md:w-8 md:h-8" />
              </a>
            )}
            {resumeData.contact.github && (
              <a href={resumeData.contact.github}
                 className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${colors.secondary} rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                <Github className="w-6 h-6 md:w-8 md:h-8" />
              </a>
            )}
            {resumeData.contact.phone && (
              <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${colors.accent} rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer`}>
                <Phone className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Experience Cards */}
      {resumeData.experience.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-12 md:mb-16 lg:mb-20 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              My <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>Journey</span>
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
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                        {exp.current && (
                          <span className={`inline-block px-3 py-1 bg-gradient-to-r ${colors.accent} text-white text-xs rounded-full mt-2 animate-pulse`}>
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {exp.title}
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
                      {exp.description.map((desc, i) => (
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
      )}

      {/* Projects Showcase */}
      {resumeData.projects.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-12 md:mb-16 lg:mb-20 ${
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
                      <div className="flex space-x-2">
                        {project.link && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors hover:scale-110 transform`}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        {project.github && (
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors hover:scale-110 transform`}
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className={`text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {project.name}
                      </h3>
                      <p className={`leading-relaxed text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span 
                          key={i}
                          className={`px-2 py-1 md:px-3 bg-gradient-to-r ${
                            i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent
                          } text-white text-xs rounded-full font-medium hover:scale-110 transition-transform cursor-default`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Constellation */}
      {resumeData.skills.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-center mb-12 md:mb-16 lg:mb-20 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Skills <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>Universe</span>
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
                    {skillGroup.items.map((skill, i) => (
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
      )}

      {/* Contact CTA */}
      <section className="py-16 md:py-20 lg:py-24 px-6">
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
              
              {resumeData.contact.email && (
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