'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Code2, Database, Cloud, GitBranch, Globe, Layers,
  Server, Monitor, Smartphone, Zap, Play, Pause,
  ArrowRight, ExternalLink, Github, Terminal, FileCode,
  Workflow, Container, Cpu, Wifi, Lock, TrendingUp,
  BarChart3, Users, Award, Rocket, CheckCircle,
  AlertCircle, Clock, Activity, Binary
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface FullStackDevTemplateProps {
  portfolio: DatabasePortfolio;
}

export function FullStackDevTemplate({ portfolio }: FullStackDevTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState('deployed');
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [systemStats, setSystemStats] = useState({
    uptime: '99.9%',
    responseTime: '< 100ms',
    requests: '1.2M',
    errors: '< 0.1%'
  });
  const [animatedMetrics, setAnimatedMetrics] = useState<number[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  
  const metricsRef = useRef<HTMLDivElement>(null);

  // Modern color schemes for full-stack development
  const getStackColors = (scheme: string) => {
    const palettes = {
      blue: {
        primary: '#0066CC',
        secondary: '#1E90FF',
        accent: '#00BFFF',
        success: '#00C851',
        warning: '#FF8800',
        error: '#FF4444',
        dark: '#0A1A2E',
        light: '#E3F2FD',
        gradient: 'from-blue-900 via-blue-800 to-indigo-900'
      },
      purple: {
        primary: '#6F42C1',
        secondary: '#8B5CF6',
        accent: '#A855F7',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        dark: '#1E1B3A',
        light: '#F3E8FF',
        gradient: 'from-purple-900 via-purple-800 to-indigo-900'
      },
      green: {
        primary: '#28A745',
        secondary: '#20C997',
        accent: '#17A2B8',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#0F2027',
        light: '#E8F5E8',
        gradient: 'from-green-900 via-teal-800 to-blue-900'
      },
      orange: {
        primary: '#FD7E14',
        secondary: '#FF8C00',
        accent: '#FF6B35',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#2E1A0F',
        light: '#FFF3E0',
        gradient: 'from-orange-900 via-red-800 to-pink-900'
      },
      red: {
        primary: '#DC3545',
        secondary: '#E74C3C',
        accent: '#FF5722',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        dark: '#2A0F0F',
        light: '#FFEBEE',
        gradient: 'from-red-900 via-pink-800 to-purple-900'
      }
    };
    return palettes[scheme as keyof typeof palettes] || palettes.blue;
  };

  const colors = getStackColors(personalization.colorScheme);

  // Stack metrics derived from real data
  const stackMetrics = [
    { 
      label: 'Years Experience', 
      value: resumeData.experience?.length ? 
        Math.max(...resumeData.experience.map(exp => {
          const start = new Date(exp.startDate);
          const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
          return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        })) : '3+',
      icon: Award,
      color: colors.primary
    },
    { 
      label: 'Projects Delivered', 
      value: resumeData.projects?.length || 8, 
      icon: Rocket,
      color: colors.secondary
    },
    { 
      label: 'Technologies', 
      value: resumeData.skills?.reduce((acc, skillGroup) => acc + skillGroup.items.length, 0) || 15, 
      icon: Code2,
      color: colors.accent
    },
    { 
      label: 'Team Leadership', 
      value: resumeData.experience?.filter(exp => 
        exp.position && (
          exp.position.toLowerCase().includes('lead') ||
          exp.position.toLowerCase().includes('senior') ||
          exp.position.toLowerCase().includes('architect')
        )
      ).length || 1,
      icon: Users,
      color: colors.success
    }
  ];

  // Development workflow stages instead of code examples
  const workflowStages = [
    {
      title: 'Planning & Architecture',
      description: 'System design, database modeling, API planning',
      tools: ['Figma', 'Miro', 'Lucidchart', 'Draw.io'],
      color: colors.primary
    },
    {
      title: 'Development & Testing',
      description: 'Component development, unit testing, integration testing',
      tools: ['Git', 'Jest', 'Cypress', 'Postman'],
      color: colors.secondary
    },
    {
      title: 'Deployment & Monitoring',
      description: 'CI/CD pipelines, performance monitoring, scaling',
      tools: ['Docker', 'Kubernetes', 'AWS', 'Datadog'],
      color: colors.accent
    }
  ];

  // Dynamic skill categories from resume data
  const skillCategories = resumeData.skills?.map((skillGroup, index) => {
    const colorMap = [colors.primary, colors.secondary, colors.accent, colors.success, colors.warning];
    return {
      title: skillGroup.category,
      description: getSkillDescription(skillGroup.category),
      tools: skillGroup.items,
      color: colorMap[index % colorMap.length]
    };
  }) || [];

  // Function to get description based on skill category
  function getSkillDescription(category: string) {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('frontend') || lowerCategory.includes('ui') || lowerCategory.includes('client')) {
      return 'Building responsive, interactive user interfaces with modern frameworks';
    } else if (lowerCategory.includes('backend') || lowerCategory.includes('server') || lowerCategory.includes('api')) {
      return 'Developing scalable server-side applications and robust APIs';
    } else if (lowerCategory.includes('database') || lowerCategory.includes('data')) {
      return 'Designing efficient data storage solutions and query optimization';
    } else if (lowerCategory.includes('devops') || lowerCategory.includes('deployment') || lowerCategory.includes('cloud')) {
      return 'Managing infrastructure, deployment pipelines, and cloud services';
    } else if (lowerCategory.includes('tool') || lowerCategory.includes('development')) {
      return 'Essential development tools and productivity enhancers';
    } else {
      return 'Core technologies and frameworks for modern development';
    }
  }

  // Deployment pipeline stages
  const deploymentStages = [
    { name: 'Code Push', status: 'completed', duration: '2s' },
    { name: 'CI/CD Pipeline', status: 'completed', duration: '3m 21s' },
    { name: 'Build & Test', status: 'completed', duration: '1m 45s' },
    { name: 'Docker Build', status: 'completed', duration: '45s' },
    { name: 'Deploy to Staging', status: 'completed', duration: '30s' },
    { name: 'Production Deploy', status: 'completed', duration: '25s' }
  ];

  // API endpoints showcase
  const apiEndpoints = [
    { method: 'GET', path: '/api/users', description: 'Fetch all users', status: 200 },
    { method: 'POST', path: '/api/auth/login', description: 'User authentication', status: 200 },
    { method: 'PUT', path: '/api/users/:id', description: 'Update user profile', status: 200 },
    { method: 'DELETE', path: '/api/posts/:id', description: 'Delete user post', status: 204 }
  ];

  // Animated metrics effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedMetrics(prev => {
        const newMetrics = [...prev];
        const randomMetric = Math.floor(Math.random() * stackMetrics.length);
        if (!newMetrics.includes(randomMetric)) {
          newMetrics.push(randomMetric);
          if (newMetrics.length > 2) {
            newMetrics.shift();
          }
        }
        return newMetrics;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Status simulation for development workflow
  useEffect(() => {
    const statuses = [
      'Building components...',
      'Running tests...',
      'Optimizing performance...',
      'Deploying to production...',
      'All systems operational'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < statuses.length) {
        setTerminalOutput(prev => [...prev.slice(-2), statuses[index]]);
        index++;
      } else {
        index = 0;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'completed': return colors.success;
      default: return colors.primary;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return colors.success;
      case 'POST': return colors.primary;
      case 'PUT': return colors.warning;
      case 'DELETE': return colors.error;
      default: return colors.primary;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, ${colors.primary}40 2px, transparent 2px),
              radial-gradient(circle at 75px 75px, ${colors.secondary}40 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="inline-flex items-center space-x-3 bg-slate-800/50 border border-slate-700 rounded-full px-6 py-3">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: colors.success }}
                  />
                  <span className="text-slate-300 font-mono text-sm">Production Ready</span>
                </div>

                <h1 className="text-4xl lg:text-6xl xl:text-8xl font-black leading-tight">
                  <span className="text-white">{resumeData.contact.name.split(' ')[0]}</span>
                  <br />
                  <span 
                    className="bg-gradient-to-r bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                  >
                    {resumeData.contact.name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>

                <div className="text-xl lg:text-2xl xl:text-3xl font-mono text-slate-300">
                  Full Stack Developer
                </div>

                <p className="text-lg lg:text-xl text-slate-400 leading-relaxed max-w-2xl">
                  {resumeData.summary || 'Building scalable web applications with modern technologies. Passionate about clean code, performance optimization, and delivering exceptional user experiences from frontend to backend.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-6">
                <a
                  href={resumeData.contact.github || resumeData.projects?.find(p => p.github)?.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg transition-all duration-300 hover:scale-105 text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <Code2 className="w-5 h-5" />
                    <span>View Projects</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="inline-flex items-center space-x-3 bg-slate-800 border border-slate-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-slate-700 transition-all duration-300"
                >
                  <Terminal className="w-5 h-5" />
                  <span>Get In Touch</span>
                </a>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-6">
                {stackMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 ${
                      animatedMetrics.includes(index) ? 'scale-105 shadow-lg' : ''
                    }`}
                    style={{
                      boxShadow: animatedMetrics.includes(index) ? `0 0 30px ${metric.color}30` : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className="w-8 h-8" style={{ color: metric.color }} />
                      <div 
                        className="text-3xl font-black"
                        style={{ color: metric.color }}
                      >
                        {metric.value}
                      </div>
                    </div>
                    <div className="text-slate-300 font-medium">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" style={{ color: colors.success }} />
                  System Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(systemStats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-sm text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Status Terminal */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-slate-400 font-mono text-sm">Development Status</span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  {terminalOutput.map((line, index) => (
                    <div key={index} className="text-green-400">
                      <span className="text-slate-500">$</span> {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Workflow Section - Replacing Code Examples */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6">
              My <span style={{ color: colors.primary }}>Skills</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
              Technologies and tools I've mastered
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Workflow Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900/50">
              {skillCategories.length > 0 ? skillCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveWorkflowTab(index)}
                  className={`flex-1 px-4 lg:px-6 py-4 text-sm lg:text-base font-medium transition-colors border-b-2 ${
                    activeWorkflowTab === index
                      ? 'text-white border-current'
                      : 'text-slate-400 border-transparent hover:text-slate-300'
                  }`}
                  style={{
                    color: activeWorkflowTab === index ? category.color : undefined,
                    borderBottomColor: activeWorkflowTab === index ? category.color : undefined
                  }}
                >
                  {category.title}
                </button>
              )) : (
                <div className="flex-1 px-6 py-4 text-center text-slate-400">
                  No Skills Available
                </div>
              )}
            </div>

            {/* Workflow Content */}
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                    {skillCategories[activeWorkflowTab]?.title || 'Skills'}
                  </h3>
                  <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
                    {skillCategories[activeWorkflowTab]?.description || 'My technical expertise and tools'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Key Tools & Technologies:</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {(skillCategories[activeWorkflowTab]?.tools || []).map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: skillCategories[activeWorkflowTab]?.color || colors.primary }}
                        />
                        <span className="text-slate-300 text-sm font-medium">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Architecture */}
      <section className="py-24 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Tech <span style={{ color: colors.primary }}>Architecture</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Modern technologies and tools powering scalable applications
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Frontend Stack */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Monitor className="w-6 h-6 mr-3" style={{ color: colors.primary }} />
                Frontend Technologies
              </h3>
              
              {resumeData.skills.filter(skill => 
                skill.category.toLowerCase().includes('frontend') || 
                skill.category.toLowerCase().includes('ui') ||
                skill.category.toLowerCase().includes('client')
              ).map((skillGroup, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">{skillGroup.category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <span className="text-slate-300 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Backend Stack */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Server className="w-6 h-6 mr-3" style={{ color: colors.secondary }} />
                Backend Technologies
              </h3>
              
              {resumeData.skills.filter(skill => 
                skill.category.toLowerCase().includes('backend') || 
                skill.category.toLowerCase().includes('server') ||
                skill.category.toLowerCase().includes('database')
              ).map((skillGroup, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">{skillGroup.category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.secondary }}
                        />
                        <span className="text-slate-300 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-24 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Featured <span style={{ color: colors.primary }}>Projects</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Full-stack applications showcasing modern development practices
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resumeData.projects.map((project, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Project Header */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}20`, border: `1px solid ${colors.primary}` }}
                      >
                        <Globe className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          {project.link && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-slate-400">Live</span>
                            </div>
                          )}
                          {project.github && (
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-4 h-4 text-blue-400" />
                              <span className="text-slate-400">Open Source</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 border border-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-600 transition-colors"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="space-y-3">
                    <h4 className="text-slate-400 font-semibold text-sm uppercase tracking-wide">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-full text-xs font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deployment Status */}
                <div className="px-8 py-4 bg-slate-900/50 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.link ? colors.success : colors.warning }}
                      />
                      <span className="text-slate-400 text-sm">
                        {project.link ? 'Production' : 'Development'}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs">
                      Last updated: {Math.floor(Math.random() * 30) + 1} days ago
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Ready to <span style={{ color: colors.primary }}>Collaborate</span>?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Let's build something amazing together. From concept to deployment, I'll help bring your ideas to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={`mailto:${resumeData.contact.email}`}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 text-white"
              style={{ backgroundColor: colors.primary }}
            >
              <Terminal className="w-5 h-5" />
              <span>Start Project</span>
            </a>
            
            {resumeData.contact.linkedin && (
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-700 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 