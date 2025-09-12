'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Github, Linkedin, Calendar, Award, Code, Briefcase, 
  Star, Zap, Heart, Target, Sparkles, ExternalLink, ArrowRight, 
  FileText, MapPin, GraduationCap, Building, Users, Trophy, Globe,
  ChevronDown, Download, ExternalLink as ExternalLinkIcon
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate, safeUrl } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';
import CircularText from '../CircularText';
import { CreativePortfolioHero } from '../CreativePortfolioHero';

interface ModernGlassmorphismTemplateProps {
  portfolio: DatabasePortfolio;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  glass: string;
  glassDark: string;
  glow: string;
  text: string;
  textSecondary: string;
}

export function ModernGlassmorphismTemplate({ portfolio }: ModernGlassmorphismTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { sectionHeadings, templateText } = personalization;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Enhanced theme color schemes
  const getThemeColors = (scheme: string): ThemeColors => {
    const themes: Record<string, ThemeColors> = {
      blue: {
        primary: 'from-blue-400 via-indigo-500 to-purple-600',
        secondary: 'from-cyan-400 via-blue-500 to-indigo-600',
        accent: 'text-blue-400',
        bg: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-blue-500/20',
        text: 'text-blue-100',
        textSecondary: 'text-blue-200'
      },
      green: {
        primary: 'from-emerald-400 via-teal-500 to-cyan-600',
        secondary: 'from-green-400 via-emerald-500 to-teal-600',
        accent: 'text-emerald-400',
        bg: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-emerald-500/20',
        text: 'text-emerald-100',
        textSecondary: 'text-emerald-200'
      },
      purple: {
        primary: 'from-purple-400 via-pink-500 to-rose-600',
        secondary: 'from-violet-400 via-purple-500 to-pink-600',
        accent: 'text-purple-400',
        bg: 'bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-rose-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-purple-500/20',
        text: 'text-purple-100',
        textSecondary: 'text-purple-200'
      },
      orange: {
        primary: 'from-orange-400 via-amber-500 to-yellow-600',
        secondary: 'from-red-400 via-orange-500 to-amber-600',
        accent: 'text-orange-400',
        bg: 'bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/80',
        glass: 'bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl',
        glassDark: 'bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl',
        glow: 'shadow-orange-500/20',
        text: 'text-orange-100',
        textSecondary: 'text-orange-200'
      }
    };
    return themes[scheme] || themes.blue;
  };

  const themeColors = getThemeColors(personalization?.colorScheme || 'blue');
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];
  const sectionRenderStyle = personalization?.sectionRenderStyle || {};

  // Enhanced Header Section with Circular Text
  const renderHeader = () => (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-20`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={`absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-15`}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Interactive Mouse Follower */}
      <motion.div 
        className={`fixed w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-5 pointer-events-none z-0`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.15 : 0.05
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r ${themeColors.primary} rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Content */}
        <motion.div 
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Profile Image */}
          <motion.div 
            className="flex justify-center lg:justify-start mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              <div className={`w-40 h-40 rounded-full bg-gradient-to-r ${themeColors.primary} p-1 animate-pulse`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-5xl font-black text-white">
                    {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 
                     getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <motion.div 
                className={`absolute -inset-4 rounded-full bg-gradient-to-r ${themeColors.primary} opacity-20 blur-xl`}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
              {resumeData.contact?.name || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName')}
            </span>
          </motion.h1>

          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-2xl md:text-3xl text-gray-300 font-light mb-2">
              {resumeData.experience?.[0]?.position || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackPosition')}
            </p>
            <p className="text-lg md:text-xl text-gray-400 font-light italic">
              {getTemplateText(templateText, 'modern-glassmorphism', 'tagline')}
            </p>
          </motion.div>

          {/* Summary */}
          {resumeData.summary && (
            <motion.div 
              className={`${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl mb-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="text-lg text-gray-200 leading-relaxed">
                {resumeData.summary}
              </p>
            </motion.div>
          )}

          {/* Contact Info */}
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {resumeData.contact?.email && (
              <motion.a 
                href={`mailto:${resumeData.contact.email}`}
                className={`group flex items-center gap-3 ${themeColors.glass} px-6 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-2xl text-white`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{resumeData.contact.email}</span>
              </motion.a>
            )}
            {resumeData.contact?.phone && (
              <motion.a 
                href={`tel:${resumeData.contact.phone}`}
                className={`group flex items-center gap-3 ${themeColors.glass} px-6 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-2xl text-white`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{resumeData.contact.phone}</span>
              </motion.a>
            )}
            {resumeData.contact?.location && (
              <div className={`flex items-center gap-3 ${themeColors.glass} px-6 py-3 rounded-2xl border text-white`}>
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{resumeData.contact.location}</span>
              </div>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {resumeData.contact?.linkedin && (
              <motion.a 
                href={safeUrl(resumeData.contact.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-2xl text-white`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Linkedin className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </motion.a>
            )}
            {resumeData.contact?.github && (
              <motion.a 
                href={safeUrl(resumeData.contact.github)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-2xl text-white`}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Github className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </motion.a>
            )}
            {resumeData.contact?.website && (
              <motion.a 
                href={safeUrl(resumeData.contact.website)}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 ${themeColors.glow} hover:shadow-2xl text-white`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Globe className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </motion.a>
            )}
          </motion.div>
        </motion.div>

        {/* Right Side - Circular Text Animation */}
        <motion.div 
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="relative">
            <CircularText
              text={`${resumeData.contact?.name || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName')}*DEVELOPER*CREATIVE*INNOVATIVE*`}
              onHover="speedUp"
              spinDuration={25}
              size={300}
              fontSize={20}
              className="text-white"
            />
            <motion.div 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${themeColors.primary} opacity-10 blur-xl`}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </header>
  );

  // Enhanced Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-40 right-20 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'experience')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">{exp.position}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Building className={`w-6 h-6 ${themeColors.accent}`} />
                            <span className="text-2xl text-gray-300 font-semibold">{exp.company}</span>
                          </div>
                        </div>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-400">{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-3 mt-4 lg:mt-0 ${themeColors.glassDark} px-6 py-3 rounded-2xl border`}>
                      <Calendar className={`w-5 h-5 ${themeColors.accent}`} />
                      <span className="text-gray-300 font-medium">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                    </div>
                  </div>

                  {exp.responsibilities && (
                    <div className="space-y-4">
                      {exp.responsibilities.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                          <p className="text-gray-300 leading-relaxed text-lg">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'skills')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumeData.skills.map((skillCategory, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-105 ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {skillCategory.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {skillCategory.items.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-4 ${themeColors.glassDark} rounded-xl border transition-all duration-300 hover:scale-105`}>
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} flex-shrink-0`} />
                        <span className="text-gray-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-40 left-10 w-80 h-80 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'projects')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {resumeData.projects.map((project, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.secondary} shadow-lg`}>
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-3 mb-6">
                          {project.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className={`px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r ${themeColors.secondary} text-white shadow-lg`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 ml-6">
                      {project.link && (
                        <a 
                          href={safeUrl(project.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/btn p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
                        >
                          <ExternalLink className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={safeUrl(project.github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group/btn p-4 ${themeColors.glass} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
                        >
                          <Github className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                      {project.description}
                    </p>
                  )}
                  
                  {(project.startDate || project.endDate) && (
                    <div className={`flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border`}>
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400 font-medium">
                        {project.startDate ? formatDate(project.startDate) : ''} {project.endDate && `- ${formatDate(project.endDate)}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 right-20 w-72 h-72 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'education')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.02] ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">{edu.degree}</h3>
                          <p className="text-2xl text-gray-300 font-semibold">{edu.institution}</p>
                        </div>
                      </div>
                      {edu.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-400">{edu.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 lg:mt-0">
                      {edu.graduationDate && (
                        <div className={`flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border`}>
                          <Calendar className={`w-5 h-5 ${themeColors.accent}`} />
                          <span className="text-gray-300 font-medium">
                            {formatDate(edu.graduationDate)}
                          </span>
                        </div>
                      )}
                      {edu.gpa && (
                        <p className="text-gray-300 mt-3 font-medium">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-40 left-1/3 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-40 right-1/3 w-80 h-80 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {getSectionHeading(sectionHeadings, 'certifications')}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className={`group ${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl transition-all duration-500 hover:scale-105 ${themeColors.glow} hover:shadow-2xl`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${themeColors.primary} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">{cert}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Custom Section Renderer
  const renderCustomSection = (section: any) => {
    const style = sectionRenderStyle[section.id] || 'grouped';
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 right-1/4 w-72 h-72 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 animate-pulse`} />
          <div className={`absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-10 animate-pulse`} style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                {section.title}
              </span>
            </h2>
            <div className={`w-32 h-2 bg-gradient-to-r ${themeColors.primary} mx-auto rounded-full`} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className={style === 'cards' ? '' : `${themeColors.glass} rounded-3xl p-8 border backdrop-blur-2xl`}>
              {section.type === 'text' && (
                <p className="text-gray-300 leading-relaxed text-xl">
                  {section.content}
                </p>
              )}
              
              {section.type === 'list' && style === 'grouped' && (
                <ul className="space-y-4">
                  {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                      <span className="text-gray-300 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.type === 'list' && style === 'cards' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(Array.isArray(section.content) ? section.content : [])?.map((item: string, index: number) => (
                    <div key={index} className={`${themeColors.glassDark} rounded-2xl p-6 border`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeColors.primary} mt-2 flex-shrink-0`} />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {section.type === 'cards' && style === 'grouped' && (
                <div className="space-y-6">
                  {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                    <div key={index} className={`border-l-4 pl-6 py-4`} style={{ borderLeftColor: '#fff' }}>
                      {item.title && (
                        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-gray-300 mb-3 text-lg">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'cards' && style === 'cards' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                    <div key={index} className={`${themeColors.glassDark} rounded-2xl p-6 border`}>
                      {item.title && (
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-3">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && style === 'grouped' && (
                <div className="space-y-6">
                  {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                    <div key={index} className={`border-l-4 border-gradient-to-b ${themeColors.primary} pl-6 py-4`}>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 mb-3 text-lg">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && style === 'cards' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(Array.isArray(section.content) ? section.content : [])?.map((item: any, index: number) => (
                    <div key={index} className={`${themeColors.glassDark} rounded-2xl p-6 border`}>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 mb-2">{item.description}</p>
                      )}
                      {item.link && (
                        <div className="mt-2 text-gray-300">
                          <a href={safeUrl(item.link)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.9 3h3.6A4.5 4.5 0 0 1 21 7.5v3.6a1 1 0 1 1-2 0V7.5A2.5 2.5 0 0 0 16.5 5h-3.6a1 1 0 0 1 0-2z"/><path d="M7.5 21h3.6a1 1 0 1 0 0-2H7.5A2.5 2.5 0 0 1 5 16.5v-3.6a1 1 0 1 0-2 0v3.6A4.5 4.5 0 0 0 7.5 21z"/><path d="M8 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"/><path d="M15 15a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1z"/><path d="M20 4a1 1 0 0 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 4 4 0 0 1 4-4z"/></svg>
                            <span>Open link</span>
                          </a>
                        </div>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Creative Portfolio Hero with Gradient Blinds */}
      <CreativePortfolioHero portfolio={portfolio} />
      
      {/* Enhanced Parallax Background for other sections */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-20`}
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`,
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={`absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r ${themeColors.secondary} rounded-full blur-3xl opacity-20`}
          style={{ 
            transform: `translateY(${scrollY * -0.3}px)`,
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Render Sections in Order */}
      <AnimatePresence>
        {sectionOrder.map((sectionId, index) => (
          <motion.div 
            key={sectionId}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {renderSection(sectionId)}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Enhanced Footer */}
      <motion.footer 
        className="py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Footer Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>
        
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.div 
            className={`${themeColors.glass} rounded-3xl p-12 border backdrop-blur-2xl max-w-4xl mx-auto`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex justify-center mb-8"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-6 rounded-full bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                <Heart className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h3 className="text-5xl font-bold text-white mb-6">
              <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                Thank you for viewing my portfolio!
              </span>
            </h3>
            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Built with passion and modern web technologies
            </p>
            <div className="flex justify-center gap-6">
              <motion.div 
                className={`px-6 py-3 ${themeColors.glassDark} rounded-2xl border`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className={`w-6 h-6 ${themeColors.accent} animate-pulse`} />
              </motion.div>
              <motion.div 
                className={`px-6 py-3 ${themeColors.glassDark} rounded-2xl border`}
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className={`w-6 h-6 ${themeColors.accent} animate-pulse`} />
              </motion.div>
              <motion.div 
                className={`px-6 py-3 ${themeColors.glassDark} rounded-2xl border`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Trophy className={`w-6 h-6 ${themeColors.accent} animate-pulse`} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
} 