'use client';

import { useState, useEffect } from 'react';
import { 
  Cpu, Zap, Brain, Rocket, Globe, Users, Award, TrendingUp,
  Code2, Database, Cloud, Github, ExternalLink, ArrowRight,
  Binary, Activity, Shield, Workflow, Terminal, Lightbulb,
  Target, BarChart3, CheckCircle, Star, Trophy, Sparkles
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface TechInnovatorTemplateProps {
  portfolio: DatabasePortfolio;
}

export function TechInnovatorTemplate({ portfolio }: TechInnovatorTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [glitchActive, setGlitchActive] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  const [matrixRain, setMatrixRain] = useState<string[][]>([]);
  const [innovationMetrics, setInnovationMetrics] = useState<number[]>([]);
  const [achievementIndex, setAchievementIndex] = useState(0);

  // Cyberpunk color schemes
  const getCyberpunkColors = (scheme: string) => {
    const palettes = {
      blue: {
        primary: '#00D4FF',
        secondary: '#0099CC',
        accent: '#33E1FF',
        neon: '#00FFFF',
        dark: '#001122',
        gradient: 'from-blue-900 via-cyan-900 to-teal-900'
      },
      purple: {
        primary: '#B537F2',
        secondary: '#8B5CF6',
        accent: '#D946EF',
        neon: '#FF00FF',
        dark: '#1A0033',
        gradient: 'from-purple-900 via-violet-900 to-pink-900'
      },
      green: {
        primary: '#00FF88',
        secondary: '#10B981',
        accent: '#34D399',
        neon: '#00FF00',
        dark: '#001100',
        gradient: 'from-green-900 via-emerald-900 to-teal-900'
      },
      orange: {
        primary: '#FF6B35',
        secondary: '#F97316',
        accent: '#FB923C',
        neon: '#FF8800',
        dark: '#331100',
        gradient: 'from-orange-900 via-red-900 to-pink-900'
      },
      red: {
        primary: '#FF2D55',
        secondary: '#EF4444',
        accent: '#F87171',
        neon: '#FF0040',
        dark: '#220011',
        gradient: 'from-red-900 via-pink-900 to-purple-900'
      }
    };
    return palettes[scheme as keyof typeof palettes] || palettes.blue;
  };

  const colors = getCyberpunkColors(personalization.colorScheme);

  // Innovation metrics derived from real data
  const techMetrics = [
    { 
      label: 'Innovation Years', 
      value: resumeData.experience?.length ? 
        Math.max(...resumeData.experience.map(exp => {
          const start = new Date(exp.startDate);
          const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
          return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        })) : 0,
      icon: Brain,
      description: 'Years of tech innovation'
    },
    { 
      label: 'Tech Stack Mastery', 
      value: resumeData.skills?.reduce((acc, skillGroup) => acc + skillGroup.items.length, 0) || 0, 
      icon: Code2,
      description: 'Technologies mastered'
    },
    { 
      label: 'Solutions Delivered', 
      value: resumeData.projects?.length || 0, 
      icon: Rocket,
      description: 'Innovative projects completed'
    },
    { 
      label: 'Leadership Impact', 
      value: resumeData.experience?.filter(exp => 
        exp.title.toLowerCase().includes('lead') || 
        exp.title.toLowerCase().includes('senior') ||
        exp.title.toLowerCase().includes('architect') ||
        exp.title.toLowerCase().includes('principal')
      ).length || 0,
      icon: Users,
      description: 'Teams led & mentored'
    }
  ];

  // Real achievements derived from resume data
  const achievements = [
    ...(resumeData.experience?.map((job, index) => ({
      category: job.title.includes('Lead') || job.title.includes('Senior') ? 'Leadership' : 'Experience',
      description: `${job.title} at ${job.company}`
    })) || []),
    ...(resumeData.projects?.map((project, index) => ({
      category: 'Innovation',
      description: `Built ${project.name} - ${project.description.slice(0, 50)}...`
    })) || []),
    ...(resumeData.skills?.map((skillGroup, index) => ({
      category: 'Expertise',
      description: `Mastered ${skillGroup.category} technologies`
    })) || [])
  ].slice(0, 5); // Limit to 5 achievements

  // Matrix rain animation
  useEffect(() => {
    const generateMatrixRain = () => {
      const chars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク'];
      const columns = 20;
      const rows = 30;
      
      const newMatrix = Array.from({ length: columns }, () =>
        Array.from({ length: rows }, () => 
          chars[Math.floor(Math.random() * chars.length)]
        )
      );
      
      setMatrixRain(newMatrix);
    };

    generateMatrixRain();
    const interval = setInterval(generateMatrixRain, 100);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Metrics animation
  useEffect(() => {
    const interval = setInterval(() => {
      setInnovationMetrics(prev => {
        const newMetrics = [...prev];
        const randomMetric = Math.floor(Math.random() * techMetrics.length);
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

  // Achievement rotation
  useEffect(() => {
    if (achievements.length > 0) {
      const interval = setInterval(() => {
        setAchievementIndex(prev => (prev + 1) % achievements.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [achievements.length]);

  // Skill category rotation
  useEffect(() => {
    if (resumeData.skills?.length > 1) {
      const interval = setInterval(() => {
        setActiveSkillCategory(prev => (prev + 1) % resumeData.skills.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [resumeData.skills]);

  const currentSkills = resumeData.skills?.[activeSkillCategory] || { category: 'Technologies', items: [] };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Matrix Rain */}
        <div className="absolute inset-0 opacity-10">
          {matrixRain.map((column, i) => (
            <div
              key={i}
              className="absolute text-xs font-mono"
              style={{
                left: `${i * 5}%`,
                animation: `matrix-rain ${3 + i * 0.2}s linear infinite`,
                color: colors.primary
              }}
            >
              {column.map((char, j) => (
                <div key={j} className="opacity-80">
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(${colors.primary}33 1px, transparent 1px),
                linear-gradient(90deg, ${colors.primary}33 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-80`} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Status Indicator */}
                <div className="inline-flex items-center space-x-3 bg-black/50 border rounded-full px-6 py-3" style={{ borderColor: colors.primary }}>
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: colors.neon, boxShadow: `0 0 10px ${colors.neon}` }}
                  />
                  <span className="text-white font-mono text-sm">System Online</span>
                </div>

                <h1 className={`text-4xl lg:text-6xl xl:text-8xl font-black leading-tight ${glitchActive ? 'animate-pulse' : ''}`}>
                  <span 
                    className="block"
                    style={{ 
                      color: colors.primary,
                      textShadow: glitchActive ? `2px 0 ${colors.accent}, -2px 0 ${colors.secondary}` : `0 0 20px ${colors.primary}60`
                    }}
                  >
                    {resumeData.contact.name.split(' ')[0]}
                  </span>
                  <span 
                    className="block text-white"
                    style={{ textShadow: `0 0 20px ${colors.neon}40` }}
                  >
                    {resumeData.contact.name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>

                <div className="text-xl lg:text-2xl xl:text-3xl font-mono" style={{ color: colors.accent }}>
                  Tech Innovator & Architect
                </div>

                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  {resumeData.summary || 'Pioneering next-generation technologies and architecting scalable solutions. Specializing in AI/ML, cloud infrastructure, and cutting-edge development frameworks that push the boundaries of what\'s possible.'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-6">
                <button 
                  className="group relative overflow-hidden px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg transition-all duration-300 hover:scale-105 text-black"
                  style={{ 
                    backgroundColor: colors.primary,
                    boxShadow: `0 0 20px ${colors.primary}40`
                  }}
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <Brain className="w-5 h-5" />
                    <span>View Innovations</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="inline-flex items-center space-x-3 bg-black/50 border text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-black/70 transition-all duration-300"
                  style={{ borderColor: colors.primary }}
                >
                  <Zap className="w-5 h-5" />
                  <span>Connect</span>
                </a>
              </div>
            </div>

            {/* Innovation Dashboard */}
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-6">
                {techMetrics.filter(metric => metric.value > 0).map((metric, index) => (
                  <div
                    key={index}
                    className={`bg-black/50 border rounded-xl p-6 hover:border-opacity-100 transition-all duration-300 ${
                      innovationMetrics.includes(index) ? 'scale-105 shadow-lg' : ''
                    }`}
                    style={{
                      borderColor: `${colors.primary}60`,
                      boxShadow: innovationMetrics.includes(index) ? `0 0 30px ${colors.primary}40` : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <metric.icon className="w-8 h-8" style={{ color: colors.primary }} />
                      <div 
                        className="text-3xl font-black"
                        style={{ 
                          color: colors.neon,
                          textShadow: `0 0 10px ${colors.neon}60`
                        }}
                      >
                        {metric.value}
                      </div>
                    </div>
                    <div className="text-white font-medium mb-2">{metric.label}</div>
                    <div className="text-gray-400 text-sm">{metric.description}</div>
                  </div>
                ))}
              </div>

              {/* Current Achievement */}
              {achievements.length > 0 && (
                <div className="bg-black/50 border rounded-xl p-6" style={{ borderColor: `${colors.primary}60` }}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" style={{ color: colors.accent }} />
                    Latest Achievement
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors.neon, boxShadow: `0 0 10px ${colors.neon}` }}
                      />
                      <span className="text-white font-medium">{achievements[achievementIndex].category}</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-6">
                      {achievements[achievementIndex].description}
                    </p>
                  </div>
                </div>
              )}

              {/* Tech Skills Rotation */}
              <div className="bg-black/50 border rounded-xl p-6" style={{ borderColor: `${colors.primary}60` }}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Cpu className="w-5 h-5 mr-2" style={{ color: colors.secondary }} />
                  {currentSkills.category}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {currentSkills.items.slice(0, 6).map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-black/30 rounded-lg"
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      <span className="text-gray-300 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
                {currentSkills.items.length > 6 && (
                  <div className="mt-3 text-center">
                    <span className="text-gray-400 text-sm">
                      +{currentSkills.items.length - 6} more technologies
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Mastery */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6">
              Tech <span style={{ color: colors.primary }}>Arsenal</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
              Cutting-edge technologies and frameworks that power modern applications
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeData.skills?.map((skillGroup, groupIndex) => (
              <div
                key={groupIndex}
                className="bg-black/50 border rounded-xl p-6 hover:border-opacity-100 transition-all duration-300"
                style={{ borderColor: `${colors.primary}60` }}
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: colors.primary, boxShadow: `0 0 10px ${colors.primary}60` }}
                  />
                  {skillGroup.category}
                </h3>
                
                <div className="space-y-3">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="group flex items-center space-x-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300"
                    >
                      <div 
                        className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        {skill}
                      </span>
                      <div className="flex-1" />
                      <div 
                        className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: colors.neon, boxShadow: `0 0 8px ${colors.neon}` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6">
              Featured <span style={{ color: colors.primary }}>Projects</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
              Innovative solutions built with modern technologies and best practices
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {resumeData.projects?.map((project, index) => (
              <div
                key={index}
                className="group relative bg-black/50 border rounded-2xl overflow-hidden hover:border-opacity-100 transition-all duration-500 hover:-translate-y-2"
                style={{ borderColor: `${colors.primary}60` }}
              >
                {/* Project Header */}
                <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}20`, border: `1px solid ${colors.primary}40` }}
                      >
                        <Rocket className="w-6 h-6" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-white/90 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-gray-400 text-sm font-mono">Project #{String(index + 1).padStart(2, '0')}</p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-black/30 border rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors"
                          style={{ borderColor: `${colors.primary}60` }}
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-black/30 border rounded-lg flex items-center justify-center hover:bg-black/50 transition-colors"
                          style={{ borderColor: `${colors.primary}60` }}
                        >
                          <ExternalLink className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="flex items-center space-x-2 px-3 py-1 bg-black/30 border rounded-full"
                          style={{ borderColor: `${colors.primary}40` }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <span className="text-xs font-mono text-gray-300">{tech}</span>
                        </div>
                      )) || []}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                />
              </div>
            )) || []}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6">
            Let's <span style={{ color: colors.primary }}>Connect</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Ready to build something amazing together? Let's discuss your next project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={`mailto:${resumeData.contact.email}`}
              className="inline-flex items-center space-x-3 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg transition-all duration-300 hover:scale-105 text-black"
              style={{ 
                backgroundColor: colors.primary,
                boxShadow: `0 0 20px ${colors.primary}40`
              }}
            >
              <Terminal className="w-5 h-5" />
              <span>Start Collaboration</span>
            </a>
            
            {resumeData.contact.github && (
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-black/50 border text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold text-base lg:text-lg hover:bg-black/70 transition-all duration-300"
                style={{ borderColor: colors.primary }}
              >
                <Github className="w-5 h-5" />
                <span>View GitHub</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        .animate-glitch {
          animation: glitch 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
} 