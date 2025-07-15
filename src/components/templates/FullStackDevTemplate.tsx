'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Code2, Database, Cloud, GitBranch, Globe, Layers,
  Server, Monitor, Smartphone, Zap, Play, Pause,
  ArrowRight, ExternalLink, Github, Terminal, FileCode,
  Workflow, Container, Cpu, Wifi, Lock, TrendingUp,
  BarChart3, Users, Award, Rocket, CheckCircle,
  AlertCircle, Clock, Activity, Binary, Briefcase,
  GraduationCap, Calendar, MapPin, Mail, Phone, Linkedin,
  Star, Sparkles, Moon, Sun, Orbit, Satellite, Command
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface FullStackDevTemplateProps {
  portfolio: DatabasePortfolio;
}

interface ConstellationNode {
  id: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
  label: string;
  type: 'skill' | 'project' | 'experience';
}

interface TerminalLine {
  prompt: string;
  command: string;
  output: string;
  timestamp: string;
}

export function FullStackDevTemplate({ portfolio }: FullStackDevTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [constellation, setConstellation] = useState<ConstellationNode[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hologramEffect, setHologramEffect] = useState(0);
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    uptime: '0d 0h 0m'
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  // Terminal commands simulation
  const commands = [
    { prompt: 'dev@portfolio:~$', command: 'whoami', output: resumeData.contact?.name || 'Full Stack Developer' },
    { prompt: 'dev@portfolio:~$', command: 'pwd', output: '/home/developer/projects' },
    { prompt: 'dev@portfolio:~$', command: 'ls -la skills/', output: 'Frontend/ Backend/ DevOps/ Database/' },
    { prompt: 'dev@portfolio:~$', command: 'status --all', output: 'All systems operational ✓' },
    { prompt: 'dev@portfolio:~$', command: 'git log --oneline', output: 'feat: Deploy to production' },
  ];

  // Initialize terminal
  useEffect(() => {
    const interval = setInterval(() => {
      if (terminalLines.length < commands.length) {
        const nextCommand = commands[terminalLines.length];
        setIsTyping(true);
        
        setTimeout(() => {
          setTerminalLines(prev => [...prev, {
            ...nextCommand,
            timestamp: new Date().toLocaleTimeString()
          }]);
          setIsTyping(false);
        }, 1000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [terminalLines]);

  // System stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 20,
        memory: Math.floor(Math.random() * 40) + 30,
        network: Math.floor(Math.random() * 50) + 25,
        uptime: '15d 7h 32m'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Hologram effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHologramEffect(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Constellation network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate constellation nodes
    const nodes: ConstellationNode[] = [];
    const skills = resumeData.skills?.flatMap(s => s.items) || [];
    const projects = resumeData.projects?.map(p => p.name) || [];
    
    // Create skill nodes
    skills.slice(0, 8).forEach((skill, i) => {
      nodes.push({
        id: `skill-${i}`,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        connections: [],
        label: skill,
        type: 'skill'
      });
    });

    // Create project nodes
    projects.slice(0, 5).forEach((project, i) => {
      nodes.push({
        id: `project-${i}`,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 3,
        connections: [],
        label: project,
        type: 'project'
      });
    });

    // Create connections between nearby nodes
    nodes.forEach(node => {
      nodes.forEach(other => {
        if (node.id !== other.id) {
          const distance = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          if (distance < 200) {
            node.connections.push(other.id);
          }
        }
      });
    });

    setConstellation(nodes);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const connNode = nodes.find(n => n.id === connId);
          if (connNode) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connNode.x, connNode.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(hologramEffect * 0.1) * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const pulse = Math.sin(hologramEffect * 0.05 + node.x * 0.01) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
        
        if (node.type === 'skill') {
          ctx.fillStyle = `rgba(0, 255, 255, ${0.8 * pulse})`;
        } else if (node.type === 'project') {
          ctx.fillStyle = `rgba(255, 0, 255, ${0.8 * pulse})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 0, ${0.8 * pulse})`;
        }
        
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [hologramEffect, resumeData]);

  // Terminal Header Component
  const TerminalHeader = () => (
    <div className="bg-black border-b border-cyan-500 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-cyan-400 font-mono text-sm">dev@portfolio-system</span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-cyan-400 font-mono">
          <span>CPU: {systemStats.cpu}%</span>
          <span>MEM: {systemStats.memory}%</span>
          <span>NET: {systemStats.network}%</span>
          <span>UP: {systemStats.uptime}</span>
        </div>
      </div>
    </div>
  );

  // Holographic Card Component
  const HolographicCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div 
      className={`relative bg-black border-2 border-cyan-500 ${className}`}
      style={{
        boxShadow: `
          0 0 20px rgba(0, 255, 255, 0.3),
          inset 0 0 20px rgba(0, 255, 255, 0.1)
        `,
        background: `linear-gradient(135deg, 
          rgba(0, 0, 0, 0.9) 0%,
          rgba(0, 50, 50, 0.3) 50%,
          rgba(0, 0, 0, 0.9) 100%
        )`
      }}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.1) 2px,
            rgba(0, 255, 255, 0.1) 4px
          )`
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  // Enhanced Header Section
  const renderHeader = () => (
    <header className="relative min-h-screen bg-black overflow-hidden">
      {/* Constellation Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Matrix-like background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500/20 flex items-center justify-center"
              style={{
                animationDelay: `${i * 0.1}s`,
                animation: `pulse 3s infinite`
              }}
            >
              <div className="w-1 h-1 bg-cyan-500 rounded-full opacity-30" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Profile Terminal */}
            <div className="space-y-8">
              <HolographicCard>
                <TerminalHeader />
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-cyan-400">
                      <span className="text-white font-mono font-bold text-lg">
                        {resumeData.contact?.name?.split(' ').map(n => n[0]).join('') || 'FS'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-mono font-bold text-cyan-400">
                        {resumeData.contact?.name || 'Full Stack Developer'}
                      </h1>
                      <p className="text-purple-400 font-mono">
                        {resumeData.experience?.[0]?.position || 'System Architect'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {terminalLines.map((line, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 font-mono text-sm">{line.prompt}</span>
                          <span className="text-white font-mono text-sm">{line.command}</span>
                        </div>
                        <div className="text-cyan-400 font-mono text-sm ml-4">
                          {line.output}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-mono text-sm">dev@portfolio:~$</span>
                        <span className="text-white font-mono text-sm">
                          <span className="animate-pulse">▊</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </HolographicCard>

              {/* Contact Matrix */}
              <HolographicCard>
                <div className="p-6">
                  <h3 className="text-cyan-400 font-mono text-lg mb-4 flex items-center">
                    <Command className="w-5 h-5 mr-2" />
                    CONTACT_MATRIX
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {resumeData.contact?.email && (
                      <a
                        href={`mailto:${resumeData.contact.email}`}
                        className="flex items-center space-x-2 p-3 border border-cyan-500/50 hover:border-cyan-400 transition-colors group"
                      >
                        <Mail className="w-4 h-4 text-cyan-400 group-hover:text-purple-400" />
                        <span className="text-cyan-400 font-mono text-sm group-hover:text-purple-400">
                          EMAIL
                        </span>
                      </a>
                    )}
                    {resumeData.contact?.phone && (
                      <a
                        href={`tel:${resumeData.contact.phone}`}
                        className="flex items-center space-x-2 p-3 border border-cyan-500/50 hover:border-cyan-400 transition-colors group"
                      >
                        <Phone className="w-4 h-4 text-cyan-400 group-hover:text-purple-400" />
                        <span className="text-cyan-400 font-mono text-sm group-hover:text-purple-400">
                          PHONE
                        </span>
                      </a>
                    )}
                    {resumeData.contact?.linkedin && (
                      <a
                        href={resumeData.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 border border-cyan-500/50 hover:border-cyan-400 transition-colors group"
                      >
                        <Linkedin className="w-4 h-4 text-cyan-400 group-hover:text-purple-400" />
                        <span className="text-cyan-400 font-mono text-sm group-hover:text-purple-400">
                          LINKEDIN
                        </span>
                      </a>
                    )}
                    {resumeData.contact?.github && (
                      <a
                        href={resumeData.contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 border border-cyan-500/50 hover:border-cyan-400 transition-colors group"
                      >
                        <Github className="w-4 h-4 text-cyan-400 group-hover:text-purple-400" />
                        <span className="text-cyan-400 font-mono text-sm group-hover:text-purple-400">
                          GITHUB
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </HolographicCard>
            </div>

            {/* Right: System Dashboard */}
            <div className="space-y-8">
              <HolographicCard>
                <div className="p-6">
                  <h3 className="text-cyan-400 font-mono text-lg mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    SYSTEM_OVERVIEW
                  </h3>
                  
                  {resumeData.summary && (
                    <div className="space-y-4">
                      <div className="text-green-400 font-mono text-sm">
                        &gt; cat /profile/summary.txt
                      </div>
                      <div className="text-cyan-400 font-mono text-sm leading-relaxed border-l-2 border-cyan-500 pl-4">
                        {resumeData.summary}
                      </div>
                    </div>
                  )}
                </div>
              </HolographicCard>

              {/* Tech Stack Radar */}
              <HolographicCard>
                <div className="p-6">
                  <h3 className="text-cyan-400 font-mono text-lg mb-4 flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    TECH_STACK_RADAR
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {resumeData.skills?.slice(0, 4).map((skillCategory, index) => (
                      <div key={index} className="border border-cyan-500/30 p-3">
                        <div className="text-purple-400 font-mono text-sm mb-2">
                          {skillCategory.category.toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          {skillCategory.items.slice(0, 3).map((skill, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                              <span className="text-cyan-400 font-mono text-xs">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HolographicCard>

              {/* Performance Metrics */}
              <HolographicCard>
                <div className="p-6">
                  <h3 className="text-cyan-400 font-mono text-lg mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    PERFORMANCE_METRICS
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-green-400">
                        {resumeData.projects?.length || 0}
                      </div>
                      <div className="text-cyan-400 font-mono text-xs">PROJECTS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-purple-400">
                        {resumeData.experience?.length || 0}
                      </div>
                      <div className="text-cyan-400 font-mono text-xs">POSITIONS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-yellow-400">
                        {resumeData.skills?.reduce((acc, cat) => acc + cat.items.length, 0) || 0}
                      </div>
                      <div className="text-cyan-400 font-mono text-xs">SKILLS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-red-400">
                        {resumeData.certifications?.length || 0}
                      </div>
                      <div className="text-cyan-400 font-mono text-xs">CERTS</div>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Enhanced Experience Section
  const renderExperienceSection = () => {
    if (!resumeData.experience?.length) return null;

    return (
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Code Matrix Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="font-mono text-xs text-cyan-400 leading-4 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap">
                {Array.from({ length: 100 }).map((_, j) => (
                  <span key={j} className="inline-block animate-pulse" style={{ animationDelay: `${(i + j) * 0.1}s` }}>
                    {Math.random() > 0.5 ? '1' : '0'}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold text-cyan-400 mb-4">
              &gt; ls -la /experience/
            </h2>
            <div className="w-64 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {resumeData.experience.map((exp, index) => (
              <HolographicCard key={index} className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded border-2 border-cyan-400 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-mono font-bold text-cyan-400">
                          {exp.position}
                        </h3>
                        <div className="text-purple-400 font-mono text-sm">
                          @{exp.company}
                        </div>
                        {exp.location && (
                          <div className="text-cyan-400 font-mono text-xs mt-1">
                            {exp.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {exp.responsibilities && (
                      <div className="space-y-3">
                        <div className="text-green-400 font-mono text-sm">
                          &gt; cat responsibilities.log
                        </div>
                        {exp.responsibilities.map((item, i) => (
                          <div key={i} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-cyan-400 font-mono text-sm leading-relaxed">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-1">
                    <div className="border-l-2 border-cyan-500 pl-6">
                      <div className="text-purple-400 font-mono text-sm mb-2">
                        DURATION
                      </div>
                      <div className="text-cyan-400 font-mono text-sm">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'PRESENT'}
                      </div>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Skills Section
  const renderSkillsSection = () => {
    if (!resumeData.skills?.length) return null;

    return (
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold text-cyan-400 mb-4">
              &gt; ./skills --list-all
            </h2>
            <div className="w-64 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumeData.skills.map((skillCategory, index) => (
                <HolographicCard key={index} className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded border-2 border-cyan-400 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-cyan-400">
                      {skillCategory.category.toUpperCase()}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-green-400 font-mono text-sm">
                      &gt; cat {skillCategory.category.toLowerCase()}.txt
                    </div>
                    {skillCategory.items.map((item, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <span className="text-cyan-400 font-mono text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </HolographicCard>
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
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold text-cyan-400 mb-4">
              &gt; git log --graph --oneline
            </h2>
            <div className="w-64 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {resumeData.projects.map((project, index) => (
                <HolographicCard key={index} className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded border-2 border-purple-400 flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-mono font-bold text-purple-400">
                          {project.name}
                        </h3>
                        <div className="text-cyan-400 font-mono text-sm">
                          PROJECT_ID: {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-cyan-500/50 hover:border-cyan-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-cyan-400" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-purple-500/50 hover:border-purple-400 transition-colors"
                        >
                          <Github className="w-4 h-4 text-purple-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {project.technologies && (
                    <div className="mb-6">
                      <div className="text-green-400 font-mono text-sm mb-2">
                        &gt; cat package.json | grep dependencies
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-mono bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.description && (
                    <div className="mb-6">
                      <div className="text-green-400 font-mono text-sm mb-2">
                        &gt; cat README.md
                      </div>
                      <p className="text-cyan-400 font-mono text-sm leading-relaxed border-l-2 border-cyan-500 pl-4">
                        {project.description}
                      </p>
                    </div>
                  )}

                  {(project.startDate || project.endDate) && (
                    <div className="border-t border-cyan-500/30 pt-4">
                      <div className="text-purple-400 font-mono text-sm">
                        TIMELINE: {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </div>
                    </div>
                  )}
                </HolographicCard>
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
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold text-cyan-400 mb-4">
              &gt; find /education -type f
            </h2>
            <div className="w-64 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {resumeData.education.map((edu, index) => (
              <HolographicCard key={index} className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded border-2 border-cyan-400 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-mono font-bold text-cyan-400">
                      {edu.degree}
                    </h3>
                    <div className="text-purple-400 font-mono text-sm">
                      {edu.institution}
                    </div>
                    {edu.location && (
                      <div className="text-cyan-400 font-mono text-xs mt-1">
                        {edu.location}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {edu.graduationDate && (
                      <div className="text-green-400 font-mono text-sm">
                        {formatDate(edu.graduationDate)}
                      </div>
                    )}
                    {edu.gpa && (
                      <div className="text-cyan-400 font-mono text-xs mt-1">
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Certifications Section
  const renderCertificationsSection = () => {
    if (!resumeData.certifications?.length) return null;

    return (
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold text-cyan-400 mb-4">
              &gt; openssl verify /certs/*
            </h2>
            <div className="w-64 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {resumeData.certifications.map((cert, index) => (
                <HolographicCard key={index} className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded border-2 border-purple-400 flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-bold text-purple-400">
                        {cert}
                      </h3>
                      <div className="text-green-400 font-mono text-xs">
                        VERIFIED ✓
                      </div>
                    </div>
                  </div>
                </HolographicCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Enhanced Custom Section Renderer
  const renderCustomSection = (section: any) => {
    return (
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-mono font-bold text-cyan-400 mb-4">
              &gt; cat /{section.title.toLowerCase()}.txt
            </h2>
            <div className="w-64 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <HolographicCard className="p-8">
              {section.type === 'text' && (
                <div>
                  <div className="text-green-400 font-mono text-sm mb-4">
                    &gt; cat {section.title.toLowerCase()}.md
                  </div>
                  <p className="text-cyan-400 font-mono text-sm leading-relaxed border-l-2 border-cyan-500 pl-4">
                    {section.content}
                  </p>
                </div>
              )}

              {section.type === 'list' && (
                <div>
                  <div className="text-green-400 font-mono text-sm mb-4">
                    &gt; ls -la {section.title.toLowerCase()}/
                  </div>
                  <ul className="space-y-3">
                    {section.items?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-cyan-400 font-mono text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(section.type === 'achievements' || section.type === 'certifications' || section.type === 'publications') && (
                <div>
                  <div className="text-green-400 font-mono text-sm mb-4">
                    &gt; cat {section.title.toLowerCase()}.log
                  </div>
                  <div className="space-y-6">
                    {section.items?.map((item: any, index: number) => (
                      <div key={index} className="border-l-2 border-cyan-500 pl-6">
                        <h3 className="text-lg font-mono font-bold text-purple-400 mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-cyan-400 font-mono text-sm mb-3">
                            {item.description}
                          </p>
                        )}
                        {item.date && (
                          <div className="text-green-400 font-mono text-xs">
                            {formatDate(item.date)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </HolographicCard>
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
    <div className="min-h-screen bg-black text-cyan-400 font-mono overflow-hidden">
      {/* Terminal Boot Sequence */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-black border border-cyan-500 p-2 text-xs">
          <div className="text-green-400">SYSTEM_STATUS: ONLINE</div>
          <div className="text-cyan-400">PORTFOLIO_VERSION: 3.14.159</div>
        </div>
      </div>

      {/* Render Header */}
      {renderHeader()}

      {/* Render Sections in Order */}
      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>
          {renderSection(sectionId)}
        </div>
      ))}

      {/* Terminal Footer */}
      <footer className="py-12 bg-black border-t border-cyan-500">
        <div className="container mx-auto px-8 text-center">
          <HolographicCard className="p-6 max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Terminal className="w-8 h-8 text-cyan-400" />
                <span className="text-xl font-mono font-bold text-cyan-400">
                  END_OF_TRANSMISSION
                </span>
              </div>
              <div className="text-purple-400 font-mono text-sm">
                Thank you for exploring my digital portfolio matrix
              </div>
              <div className="text-cyan-400 font-mono text-xs">
                Built with: React • TypeScript • Next.js • Tailwind CSS
              </div>
            </div>
          </HolographicCard>
        </div>
      </footer>
    </div>
  );
} 