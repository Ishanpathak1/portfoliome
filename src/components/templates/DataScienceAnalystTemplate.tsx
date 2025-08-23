'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, Database, 
  Brain, Cpu, Zap, Target, Award, CheckCircle, Star,
  Briefcase, GraduationCap, Calendar, MapPin, Mail, Phone, Linkedin,
  Github, ExternalLink, ArrowRight, ChevronRight, ChevronDown,
  BarChart, Activity, TrendingDown, Percent, Users, Globe,
  Layers, Code2, Cloud, Shield, Workflow, Terminal, Lightbulb,
  Atom, Beaker, CircuitBoard, Gamepad2, Mic, Navigation, 
  Radar, Satellite, Wand2, Wifi, Microscope, Gauge, Orbit,
  Scan, Blocks, Network, Waves, Flashlight, Filter, Search,
  Download, Upload, RefreshCw, Play, Pause, Square, Circle
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';

interface DataScienceAnalystTemplateProps {
  portfolio: DatabasePortfolio;
}

export function DataScienceAnalystTemplate({ portfolio }: DataScienceAnalystTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];
  const sectionRenderStyle = personalization?.sectionRenderStyle || {};

  // Analytics color schemes
  const getAnalyticsColors = (scheme: string) => {
    const palettes: Record<string, any> = {
      blue: {
        primary: '#3b82f6',
        secondary: '#1d4ed8',
        accent: '#60a5fa',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      green: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        success: '#059669',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#064e3b',
        textSecondary: '#065f46'
      },
      purple: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#a78bfa',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#581c87',
        textSecondary: '#7c3aed'
      },
      orange: {
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#fff7ed',
        surface: '#ffffff',
        text: '#9a3412',
        textSecondary: '#c2410c'
      }
    };
    return palettes[scheme] || palettes.blue;
  };

  const colors = getAnalyticsColors(personalization?.colorScheme || 'blue');

  // Get analytics metrics from section headings or use real data
  const getAnalyticsMetrics = () => {
    const sectionHeadings = personalization?.sectionHeadings;
    
    // Check if analytics metrics are defined in section headings
    if (sectionHeadings?.analyticsProjectsCompleted || 
        sectionHeadings?.analyticsAccuracyRate || 
        sectionHeadings?.analyticsDataProcessed || 
        sectionHeadings?.analyticsModelsDeployed) {
      return {
        projectsCompleted: sectionHeadings.analyticsProjectsCompleted || '0',
        accuracyRate: sectionHeadings.analyticsAccuracyRate || 'N/A',
        dataProcessed: sectionHeadings.analyticsDataProcessed || 'N/A',
        modelsDeployed: sectionHeadings.analyticsModelsDeployed || '0'
      };
    }

    // Fallback to real data from portfolio
    const projects = resumeData?.projects || [];
    const experience = resumeData?.experience || [];
    const skills = resumeData?.skills || [];
    
    return {
      projectsCompleted: projects.length.toString(),
      accuracyRate: 'N/A',
      dataProcessed: 'N/A',
      modelsDeployed: projects.filter(p => 
        p.technologies.some(tech => 
          tech.toLowerCase().includes('ml') || 
          tech.toLowerCase().includes('ai') || 
          tech.toLowerCase().includes('tensorflow') ||
          tech.toLowerCase().includes('pytorch') ||
          tech.toLowerCase().includes('scikit')
        )
      ).length.toString()
    };
  };

  const analyticsMetrics = getAnalyticsMetrics();

  // Analytics Metric Card
  const AnalyticsMetric = ({ title, value, icon: Icon, color = colors.primary }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: color + '20' }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>
    </div>
  );

  // Header Section
  const renderHeader = () => {
    const contact = resumeData?.contact;
    const name = contact?.name || 'Data Science Professional';
    const title = contact?.name ? `${contact.name} - Data Scientist & Analytics Expert` : 'Data Scientist & Analytics Expert';
    const summary = resumeData?.summary || 'Passionate data scientist with expertise in machine learning, statistical analysis, and data visualization. Transforming complex data into actionable insights.';

    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                  <Brain className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
                <span className="text-sm font-medium text-gray-600">DATA SCIENCE ANALYST</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                {name}
              </h1>
              
              <h2 className="text-xl lg:text-2xl font-medium mb-6" style={{ color: colors.primary }}>
                {title}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {summary}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {contact?.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center space-x-2 hover:underline">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact?.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center space-x-2 hover:underline">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </a>
                )}
                {contact?.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{contact.location}</span>
                  </div>
                )}
                {contact?.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:underline"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {contact?.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:underline"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Analytics Metrics */}
            <div className="space-y-4">
              <AnalyticsMetric 
                title="Projects Completed" 
                value={analyticsMetrics.projectsCompleted || '0'} 
                icon={BarChart3}
                color={colors.primary}
              />
              <AnalyticsMetric 
                title="Accuracy Rate" 
                value={analyticsMetrics.accuracyRate || 'N/A'} 
                icon={Target}
                color={colors.success}
              />
              <AnalyticsMetric 
                title="Data Processed" 
                value={analyticsMetrics.dataProcessed || 'N/A'} 
                icon={Database}
                color={colors.warning}
              />
              <AnalyticsMetric 
                title="Models Deployed" 
                value={analyticsMetrics.modelsDeployed || '0'} 
                icon={Brain}
                color={colors.danger}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Experience Section
  const renderExperienceSection = () => {
    const experience = resumeData?.experience || [];
    if (experience.length === 0) return null;

    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <Briefcase className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Professional Experience</h2>
          </div>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{exp.position}</h3>
                    <p className="text-lg font-medium" style={{ color: colors.primary }}>{exp.company}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2 lg:mt-0">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {(exp.responsibilities || []).map((responsibility, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: colors.primary }}></div>
                      <p className="text-gray-700 leading-relaxed">{responsibility}</p>
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

  // Skills Section
  const renderSkillsSection = () => {
    const skills = resumeData?.skills || [];
    if (skills.length === 0) return null;

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <Cpu className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                  <span>{category.category}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(category.items || []).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:shadow-md transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      style={{
                        backgroundColor: hoveredSkill === skill ? colors.primary + '20' : undefined,
                        color: hoveredSkill === skill ? colors.primary : undefined
                      }}
                    >
                      {skill}
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
    const projects = resumeData?.projects || [];
    if (projects.length === 0) return null;

    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <BarChart3 className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Data Science Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(selectedProject === index ? null : index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      selectedProject === index ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.technologies || []).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-white text-xs font-medium rounded border border-gray-200"
                      style={{ color: colors.primary }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {(project.link || project.github) && (
                  <div className="flex space-x-3">
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm font-medium hover:underline"
                        style={{ color: colors.primary }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm font-medium hover:underline"
                        style={{ color: colors.primary }}
                      >
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Education Section
  const renderEducationSection = () => {
    const education = resumeData?.education || [];
    if (education.length === 0) return null;

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <GraduationCap className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Education</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{edu.degree}</h3>
                <p className="text-lg font-medium mb-2" style={{ color: colors.primary }}>{edu.institution}</p>
                <p className="text-gray-600 mb-3">{edu.field}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Graduated {formatDate(edu.graduationDate)}</span>
                  </div>
                  {edu.gpa && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>GPA: {edu.gpa}</span>
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

  // Certifications Section
  const renderCertificationsSection = () => {
    const certifications = resumeData?.certifications || [];
    if (certifications.length === 0) return null;

    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <Award className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Certifications</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
                  <h3 className="text-lg font-semibold text-gray-900">{cert}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Custom Section
  const renderCustomSection = (section: any) => {
    const style = sectionRenderStyle[section.id] || 'grouped';
    return (
      <section key={section.id} className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <Lightbulb className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
          </div>

          <div className={style === 'cards' ? '' : 'bg-gray-50 rounded-xl p-6'}>
            {Array.isArray(section.content) ? (
              style === 'cards' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.content.map((item: string, index: number) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: colors.primary }}></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {section.content.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: colors.primary }}></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            )}
          </div>
        </div>
      </section>
    );
  };

  // Analytics Section
  const renderAnalyticsSection = () => {
    const analyticsMetrics = getAnalyticsMetrics();
    const sectionHeadings = personalization?.sectionHeadings;
    const analyticsTitle = sectionHeadings?.analytics || 'Analytics Metrics';

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <BarChart3 className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{analyticsTitle}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsMetric 
              title="Projects Completed" 
              value={analyticsMetrics.projectsCompleted || '0'} 
              icon={BarChart3}
              color={colors.primary}
            />
            <AnalyticsMetric 
              title="Accuracy Rate" 
              value={analyticsMetrics.accuracyRate || 'N/A'} 
              icon={Target}
              color={colors.success}
            />
            <AnalyticsMetric 
              title="Data Processed" 
              value={analyticsMetrics.dataProcessed || 'N/A'} 
              icon={Database}
              color={colors.warning}
            />
            <AnalyticsMetric 
              title="Models Deployed" 
              value={analyticsMetrics.modelsDeployed || '0'} 
              icon={Brain}
              color={colors.danger}
            />
          </div>
        </div>
      </section>
    );
  };

  // Render section based on ID
  const renderSection = (sectionId: string) => {
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
      case 'analytics':
        return renderAnalyticsSection();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {renderHeader()}

      {/* Dynamic Sections */}
      {sectionOrder
        .filter(sectionId => !hiddenSections.includes(sectionId))
        .map(sectionId => renderSection(sectionId))}
    </div>
  );
} 