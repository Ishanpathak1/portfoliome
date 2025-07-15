'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, Linkedin, MapPin, Award, TrendingUp, Users, 
  Building2, Calendar, ExternalLink, ChevronRight, Star,
  Target, Globe, BarChart3, Briefcase, GraduationCap,
  Quote, ArrowUpRight, Play, Pause, Volume2, VolumeX
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface CorporateExecutiveTemplateProps {
  portfolio: DatabasePortfolio;
}

export function CorporateExecutiveTemplate({ portfolio }: CorporateExecutiveTemplateProps) {
  const { resumeData, personalization } = portfolio;
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

  const colors = getThemeColors(personalization.colorScheme);

  // Executive metrics based on real resume data
  const executiveMetrics = [
    { label: 'Years Experience', value: resumeData.experience.length, suffix: '+', icon: Calendar },
    { label: 'Leadership Roles', value: resumeData.experience.length, suffix: '', icon: Users },
    { label: 'Projects Led', value: resumeData.projects.length, suffix: '', icon: TrendingUp },
    { label: 'Core Skills', value: resumeData.skills.reduce((acc, skill) => acc + skill.items.length, 0), suffix: '', icon: Globe }
  ];

  // Typing animation effect
  useEffect(() => {
    const text = `${resumeData.experience[0]?.position || 'Executive Leader'}`;
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [resumeData]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll position
      const sections = ['hero', 'about', 'experience', 'achievements'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div 
          className="h-1 bg-gradient-to-r transition-all duration-300 ease-out"
          style={{ 
            background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}90)`,
            width: `${scrollProgress}%`
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-xl rounded-full border border-gray-200 shadow-lg">
        <div className="flex items-center space-x-1 p-2">
          {['hero', 'about', 'experience', 'achievements'].map((section) => (
            <button
              key={section}
              onClick={() => {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === section 
                  ? `bg-gradient-to-r ${colors.secondary} text-white shadow-lg` 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary}`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '2s', animationDuration: '6s' }} />
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '4s', animationDuration: '5s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">Available for Executive Opportunities</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                  {resumeData.contact.name.split(' ')[0]}
                  <br />
                  <span className="text-white/70">
                    {resumeData.contact.name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>

                <div className="h-8 flex items-center">
                  <span className="text-2xl lg:text-3xl text-white/90 font-light">
                    {typedText}
                    <span className="animate-pulse">|</span>
                  </span>
                </div>

                <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                  {resumeData.summary || 'Visionary executive leader with a proven track record of driving transformational growth, building high-performing teams, and delivering exceptional shareholder value across diverse markets and industries.'}
                </p>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="group inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <Mail className="w-5 h-5" />
                  <span>Executive Inquiry</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                
                {resumeData.contact.linkedin && (
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

            {/* Executive Metrics Dashboard */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Executive Impact
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  {executiveMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={index}
                        className="group relative cursor-pointer"
                        onMouseEnter={() => setHoveredMetric(index)}
                        onMouseLeave={() => setHoveredMetric(null)}
                      >
                        <div className={`bg-white/5 rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                          hoveredMetric === index ? 'ring-2 ring-white/30' : ''
                        }`}>
                          <Icon className="w-8 h-8 text-white/60 mb-4" />
                          <div className="text-3xl font-black text-white mb-2">
                            {metric.value}{metric.suffix}
                          </div>
                          <div className="text-white/60 text-sm font-medium">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-white">{resumeData.experience.length}</div>
                  <div className="text-white/60 text-xs">Leadership Roles</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-white">{resumeData.skills.length}</div>
                  <div className="text-white/60 text-xs">Core Competencies</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-white">{resumeData.projects.length}</div>
                  <div className="text-white/60 text-xs">Strategic Initiatives</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white fade-in-section">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Executive <span className={colors.text}>Summary</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-xl prose-gray max-w-none">
                <p className="text-xl leading-relaxed text-gray-700 font-light">
                  {resumeData.summary || 'Distinguished executive leader with over 15 years of progressive experience driving organizational transformation, strategic growth initiatives, and operational excellence across diverse industries. Proven track record of building and leading high-performing teams while delivering exceptional stakeholder value in competitive global markets.'}
                </p>
              </div>

              {/* Core Competencies */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="w-6 h-6 mr-3" style={{ color: colors.accent }} />
                  Core Leadership Competencies
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {resumeData.skills.map((skillGroup, index) => (
                    <div key={index} className="group">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: colors.accent }} />
                          {skillGroup.category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.slice(0, 4).map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Executive Profile Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg sticky top-8">
                <div className="text-center mb-8">
                  <div 
                    className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {resumeData.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resumeData.contact.name}</h3>
                  <p className="text-gray-600 font-medium">{resumeData.experience[0]?.position || 'Executive Leader'}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" style={{ color: colors.accent }} />
                    <a href={`mailto:${resumeData.contact.email}`} className="hover:text-gray-900 transition-colors">
                      {resumeData.contact.email}
                    </a>
                  </div>
                  
                  {resumeData.contact.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3" style={{ color: colors.accent }} />
                      <span>{resumeData.contact.phone}</span>
                    </div>
                  )}
                  
                  {resumeData.contact.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3" style={{ color: colors.accent }} />
                      <span>{resumeData.contact.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button 
                    className="w-full bg-gradient-to-r text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}dd)` }}
                    onClick={() => window.open(`mailto:${resumeData.contact.email}?subject=Executive Opportunity Inquiry`, '_blank')}
                  >
                    Schedule Executive Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-24 bg-white fade-in-section">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Leadership <span className={colors.text}>Journey</span>
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
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
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

      {/* Strategic Achievements */}
      <section id="achievements" className={`py-24 bg-gradient-to-b ${colors.gradient} fade-in-section`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Strategic <span className={colors.text}>Achievements</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r mx-auto rounded-full" 
                 style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accent}60)` }} />
          </div>

          {resumeData.projects.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-opacity-80 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-gray-600 text-sm">Strategic Initiative</p>
                        </div>
                      </div>

                      {(project.link || project.github) && (
                        <div className="flex space-x-2">
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{project.description}</p>

                    {project.technologies.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Key Technologies & Methodologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {(project.technologies || []).map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-3 py-1 rounded-full text-xs font-medium border"
                              style={{ 
                                backgroundColor: `${colors.accent}10`,
                                borderColor: `${colors.accent}30`,
                                color: colors.accent
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-24 bg-gradient-to-br ${colors.primary} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Drive Your Organization Forward?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Let's discuss how strategic leadership and proven execution can accelerate your business objectives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={`mailto:${resumeData.contact.email}?subject=Executive Opportunity Discussion`}
              className="inline-flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <Mail className="w-5 h-5" />
              <span>Schedule Strategy Session</span>
            </a>
            
            {resumeData.contact.linkedin && (
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