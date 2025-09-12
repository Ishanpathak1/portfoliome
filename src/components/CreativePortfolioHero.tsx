'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Github, Linkedin, MapPin, Globe, 
  ChevronDown, Download, ExternalLink, Star, Sparkles,
  Code, Palette, Zap, Heart, Target, Award
} from 'lucide-react';
import GradientBlinds from './GradientBlinds';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate, safeUrl } from '@/lib/utils';
import { getTemplateText } from '@/lib/template-text';

interface CreativePortfolioHeroProps {
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

export function CreativePortfolioHero({ portfolio }: CreativePortfolioHeroProps) {
  const { resumeData, personalization } = portfolio;
  const { templateText } = personalization;
  const [isRevealed, setIsRevealed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
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

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const gradientColors = [
    '#FF9FFC', '#5227FF', '#00D4FF', '#FF6B6B', 
    '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Blinds Background */}
      <div className="absolute inset-0">
        <GradientBlinds
          gradientColors={gradientColors}
          angle={0}
          noise={0.2}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.6}
          spotlightSoftness={1.2}
          spotlightOpacity={0.8}
          distortAmount={0.1}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Interactive Mouse Follower */}
      <motion.div 
        className={`fixed w-96 h-96 bg-gradient-to-r ${themeColors.primary} rounded-full blur-3xl opacity-10 pointer-events-none z-10`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.2 : 0.1
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Click to Reveal Button */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-12"
              >
                <motion.button
                  onClick={handleReveal}
                  className={`group relative px-12 py-6 ${themeColors.glass} rounded-3xl border backdrop-blur-2xl text-white font-bold text-2xl transition-all duration-300 hover:scale-105 ${themeColors.glow} hover:shadow-2xl`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${themeColors.primary} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                  <span className="relative z-10 flex items-center gap-4">
                    <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                    Click to Reveal Portfolio
                    <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Revealed Content */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-12"
              >
                {/* Name and Title Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`${themeColors.glass} rounded-3xl p-12 border backdrop-blur-2xl max-w-4xl mx-auto`}
                >
                  {/* Profile Avatar */}
                  <motion.div 
                    className="flex justify-center mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  >
                    <div className="relative">
                      <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${themeColors.primary} p-1`}>
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">
                            {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 
                             getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName').split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <motion.div 
                        className={`absolute -inset-4 rounded-full bg-gradient-to-r ${themeColors.primary} opacity-30 blur-xl`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </motion.div>

                  {/* Name */}
                  <motion.h1 
                    className="text-6xl md:text-8xl font-black text-white mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                      {resumeData.contact?.name || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackName')}
                    </span>
                  </motion.h1>

                  {/* Title and Tagline */}
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <p className="text-3xl md:text-4xl text-gray-200 font-light mb-4">
                      {resumeData.experience?.[0]?.position || getTemplateText(templateText, 'modern-glassmorphism', 'fallbackPosition')}
                    </p>
                    <p className="text-xl md:text-2xl text-gray-300 font-light italic">
                      {getTemplateText(templateText, 'modern-glassmorphism', 'tagline')}
                    </p>
                  </motion.div>

                  {/* Summary */}
                  {resumeData.summary && (
                    <motion.div 
                      className={`${themeColors.glassDark} rounded-2xl p-8 border backdrop-blur-2xl mb-8`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <p className="text-lg text-gray-200 leading-relaxed">
                        {resumeData.summary}
                      </p>
                    </motion.div>
                  )}

                  {/* Contact Info */}
                  <motion.div 
                    className="flex flex-wrap justify-center gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    {resumeData.contact?.email && (
                      <motion.a 
                        href={`mailto:${resumeData.contact.email}`}
                        className={`group flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 text-white`}
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
                        className={`group flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 text-white`}
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
                      <div className={`flex items-center gap-3 ${themeColors.glassDark} px-6 py-3 rounded-2xl border text-white`}>
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{resumeData.contact.location}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Social Links */}
                  <motion.div 
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    {resumeData.contact?.linkedin && (
                      <motion.a 
                        href={safeUrl(resumeData.contact.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group p-4 ${themeColors.glassDark} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
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
                        className={`group p-4 ${themeColors.glassDark} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
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
                        className={`group p-4 ${themeColors.glassDark} rounded-2xl border transition-all duration-300 hover:scale-110 text-white`}
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

                {/* Skills Preview Cards */}
                {resumeData.skills?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                  >
                    {resumeData.skills.slice(0, 3).map((skillCategory, index) => (
                      <motion.div
                        key={index}
                        className={`${themeColors.glass} rounded-2xl p-6 border backdrop-blur-2xl text-white`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
                        whileHover={{ scale: 1.05, rotate: 2 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${themeColors.primary} shadow-lg`}>
                            <Code className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold">{skillCategory.category}</h3>
                        </div>
                        <div className="space-y-2">
                          {skillCategory.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeColors.primary}`} />
                              <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    className={`group px-8 py-4 bg-gradient-to-r ${themeColors.primary} rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-3">
                      <Download className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      Download Resume
                    </span>
                  </motion.button>
                  <motion.button
                    className={`group px-8 py-4 ${themeColors.glass} rounded-2xl border backdrop-blur-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-3">
                      <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      View Portfolio
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll Indicator */}
          {isRevealed && (
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-white/60"
              >
                <span className="text-sm font-medium">Scroll to explore more</span>
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
