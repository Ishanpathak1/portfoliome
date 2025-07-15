'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, Brain, Rocket, Globe, Users, Award, TrendingUp,
  Code2, Database, Cloud, Github, ExternalLink, ArrowRight,
  Binary, Activity, Shield, Workflow, Terminal, Lightbulb,
  Target, BarChart3, CheckCircle, Star, Trophy, Sparkles,
  Briefcase, GraduationCap, Calendar, MapPin, Mail, Phone, Linkedin,
  Atom, Beaker, CircuitBoard, Gamepad2, Layers, Mic, 
  Navigation, Radar, Satellite, Wand2, Wifi, Microscope,
  Gauge, Orbit, Scan, Blocks, Network, Waves, Flashlight
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface TechInnovatorTemplateProps {
  portfolio: DatabasePortfolio;
}

interface HolographicColors {
  primary: string;
  secondary: string;
  accent: string;
  neon: string;
  quantum: string;
  neural: string;
  particle: string;
  hologram: string;
}

export function TechInnovatorTemplate({ portfolio }: TechInnovatorTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number, size: number, color: string}>>([]);
  const [quantumState, setQuantumState] = useState(0);
  const [neuralActivity, setNeuralActivity] = useState<number[]>([]);
  const [hologramGlow, setHologramGlow] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [innovationMetrics, setInnovationMetrics] = useState({
    aiProgress: 0,
    quantumComputing: 0,
    neuralNetworks: 0,
    innovation: 0
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  // Holographic color schemes
  const getHolographicColors = (scheme: string): HolographicColors => {
    const palettes: Record<string, HolographicColors> = {
      blue: {
        primary: '#00d4ff',
        secondary: '#0099ff',
        accent: '#33e6ff',
        neon: '#00ffff',
        quantum: '#007acc',
        neural: '#4d9aff',
        particle: '#80ccff',
        hologram: '#b3e6ff'
      },
      purple: {
        primary: '#b537f2',
        secondary: '#9d4edd',
        accent: '#d946ef',
        neon: '#ff00ff',
        quantum: '#7209b7',
        neural: '#c77dff',
        particle: '#e0aaff',
        hologram: '#f5d5ff'
      },
      green: {
        primary: '#00ff88',
        secondary: '#00e676',
        accent: '#39ff14',
        neon: '#00ff00',
        quantum: '#00c851',
        neural: '#69f0ae',
        particle: '#b9f6ca',
        hologram: '#e8f5e8'
      },
      orange: {
        primary: '#ff6b1a',
        secondary: '#ff9500',
        accent: '#ffb347',
        neon: '#ff8c00',
        quantum: '#ff6600',
        neural: '#ffab40',
        particle: '#ffd180',
        hologram: '#fff3e0'
      }
    };
    return palettes[scheme] || palettes.blue;
  };

  const colors = getHolographicColors(personalization?.colorScheme || 'blue');

  // Initialize particle system
  useEffect(() => {
    const initParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: [colors.primary, colors.secondary, colors.accent, colors.neon][Math.floor(Math.random() * 4)]
        });
      }
      setParticles(newParticles);
    };

    initParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        const newX = particle.x + particle.vx;
        const newY = particle.y + particle.vy;
        return {
          ...particle,
          x: newX > window.innerWidth ? 0 : newX < 0 ? window.innerWidth : newX,
          y: newY > window.innerHeight ? 0 : newY < 0 ? window.innerHeight : newY
        };
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [colors]);

  // Quantum state animation
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Neural network activity
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralActivity(prev => {
        const newActivity = [...prev];
        newActivity.push(Math.random() * 100);
        return newActivity.slice(-20);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Innovation metrics animation
  useEffect(() => {
    const interval = setInterval(() => {
      setInnovationMetrics(prev => ({
        aiProgress: Math.min(prev.aiProgress + Math.random() * 2, 100),
        quantumComputing: Math.min(prev.quantumComputing + Math.random() * 1.5, 100),
        neuralNetworks: Math.min(prev.neuralNetworks + Math.random() * 2.5, 100),
        innovation: Math.min(prev.innovation + Math.random() * 1.8, 100)
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Hologram effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHologramGlow(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle component
  const Particle = ({ particle }: { particle: any }) => (
    <div
      className="fixed pointer-events-none z-10 rounded-full opacity-60 animate-pulse"
      style={{
        left: particle.x,
        top: particle.y,
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
      }}
    />
  );

  // Quantum grid background
  const QuantumGrid = () => (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
        {Array.from({ length: 400 }).map((_, i) => (
          <div
            key={i}
            className="border border-current animate-pulse"
            style={{
              borderColor: colors.quantum,
              animationDelay: `${i * 0.01}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
    </div>
  );

  // Neural network visualization
  const NeuralNetwork = () => (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <svg width="100%" height="100%" className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <g key={i}>
            <circle
              cx={Math.random() * 100 + '%'}
              cy={Math.random() * 100 + '%'}
              r={Math.random() * 3 + 1}
              fill={colors.neural}
              className="animate-pulse"
            />
            <line
              x1={Math.random() * 100 + '%'}
              y1={Math.random() * 100 + '%'}
              x2={Math.random() * 100 + '%'}
              y2={Math.random() * 100 + '%'}
              stroke={colors.neural}
              strokeWidth="0.5"
              opacity="0.3"
            />
          </g>
        ))}
      </svg>
    </div>
  );

  // Innovation metrics display
  const InnovationMetrics = () => (
    <div className="fixed top-8 right-8 bg-black/90 backdrop-blur-xl border-2 rounded-2xl p-6 z-20 min-w-[300px]" style={{ borderColor: colors.primary }}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-6 h-6" style={{ color: colors.neon }} />
        Innovation Metrics
      </h3>
      <div className="space-y-4">
        {Object.entries(innovationMetrics).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span style={{ color: colors.accent }}>{Math.round(value)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${value}%`,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 0 10px ${colors.primary}`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Holographic header
  const renderHeader = () => (
    <header className="relative min-h-screen overflow-hidden bg-black">
      {/* Particle background */}
      {particles.map((particle, i) => (
        <Particle key={i} particle={particle} />
      ))}
      
      {/* Quantum grid */}
      <QuantumGrid />
      
      {/* Neural network */}
      <NeuralNetwork />
      
      {/* Innovation metrics */}
      <InnovationMetrics />
      
      {/* Interactive cursor effect */}
      <div
        className="fixed w-20 h-20 pointer-events-none z-30 rounded-full transition-all duration-300"
        style={{
          left: mousePosition.x - 40,
          top: mousePosition.y - 40,
          background: `radial-gradient(circle, ${colors.primary}30 0%, transparent 70%)`,
          boxShadow: `0 0 30px ${colors.primary}50`
        }}
      />
      
      {/* Holographic orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse" style={{ backgroundColor: colors.primary }} />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse" style={{ backgroundColor: colors.secondary, animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse" style={{ backgroundColor: colors.accent, animationDelay: '2s' }} />
      </div>

      <div className="relative z-20 flex items-center justify-center min-h-screen px-8">
        <div className="text-center max-w-6xl mx-auto">
          {/* Holographic avatar */}
          <div className="relative mb-12">
            <div className="inline-block relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 flex items-center justify-center relative overflow-hidden"
                style={{ borderColor: colors.primary }}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current to-transparent opacity-20 animate-pulse" style={{ color: colors.hologram }} />
                <span className="text-5xl font-black text-white relative z-10">
                  {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 'TI'}
                </span>
                <div className="absolute inset-0 border-2 rounded-full animate-ping" style={{ borderColor: colors.neon }} />
              </div>
              
              {/* Floating tech elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 animate-spin" style={{ animationDuration: '10s' }}>
                <Atom className="w-full h-full" style={{ color: colors.quantum }} />
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 animate-bounce">
                <CircuitBoard className="w-full h-full" style={{ color: colors.neural }} />
              </div>
              <div className="absolute -top-4 -left-8 w-10 h-10 animate-pulse">
                <Cpu className="w-full h-full" style={{ color: colors.accent }} />
              </div>
            </div>
          </div>

          {/* Holographic title */}
          <div className="mb-8 relative">
            <h1 className="text-7xl md:text-9xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent animate-pulse" style={{ color: colors.hologram }}>
                {resumeData.contact?.name || 'Tech Innovator'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 animate-pulse" style={{ color: colors.primary }} />
            </h1>
            
            {/* Holographic subtitle */}
            <div className="relative">
              <div className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
                <span className="text-gray-400">&gt;</span>
                <span className="animate-pulse ml-2" style={{ color: colors.primary }}>
                  Pioneering Tomorrow's Technology
                </span>
              </div>
              <div className="text-xl md:text-2xl text-gray-300 mb-8">
                <span className="animate-pulse">AI • Quantum Computing • Neural Networks • Innovation</span>
              </div>
            </div>
          </div>

          {/* Quantum state display */}
          <div className="mb-12 relative">
            <div className="bg-black/90 backdrop-blur-xl border-2 rounded-2xl p-8 max-w-4xl mx-auto" style={{ borderColor: colors.primary }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.primary }}>
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">AI</div>
                  <div className="text-sm text-gray-400">Artificial Intelligence</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.quantum }}>
                    <Atom className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">Quantum</div>
                  <div className="text-sm text-gray-400">Computing</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.neural }}>
                    <Network className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">Neural</div>
                  <div className="text-sm text-gray-400">Networks</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.accent }}>
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">Innovation</div>
                  <div className="text-sm text-gray-400">Future Tech</div>
                </div>
              </div>
              
              {resumeData.summary && (
                <div className="mt-8 p-6 bg-gradient-to-r from-transparent via-current to-transparent rounded-xl" style={{ color: colors.hologram + '10' }}>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {resumeData.summary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Holographic contact interface */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {resumeData.contact?.email && (
              <div
                className="group relative bg-black/90 backdrop-blur-xl border-2 rounded-2xl p-8 hover:border-current transition-all duration-300 cursor-pointer"
                style={{ borderColor: colors.primary }}
                onMouseEnter={() => setActiveNode('email')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl" style={{ color: colors.primary }} />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.primary }}>
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-lg font-bold text-white mb-2">Neural Link</div>
                  <a
                    href={`mailto:${resumeData.contact.email}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {resumeData.contact.email}
                  </a>
                </div>
              </div>
            )}
            
            {resumeData.contact?.phone && (
              <div
                className="group relative bg-black/90 backdrop-blur-xl border-2 rounded-2xl p-8 hover:border-current transition-all duration-300 cursor-pointer"
                style={{ borderColor: colors.secondary }}
                onMouseEnter={() => setActiveNode('phone')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl" style={{ color: colors.secondary }} />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.secondary }}>
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-lg font-bold text-white mb-2">Quantum Call</div>
                  <a
                    href={`tel:${resumeData.contact.phone}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {resumeData.contact.phone}
                  </a>
                </div>
              </div>
            )}
            
            {resumeData.contact?.location && (
              <div
                className="group relative bg-black/90 backdrop-blur-xl border-2 rounded-2xl p-8 hover:border-current transition-all duration-300"
                style={{ borderColor: colors.accent }}
                onMouseEnter={() => setActiveNode('location')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl" style={{ color: colors.accent }} />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.accent }}>
                    <Satellite className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-lg font-bold text-white mb-2">Geo Location</div>
                  <div className="text-gray-300">
                    {resumeData.contact.location}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Holographic social links */}
          <div className="flex justify-center gap-8">
            {resumeData.contact?.github && (
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center hover:scale-110 transition-transform duration-300"
                style={{ color: colors.primary }}
              >
                <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: colors.primary }} />
                <Github className="w-10 h-10 text-white relative z-10" />
              </a>
            )}
            {resumeData.contact?.linkedin && (
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center hover:scale-110 transition-transform duration-300"
                style={{ color: colors.secondary }}
              >
                <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: colors.secondary }} />
                <Linkedin className="w-10 h-10 text-white relative z-10" />
              </a>
            )}
            {resumeData.contact?.website && (
              <a
                href={resumeData.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center hover:scale-110 transition-transform duration-300"
                style={{ color: colors.accent }}
              >
                <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: colors.accent }} />
                <Globe className="w-10 h-10 text-white relative z-10" />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Holographic Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent" style={{ color: colors.hologram }}>
                Experience
              </span>
              <span className="text-white"> Matrix</span>
            </h2>
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-current to-transparent mx-auto rounded-full" style={{ color: colors.primary }} />
          </div>

          <div className="space-y-12">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="group relative">
                <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-8 relative overflow-hidden hover:border-current transition-all duration-500" style={{ borderColor: colors.primary }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ color: colors.primary }} />
                  
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-6 mb-6">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.primary }}>
                            <Briefcase className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-4xl font-black text-white mb-2">{exp.position}</h3>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.neon }} />
                              <span className="text-2xl font-bold" style={{ color: colors.secondary }}>
                                {exp.company}
                              </span>
                            </div>
                            {exp.location && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Satellite className="w-5 h-5" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0">
                        <div className="bg-gradient-to-r from-current to-transparent rounded-2xl p-6 border-2" style={{ color: colors.quantum + '20', borderColor: colors.quantum }}>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6" style={{ color: colors.quantum }} />
                            <span className="text-white font-bold text-lg">
                              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {exp.responsibilities && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {exp.responsibilities.map((item, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-3 h-3 rounded-full mt-3 animate-pulse" style={{ backgroundColor: colors.neon }} />
                            <p className="text-gray-300 text-lg leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Holographic corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.accent }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Holographic Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent" style={{ color: colors.hologram }}>
                Neural
              </span>
              <span className="text-white"> Network</span>
            </h2>
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-current to-transparent mx-auto rounded-full" style={{ color: colors.neural }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeData.skills.map((skillCategory, index) => (
              <div key={index} className="group relative">
                <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-8 relative overflow-hidden hover:border-current transition-all duration-500 h-full" style={{ borderColor: colors.neural }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ color: colors.neural }} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.neural }}>
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white">
                        {skillCategory.category}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {skillCategory.items.map((item, i) => (
                        <div key={i} className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-300 font-bold text-lg">{item}</span>
                            <div className="flex gap-2">
                              {[...Array(5)].map((_, j) => (
                                <div
                                  key={j}
                                  className={`w-3 h-3 rounded-full ${j < 4 ? 'bg-current animate-pulse' : 'bg-gray-700'}`}
                                  style={{ color: j < 4 ? colors.neon : undefined }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-current to-transparent rounded-full transition-all duration-1000"
                              style={{ 
                                width: '85%',
                                color: colors.neon,
                                boxShadow: `0 0 10px ${colors.neon}`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Holographic corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.neural }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.neural }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Holographic Projects Section
  const renderProjectsSection = () => {
    if (!resumeData.projects?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent" style={{ color: colors.hologram }}>
                Innovation
              </span>
              <span className="text-white"> Lab</span>
            </h2>
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-current to-transparent mx-auto rounded-full" style={{ color: colors.accent }} />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="group relative">
                <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl overflow-hidden hover:border-current transition-all duration-500 h-full" style={{ borderColor: colors.accent }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ color: colors.accent }} />
                  
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.accent }}>
                          <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-black text-white">{project.name}</h3>
                      </div>
                      <div className="flex gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-current to-transparent flex items-center justify-center hover:scale-110 transition-transform duration-300"
                            style={{ color: colors.primary }}
                          >
                            <Github className="w-6 h-6 text-white" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-current to-transparent flex items-center justify-center hover:scale-110 transition-transform duration-300"
                            style={{ color: colors.secondary }}
                          >
                            <ExternalLink className="w-6 h-6 text-white" />
                          </a>
                        )}
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        {project.description}
                      </p>
                    )}

                    {project.technologies && (
                      <div className="flex flex-wrap gap-3 mb-8">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 rounded-full text-sm font-bold border-2 bg-gradient-to-r from-current to-transparent"
                            style={{ 
                              color: colors.neon + '20',
                              borderColor: colors.neon,
                              backgroundColor: colors.neon + '10'
                            }}
                          >
                            <span className="text-white">{tech}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-current to-transparent rounded-2xl p-4 border-2" style={{ color: colors.quantum + '20', borderColor: colors.quantum }}>
                        <Calendar className="w-5 h-5" style={{ color: colors.quantum }} />
                        <span className="text-white font-bold">
                          {project.startDate} {project.endDate && `- ${project.endDate}`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Holographic corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.accent }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Holographic Education Section
  const renderEducationSection = () => {
    if (!resumeData.education?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent" style={{ color: colors.hologram }}>
                Knowledge
              </span>
              <span className="text-white"> Base</span>
            </h2>
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-current to-transparent mx-auto rounded-full" style={{ color: colors.primary }} />
          </div>

          <div className="space-y-8">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="group relative">
                <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-8 relative overflow-hidden hover:border-current transition-all duration-500" style={{ borderColor: colors.primary }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ color: colors.primary }} />
                  
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-6 mb-6 lg:mb-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.primary }}>
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-white mb-2">{edu.degree}</h3>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.neon }} />
                            <span className="text-xl font-bold" style={{ color: colors.secondary }}>
                              {edu.institution}
                            </span>
                          </div>
                          {edu.location && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Satellite className="w-5 h-5" />
                              <span>{edu.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6 lg:mt-0">
                        {edu.graduationDate && (
                          <div className="bg-gradient-to-r from-current to-transparent rounded-2xl p-6 border-2" style={{ color: colors.quantum + '20', borderColor: colors.quantum }}>
                            <div className="flex items-center gap-3">
                              <Calendar className="w-6 h-6" style={{ color: colors.quantum }} />
                              <span className="text-white font-bold text-lg">
                                {formatDate(edu.graduationDate)}
                              </span>
                            </div>
                          </div>
                        )}
                        {edu.gpa && (
                          <p className="text-gray-300 mt-4 text-lg font-bold">
                            GPA: <span style={{ color: colors.accent }}>{edu.gpa}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Holographic corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.primary }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.primary }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Holographic Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent" style={{ color: colors.hologram }}>
                Digital
              </span>
              <span className="text-white"> Credentials</span>
            </h2>
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-current to-transparent mx-auto rounded-full" style={{ color: colors.secondary }} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="group relative">
                <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-8 relative overflow-hidden hover:border-current transition-all duration-500" style={{ borderColor: colors.secondary }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ color: colors.secondary }} />
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.secondary }}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{cert}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.neon }} />
                        <span className="text-gray-400">Verified Credential</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Holographic corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.secondary }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.secondary }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-current to-white bg-clip-text text-transparent" style={{ color: colors.hologram }}>
                {section.title}
              </span>
            </h2>
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-current to-transparent mx-auto rounded-full" style={{ color: colors.accent }} />
          </div>

          <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-8 relative overflow-hidden" style={{ borderColor: colors.accent }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-10" style={{ color: colors.accent }} />
            
            <div className="relative z-10">
              {section.type === 'text' && (
                <p className="text-gray-300 text-xl leading-relaxed">
                  {section.content}
                </p>
              )}

              {section.type === 'list' && (
                <ul className="space-y-6">
                  {section.items?.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full mt-3 animate-pulse" style={{ backgroundColor: colors.neon }} />
                      <span className="text-gray-300 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
                <div className="space-y-8">
                  {section.items?.map((item: any, index: number) => (
                    <div key={index} className="border-l-4 pl-6 py-4" style={{ borderLeftColor: colors.accent }}>
                      <h3 className="text-2xl font-black text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 mb-4 text-lg">{item.description}</p>
                      )}
                      {item.date && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="font-bold">{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Holographic corner elements */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.accent }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.accent }} />
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Render particles */}
      {particles.map((particle, i) => (
        <Particle key={i} particle={particle} />
      ))}
      
      {/* Render Header */}
      {renderHeader()}

      {/* Render Sections in Order */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}

      {/* Holographic Footer */}
      <footer className="py-20 px-8 relative bg-black overflow-hidden">
        <QuantumGrid />
        <NeuralNetwork />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-12 relative overflow-hidden" style={{ borderColor: colors.primary }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-10" style={{ color: colors.primary }} />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.primary }}>
                  <Rocket className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-5xl font-black text-white mb-6">
                Ready to Innovate the Future?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's collaborate to build tomorrow's technology with AI, quantum computing, and neural networks
              </p>
              
              <div className="flex justify-center gap-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.primary }}>
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.quantum }}>
                  <Atom className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.neural }}>
                  <Network className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-current to-transparent flex items-center justify-center" style={{ color: colors.accent }}>
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Holographic corner elements */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-50" style={{ borderColor: colors.primary }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-50" style={{ borderColor: colors.primary }} />
          </div>
        </div>
      </footer>
    </div>
  );
} 