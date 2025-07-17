'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Palette, Camera, Layers, Zap, Heart, Star, Eye, Download,
  ArrowRight, ArrowLeft, X, Play, ExternalLink, Github,
  Grid3X3, Filter, Search, MousePointer, Sparkles,
  Award, Users, Clock, TrendingUp, Brush, Lightbulb,
  Briefcase, GraduationCap, Calendar, MapPin, Mail, Phone, Linkedin,
  Scissors, Paintbrush, Pen, Feather, Droplet, Shapes, Maximize,
  Triangle, Circle, Square, PenTool, Eraser
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';
import { getSectionHeading } from '@/lib/section-headings';
import { getTemplateText } from '@/lib/template-text';

interface CreativePortfolioTemplateProps {
  portfolio: DatabasePortfolio;
}

interface ArtisticColors {
  primary: string;
  secondary: string;
  accent: string;
  paper: string;
  ink: string;
  paint: string;
  sketch: string;
}

export function CreativePortfolioTemplate({ portfolio }: CreativePortfolioTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { sectionHeadings, templateText } = personalization;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintSplatters, setPaintSplatters] = useState<Array<{x: number, y: number, color: string, size: number}>>([]);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];
  
  // Artistic color palettes
  const getArtisticColors = (scheme: string): ArtisticColors => {
    const palettes: Record<string, ArtisticColors> = {
      blue: {
        primary: 'from-blue-400 via-indigo-500 to-purple-600',
        secondary: 'from-cyan-300 via-blue-400 to-indigo-500',
        accent: '#3b82f6',
        paper: '#fef7ed',
        ink: '#1e293b',
        paint: '#3b82f6',
        sketch: '#64748b'
      },
      purple: {
        primary: 'from-purple-400 via-pink-500 to-rose-600',
        secondary: 'from-violet-300 via-purple-400 to-pink-500',
        accent: '#8b5cf6',
        paper: '#fdf4ff',
        ink: '#374151',
        paint: '#8b5cf6',
        sketch: '#6b7280'
      },
      green: {
        primary: 'from-emerald-400 via-teal-500 to-cyan-600',
        secondary: 'from-green-300 via-emerald-400 to-teal-500',
        accent: '#10b981',
        paper: '#f0fdf4',
        ink: '#1f2937',
        paint: '#10b981',
        sketch: '#4b5563'
      },
      orange: {
        primary: 'from-orange-400 via-amber-500 to-yellow-600',
        secondary: 'from-red-300 via-orange-400 to-amber-500',
        accent: '#f97316',
        paper: '#fff7ed',
        ink: '#292524',
        paint: '#f97316',
        sketch: '#57534e'
      }
    };
    return palettes[scheme] || palettes.blue;
  };

  const colors = getArtisticColors(personalization?.colorScheme || 'blue');

  // Interactive drawing effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (isDrawing && Math.random() > 0.7) {
        setPaintSplatters(prev => [...prev, {
          x: e.clientX,
          y: e.clientY,
          color: colors.paint,
          size: Math.random() * 8 + 2
        }]);
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDrawing, colors.paint]);

  // Generate random paint splatters
  useEffect(() => {
    const generateSplatters = () => {
      const splatters = [];
      for (let i = 0; i < 20; i++) {
        splatters.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: [colors.paint, colors.accent, '#ff6b6b', '#4ecdc4', '#ffe66d'][Math.floor(Math.random() * 5)],
          size: Math.random() * 15 + 5
        });
      }
      setPaintSplatters(splatters);
    };

    generateSplatters();
    const interval = setInterval(generateSplatters, 30000);
    return () => clearInterval(interval);
  }, [colors.paint, colors.accent]);

  // Paper texture component
  const PaperTexture = ({ className = '' }: { className?: string }) => (
    <div className={`absolute inset-0 opacity-30 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 40% 40%, rgba(120, 219, 198, 0.1) 0%, transparent 50%)`,
        backgroundSize: '100px 100px, 80px 80px, 60px 60px'
      }} />
    </div>
  );

  // Torn paper edge effect
  const TornEdge = ({ top = false, bottom = false }: { top?: boolean, bottom?: boolean }) => (
    <div className={`absolute left-0 right-0 h-4 z-10 ${top ? 'top-0' : ''} ${bottom ? 'bottom-0' : ''}`}>
      <svg 
        viewBox="0 0 1200 20" 
        className="w-full h-full"
        style={{ transform: top ? 'scaleY(-1)' : 'none' }}
      >
        <path 
          d="M0,10 Q30,0 60,10 Q90,20 120,10 Q150,0 180,10 Q210,20 240,10 Q270,0 300,10 Q330,20 360,10 Q390,0 420,10 Q450,20 480,10 Q510,0 540,10 Q570,20 600,10 Q630,0 660,10 Q690,20 720,10 Q750,0 780,10 Q810,20 840,10 Q870,0 900,10 Q930,20 960,10 Q990,0 1020,10 Q1050,20 1080,10 Q1110,0 1140,10 Q1170,20 1200,10 V20 H0 Z"
          fill={colors.paper}
          stroke="none"
        />
      </svg>
    </div>
  );

  // Paint splatter component
  const PaintSplatter = ({ x, y, color, size }: { x: number, y: number, color: string, size: number }) => (
    <div
      className="fixed pointer-events-none z-20 animate-pulse"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, ${color}80 60%, transparent 100%)`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );

  // Artistic header
  const renderHeader = () => (
    <header className="relative min-h-screen overflow-hidden" style={{ background: colors.paper }}>
      <PaperTexture />
      
      {/* Artistic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 opacity-20 animate-pulse">
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors.primary} blur-2xl`} />
        </div>
        <div className="absolute bottom-20 right-20 w-80 h-80 opacity-15 animate-pulse" style={{ animationDelay: '2s' }}>
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors.secondary} blur-3xl`} />
        </div>
        
        {/* Artistic shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-30 animate-bounce" style={{ animationDelay: '1s' }}>
          <Triangle className="w-full h-full" style={{ color: colors.paint }} />
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 opacity-25 animate-pulse" style={{ animationDelay: '3s' }}>
          <Circle className="w-full h-full" style={{ color: colors.accent }} />
        </div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 opacity-20 animate-spin" style={{ animationDuration: '10s' }}>
          <Square className="w-full h-full" style={{ color: colors.sketch }} />
        </div>
      </div>

      {/* Interactive mouse trail */}
      <div 
        className="fixed w-12 h-12 pointer-events-none z-30 transition-all duration-300"
        style={{
          left: mousePosition.x - 24,
          top: mousePosition.y - 24,
          background: `radial-gradient(circle, ${colors.paint}40 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: hoveredCard ? 'scale(2)' : 'scale(1)',
        }}
      />

      <div className="relative z-20 flex items-center justify-center min-h-screen px-8">
        <div className="text-center max-w-6xl mx-auto">
          {/* Artistic avatar */}
          <div className="relative inline-block mb-12">
            <div className="relative">
              <div className="w-40 h-40 rounded-3xl bg-white shadow-2xl border-4 border-white transform rotate-3 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-20`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-black" style={{ color: colors.ink }}>
                    {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 
                     getTemplateText(templateText, 'creative-portfolio', 'fallbackName').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full shadow-md" />
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-yellow-400 rounded-full shadow-md" />
              </div>
              
              {/* Artistic decorations */}
              <div className="absolute -top-6 -right-6 w-16 h-16 opacity-60">
                <Brush className="w-full h-full" style={{ color: colors.paint }} />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 opacity-50">
                <Palette className="w-full h-full" style={{ color: colors.accent }} />
              </div>
            </div>
          </div>

          {/* Artistic title */}
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-4 relative" style={{ color: colors.ink }}>
              <span className="relative z-10">
                {resumeData.contact?.name || getTemplateText(templateText, 'creative-portfolio', 'fallbackName')}
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-30 transform -rotate-1 rounded-lg z-0" />
            </h1>
            
            {/* Hand-drawn underline */}
            <div className="flex justify-center mt-4">
              <svg width="300" height="20" viewBox="0 0 300 20" className="opacity-60">
                <path 
                  d="M10,15 Q50,5 100,12 Q150,20 200,8 Q250,15 290,10"
                  stroke={colors.paint}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Artistic tagline */}
          <div className="relative mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg transform -rotate-1 border-l-8 border-r-8" style={{ borderColor: colors.accent }}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <Paintbrush className="w-8 h-8" style={{ color: colors.paint }} />
                <span className="text-2xl md:text-3xl font-bold" style={{ color: colors.ink }}>
                  {getTemplateText(templateText, 'creative-portfolio', 'tagline')}
                </span>
                <PenTool className="w-8 h-8" style={{ color: colors.accent }} />
              </div>
              <p className="text-lg leading-relaxed" style={{ color: colors.sketch }}>
                {resumeData.summary || getTemplateText(templateText, 'creative-portfolio', 'fallbackSummary')}
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full shadow-lg" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full shadow-lg" />
          </div>

          {/* Artistic CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
            <button
              className="group relative overflow-hidden px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 bg-white shadow-2xl border-4 transform hover:rotate-1"
              style={{ borderColor: colors.accent }}
              onMouseEnter={() => setIsDrawing(true)}
              onMouseLeave={() => setIsDrawing(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center space-x-3">
                <Palette className="w-8 h-8" style={{ color: colors.paint }} />
                <span style={{ color: colors.ink }}>View My Work</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" style={{ color: colors.accent }} />
              </div>
            </button>

            <button className="group relative overflow-hidden px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 bg-white shadow-2xl border-4 transform hover:-rotate-1" style={{ borderColor: colors.paint }}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center space-x-3">
                <Mail className="w-8 h-8" style={{ color: colors.accent }} />
                <span style={{ color: colors.ink }}>Let's Collaborate</span>
                <Heart className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: colors.paint }} />
              </div>
            </button>
          </div>

          {/* Artistic contact cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {resumeData.contact?.email && (
              <div
                className="group relative bg-white rounded-2xl p-8 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border-t-8"
                style={{ borderColor: colors.accent }}
                onMouseEnter={() => setHoveredCard('email')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -top-4 -right-2 w-8 h-8 bg-green-400 rounded-full shadow-lg" />
                <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: colors.paint }} />
                <div className="text-lg font-bold mb-2" style={{ color: colors.ink }}>
                  Drop me a line
                </div>
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="text-base hover:underline"
                  style={{ color: colors.sketch }}
                >
                  {resumeData.contact.email}
                </a>
              </div>
            )}
            
            {resumeData.contact?.phone && (
              <div
                className="group relative bg-white rounded-2xl p-8 shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 border-t-8"
                style={{ borderColor: colors.paint }}
                onMouseEnter={() => setHoveredCard('phone')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -top-4 -left-2 w-8 h-8 bg-blue-400 rounded-full shadow-lg" />
                <Phone className="w-12 h-12 mx-auto mb-4" style={{ color: colors.accent }} />
                <div className="text-lg font-bold mb-2" style={{ color: colors.ink }}>
                  Give me a call
                </div>
                <a
                  href={`tel:${resumeData.contact.phone}`}
                  className="text-base hover:underline"
                  style={{ color: colors.sketch }}
                >
                  {resumeData.contact.phone}
                </a>
              </div>
            )}
            
            {resumeData.contact?.location && (
              <div
                className="group relative bg-white rounded-2xl p-8 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border-t-8"
                style={{ borderColor: colors.secondary.split(' ')[1] }}
                onMouseEnter={() => setHoveredCard('location')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -top-4 -right-2 w-8 h-8 bg-purple-400 rounded-full shadow-lg" />
                <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: colors.paint }} />
                <div className="text-lg font-bold mb-2" style={{ color: colors.ink }}>
                  Find me at
                </div>
                <div className="text-base" style={{ color: colors.sketch }}>
                  {resumeData.contact.location}
                </div>
              </div>
            )}
          </div>

          {/* Social links with artistic style */}
          <div className="flex justify-center gap-6 mt-12">
            {resumeData.contact?.linkedin && (
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-16 h-16 bg-white rounded-full shadow-xl border-4 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                style={{ borderColor: colors.accent }}
              >
                <Linkedin className="w-8 h-8 group-hover:rotate-12 transition-transform" style={{ color: colors.paint }} />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
              </a>
            )}
            {resumeData.contact?.github && (
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-16 h-16 bg-white rounded-full shadow-xl border-4 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                style={{ borderColor: colors.paint }}
              >
                <Github className="w-8 h-8 group-hover:rotate-12 transition-transform" style={{ color: colors.accent }} />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-800 rounded-full" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <TornEdge bottom />
    </header>
  );

  // Artistic Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 px-8 relative" style={{ background: colors.paper }}>
        <TornEdge top />
        <PaperTexture />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Artistic section header */}
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: colors.ink }}>
                {getSectionHeading(sectionHeadings, 'experience')}
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 opacity-40 transform -rotate-2 rounded-lg -z-10" />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <Briefcase className="w-12 h-12" style={{ color: colors.paint }} />
              <div className="w-32 h-4 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full opacity-60" />
              <Clock className="w-12 h-12" style={{ color: colors.accent }} />
            </div>
          </div>

          {/* Experience timeline */}
          <div className="space-y-12">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="group relative">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Experience card */}
                  <div className="flex-1">
                    <div
                      className="bg-white rounded-3xl p-8 shadow-2xl border-l-8 transform hover:scale-105 transition-all duration-300 relative"
                      style={{ borderColor: colors.accent }}
                      onMouseEnter={() => setHoveredCard(`exp-${index}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full shadow-lg" />
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full shadow-lg" />
                      
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black mb-2" style={{ color: colors.ink }}>
                            {exp.position}
                          </h3>
                          <div className="text-xl font-bold" style={{ color: colors.paint }}>
                            {exp.company}
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-2 mt-2" style={{ color: colors.sketch }}>
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full border-2" style={{ borderColor: colors.accent }}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" style={{ color: colors.paint }} />
                            <span className="font-bold" style={{ color: colors.ink }}>
                              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {exp.responsibilities && (
                        <div className="space-y-4">
                          {exp.responsibilities.map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center mt-1">
                                <Star className="w-3 h-3 text-white" />
                              </div>
                              <p className="text-lg leading-relaxed" style={{ color: colors.sketch }}>
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="lg:w-32 flex lg:flex-col justify-center items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-white">{index + 1}</span>
                    </div>
                    {index < resumeData.experience.length - 1 && (
                      <div className="hidden lg:block w-2 h-16 bg-gradient-to-b from-pink-300 to-purple-300 rounded-full opacity-60" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <TornEdge bottom />
      </section>
    );
  };

  // Artistic Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-gradient-to-br from-blue-50 to-purple-50">
        <TornEdge top />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: colors.ink }}>
                {getSectionHeading(sectionHeadings, 'skills')}
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-blue-200 opacity-40 transform rotate-2 rounded-lg -z-10" />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <PenTool className="w-12 h-12" style={{ color: colors.paint }} />
              <div className="w-32 h-4 bg-gradient-to-r from-green-300 to-blue-300 rounded-full opacity-60" />
              <Layers className="w-12 h-12" style={{ color: colors.accent }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeData.skills.map((skillCategory, index) => (
              <div key={index} className="group relative">
                <div
                  className="bg-white rounded-3xl p-8 shadow-2xl border-t-8 transform hover:scale-105 hover:rotate-1 transition-all duration-300 relative"
                  style={{ borderColor: colors.accent }}
                  onMouseEnter={() => setHoveredCard(`skill-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full shadow-lg" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full shadow-lg" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center shadow-lg">
                      <Layers className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black" style={{ color: colors.ink }}>
                      {skillCategory.category}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {skillCategory.items.map((item, i) => (
                      <div key={i} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold" style={{ color: colors.sketch }}>
                            {item}
                          </span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, j) => (
                              <div
                                key={j}
                                className={`w-3 h-3 rounded-full ${
                                  j < 4 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000"
                            style={{ width: '80%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <TornEdge bottom />
      </section>
    );
  };

  // Artistic Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className="py-20 px-8 relative" style={{ background: colors.paper }}>
        <TornEdge top />
        <PaperTexture />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: colors.ink }}>
                {getSectionHeading(sectionHeadings, 'projects')}
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-200 to-yellow-200 opacity-40 transform -rotate-1 rounded-lg -z-10" />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <Lightbulb className="w-12 h-12" style={{ color: colors.paint }} />
              <div className="w-32 h-4 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full opacity-60" />
              <Zap className="w-12 h-12" style={{ color: colors.accent }} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="group relative">
                <div
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl border-8 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 relative"
                  style={{ borderColor: colors.accent }}
                  onMouseEnter={() => setHoveredCard(`project-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full shadow-lg z-10" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full shadow-lg z-10" />
                  
                  {/* Project header */}
                  <div className="p-8 bg-gradient-to-r from-pink-100 to-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-black" style={{ color: colors.ink }}>
                        {project.name}
                      </h3>
                      <div className="flex gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2"
                            style={{ borderColor: colors.accent }}
                          >
                            <Github className="w-6 h-6" style={{ color: colors.paint }} />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2"
                            style={{ borderColor: colors.paint }}
                          >
                            <ExternalLink className="w-6 h-6" style={{ color: colors.accent }} />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.technologies && (
                      <div className="flex flex-wrap gap-3">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-bold border-2 transform hover:scale-105 transition-transform"
                            style={{ borderColor: colors.accent, color: colors.ink }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project content */}
                  <div className="p-8">
                    {project.description && (
                      <p className="text-lg leading-relaxed mb-6" style={{ color: colors.sketch }}>
                        {project.description}
                      </p>
                    )}
                    
                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.sketch }}>
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold">
                          {project.startDate} {project.endDate && `- ${project.endDate}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <TornEdge bottom />
      </section>
    );
  };

  // Artistic Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-gradient-to-br from-green-50 to-blue-50">
        <TornEdge top />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: colors.ink }}>
                {getSectionHeading(sectionHeadings, 'education')}
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-blue-200 opacity-40 transform rotate-1 rounded-lg -z-10" />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <GraduationCap className="w-12 h-12" style={{ color: colors.paint }} />
              <div className="w-32 h-4 bg-gradient-to-r from-green-300 to-blue-300 rounded-full opacity-60" />
              <Award className="w-12 h-12" style={{ color: colors.accent }} />
            </div>
          </div>

          <div className="space-y-8">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="group relative">
                <div
                  className="bg-white rounded-3xl p-8 shadow-2xl border-r-8 transform hover:scale-105 hover:rotate-1 transition-all duration-300 relative"
                  style={{ borderColor: colors.accent }}
                  onMouseEnter={() => setHoveredCard(`edu-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full shadow-lg" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full shadow-lg" />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black mb-2" style={{ color: colors.ink }}>
                          {edu.degree}
                        </h3>
                        <div className="text-xl font-bold" style={{ color: colors.paint }}>
                          {edu.institution}
                        </div>
                        {edu.location && (
                          <div className="flex items-center gap-2 mt-2" style={{ color: colors.sketch }}>
                            <MapPin className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 lg:mt-0">
                      {edu.graduationDate && (
                        <div className="inline-block bg-gradient-to-r from-blue-100 to-green-100 px-6 py-3 rounded-full border-2" style={{ borderColor: colors.accent }}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" style={{ color: colors.paint }} />
                            <span className="font-bold" style={{ color: colors.ink }}>
                              {formatDate(edu.graduationDate)}
                            </span>
                          </div>
                        </div>
                      )}
                      {edu.gpa && (
                        <p className="text-lg font-bold mt-3" style={{ color: colors.sketch }}>
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <TornEdge bottom />
      </section>
    );
  };

  // Artistic Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 px-8 relative" style={{ background: colors.paper }}>
        <TornEdge top />
        <PaperTexture />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: colors.ink }}>
                {getSectionHeading(sectionHeadings, 'certifications')}
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200 to-orange-200 opacity-40 transform -rotate-2 rounded-lg -z-10" />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <Award className="w-12 h-12" style={{ color: colors.paint }} />
              <div className="w-32 h-4 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-60" />
              <Star className="w-12 h-12" style={{ color: colors.accent }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="group relative">
                <div
                  className="bg-white rounded-3xl p-8 shadow-2xl border-4 transform hover:scale-105 hover:rotate-1 transition-all duration-300 relative"
                  style={{ borderColor: colors.accent }}
                  onMouseEnter={() => setHoveredCard(`cert-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full shadow-lg" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black" style={{ color: colors.ink }}>
                        {cert}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <TornEdge bottom />
      </section>
    );
  };

  // Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 px-8 relative bg-gradient-to-br from-purple-50 to-pink-50">
        <TornEdge top />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: colors.ink }}>
                {section.title}
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-pink-200 opacity-40 transform rotate-1 rounded-lg -z-10" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border-8 relative" style={{ borderColor: colors.accent }}>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-400 rounded-full shadow-lg" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full shadow-lg" />
            
            {section.type === 'text' && (
              <p className="text-xl leading-relaxed" style={{ color: colors.sketch }}>
                {section.content}
              </p>
            )}

            {section.type === 'list' && (
              <ul className="space-y-6">
                {section.items?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mt-1">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-medium" style={{ color: colors.ink }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
              <div className="space-y-8">
                {section.items?.map((item: any, index: number) => (
                  <div key={index} className="border-l-8 pl-6 py-4" style={{ borderColor: colors.accent }}>
                    <h3 className="text-2xl font-black mb-2" style={{ color: colors.ink }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-lg mb-4" style={{ color: colors.sketch }}>
                        {item.description}
                      </p>
                    )}
                    {item.date && (
                      <div className="flex items-center gap-2" style={{ color: colors.sketch }}>
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold">{formatDate(item.date)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <TornEdge bottom />
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
    <div className="min-h-screen relative" style={{ background: colors.paper }}>
      {/* Interactive canvas for drawing effects */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        width={typeof window !== 'undefined' ? window.innerWidth : 0}
        height={typeof window !== 'undefined' ? window.innerHeight : 0}
      />
      
      {/* Paint splatters */}
      {paintSplatters.map((splatter, index) => (
        <PaintSplatter
          key={index}
          x={splatter.x}
          y={splatter.y}
          color={splatter.color}
          size={splatter.size}
        />
      ))}

      {/* Render Header */}
      {renderHeader()}

      {/* Render Sections in Order */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}

      {/* Artistic Footer */}
      <footer className="py-20 px-8 relative bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm border-8 border-white/20 rounded-3xl p-12 relative">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-red-400 rounded-full shadow-lg" />
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-yellow-400 rounded-full shadow-lg" />
            
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-5xl font-black text-white mb-6">
              Let's Create Magic Together!
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Ready to bring your wildest ideas to life with creativity and passion
            </p>
            
            <div className="flex justify-center gap-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Brush className="w-8 h-8 text-green-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 