'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, User, Briefcase, GraduationCap, Award, 
  FolderOpen, Github, Mail, Phone, MapPin, Calendar, ExternalLink,
  ChevronRight, Cpu, Zap, Database, Globe, Coffee, Star
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface DeveloperTerminalTemplateProps {
  portfolio: DatabasePortfolio;
}

interface TerminalColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  textSecondary: string;
}

export function DeveloperTerminalTemplate({ portfolio }: DeveloperTerminalTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [commandHistory, setCommandHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('~/portfolio');
  const [isTyping, setIsTyping] = useState(false);
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get dynamic section order and hidden sections
  const sectionOrder = personalization?.sectionOrder || [
    'experience', 'skills', 'projects', 'education', 'certifications'
  ];
  const hiddenSections = personalization?.hiddenSections || [];
  const customSections = resumeData?.customSections || [];

  const userName = resumeData.contact?.name?.toLowerCase().replace(/\s+/g, '.') || 'developer';

  // Terminal color schemes
  const getTerminalColors = (scheme: string): TerminalColors => {
    const palettes: Record<string, TerminalColors> = {
      blue: {
        background: '#001122',
        surface: '#0A1A2E',
        primary: '#00D4FF',
        secondary: '#4A90E2',
        accent: '#87CEEB',
        success: '#00FF88',
        warning: '#FFD700',
        error: '#FF6B6B',
        text: '#E0E0E0',
        textSecondary: '#B0B0B0'
      },
      green: {
        background: '#001100',
        surface: '#0A1A0A',
        primary: '#00FF00',
        secondary: '#32CD32',
        accent: '#90EE90',
        success: '#00FF88',
        warning: '#FFD700',
        error: '#FF6B6B',
        text: '#E0FFE0',
        textSecondary: '#B0FFB0'
      },
      purple: {
        background: '#1A001A',
        surface: '#2A0A2A',
        primary: '#FF00FF',
        secondary: '#DA70D6',
        accent: '#DDA0DD',
        success: '#00FF88',
        warning: '#FFD700',
        error: '#FF6B6B',
        text: '#FFE0FF',
        textSecondary: '#FFB0FF'
      },
      orange: {
        background: '#2A1A00',
        surface: '#3A2A10',
        primary: '#FF8C00',
        secondary: '#FFA500',
        accent: '#FFD700',
        success: '#00FF88',
        warning: '#FFD700',
        error: '#FF6B6B',
        text: '#FFF0E0',
        textSecondary: '#FFD0B0'
      }
    };
    return palettes[scheme] || palettes.blue;
  };

  const colors = getTerminalColors(personalization?.colorScheme || 'blue');

  // Boot sequence
  useEffect(() => {
    const bootMessages = [
      'Initializing portfolio system...',
      'Loading user data...',
      'Mounting file system...',
      'Starting network services...',
      'Loading shell environment...',
      'System ready.'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootMessages.length) {
        setBootSequence(prev => [...prev, bootMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowTerminal(true), 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Initial welcome command
  useEffect(() => {
    if (showTerminal) {
      setTimeout(() => {
        runCommand('welcome');
      }, 500);
    }
  }, [showTerminal]);

  // Available commands
  const commands = {
    help: () => (
      <div className="space-y-2">
        <div style={{ color: colors.accent }}>Available commands:</div>
        <div className="ml-4 space-y-1">
          <div><span style={{ color: colors.primary }}>help</span> - Show this help message</div>
          <div><span style={{ color: colors.primary }}>about</span> - Display personal information</div>
          <div><span style={{ color: colors.primary }}>experience</span> - View work experience</div>
          <div><span style={{ color: colors.primary }}>skills</span> - View technical skills</div>
          <div><span style={{ color: colors.primary }}>projects</span> - View projects</div>
          <div><span style={{ color: colors.primary }}>education</span> - View education history</div>
          <div><span style={{ color: colors.primary }}>certifications</span> - View certifications</div>
          <div><span style={{ color: colors.primary }}>contact</span> - Show contact information</div>
          <div><span style={{ color: colors.primary }}>clear</span> - Clear terminal</div>
        </div>
      </div>
    ),

    about: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Personal Information:</div>
        <div className="ml-4 space-y-2">
          <div><span style={{ color: colors.primary }}>Name:</span> {resumeData.contact?.name || 'Developer'}</div>
          {resumeData.contact?.location && (
            <div><span style={{ color: colors.primary }}>Location:</span> {resumeData.contact.location}</div>
          )}
          {resumeData.summary && (
            <div className="mt-2">
              <div style={{ color: colors.primary }}>Summary:</div>
              <div className="mt-1" style={{ color: colors.text }}>{resumeData.summary}</div>
            </div>
          )}
        </div>
      </div>
    ),

    welcome: () => (
      <div className="space-y-4">
        <div className="text-center">
          <div style={{ color: colors.primary, fontSize: '24px' }}>
            ╔══════════════════════════════════════════════════════════════╗
          </div>
          <div style={{ color: colors.primary, fontSize: '24px' }}>
            ║                    DEVELOPER PORTFOLIO v3.0                   ║
          </div>
          <div style={{ color: colors.primary, fontSize: '24px' }}>
            ║                  Welcome, {resumeData.contact?.name || 'Developer'}!                   ║
          </div>
          <div style={{ color: colors.primary, fontSize: '24px' }}>
            ╚══════════════════════════════════════════════════════════════╝
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div>System: Portfolio OS v3.0.0</div>
          <div>Current user: {userName}</div>
          <div>Last login: {new Date().toLocaleString()}</div>
          <div className="mt-4" style={{ color: colors.accent }}>
            Type 'help' to see all available commands.
          </div>
        </div>
      </div>
    ),

    experience: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Work Experience:</div>
        {resumeData.experience?.map((exp, index) => (
          <div key={index} className="ml-4 space-y-2 pb-4">
            <div style={{ color: colors.primary }}>{exp.company}</div>
            <div className="ml-2">
              <div style={{ color: colors.secondary }}>{exp.position}</div>
              <div style={{ color: colors.textSecondary }}>
                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
              </div>
              <div className="mt-2" style={{ color: colors.text }}>
                {exp.responsibilities?.map((responsibility: string, i: number) => (
                  <div key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{responsibility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),

    skills: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Technical Skills:</div>
        <div className="ml-4 space-y-2">
          {resumeData.skills?.map((skill, index) => (
            <div key={index}>
              <span style={{ color: colors.primary }}>{skill.category}:</span>
              <span className="ml-2" style={{ color: colors.text }}>{skill.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    ),

    projects: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Projects:</div>
        {resumeData.projects?.map((project, index) => (
          <div key={index} className="ml-4 space-y-2 pb-4">
            <div style={{ color: colors.primary }}>{project.name}</div>
            <div className="ml-2">
              {project.description && (
                <div style={{ color: colors.text }}>{project.description}</div>
              )}
              {project.technologies && (
                <div style={{ color: colors.secondary }}>
                  Technologies: {project.technologies.join(', ')}
                </div>
              )}
              {project.link && (
                <div style={{ color: colors.accent }}>
                  URL: <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ),

    education: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Education:</div>
        {resumeData.education?.map((edu, index) => (
          <div key={index} className="ml-4 space-y-2 pb-4">
            <div style={{ color: colors.primary }}>{edu.institution}</div>
            <div className="ml-2">
              <div style={{ color: colors.secondary }}>{edu.degree} in {edu.field}</div>
              <div style={{ color: colors.textSecondary }}>
                Graduated: {formatDate(edu.graduationDate)}
              </div>
              {edu.gpa && (
                <div style={{ color: colors.text }}>GPA: {edu.gpa}</div>
              )}
              {edu.honors && edu.honors.length > 0 && (
                <div style={{ color: colors.text }}>
                  Honors: {edu.honors.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ),

    certifications: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Certifications:</div>
        {resumeData.certifications?.map((cert, index) => (
          <div key={index} className="ml-4 space-y-2 pb-4">
            <div style={{ color: colors.primary }}>{cert}</div>
          </div>
        ))}
      </div>
    ),

    contact: () => (
      <div className="space-y-4">
        <div style={{ color: colors.accent }}>Contact Information:</div>
        <div className="ml-4 space-y-2">
          {resumeData.contact?.email && (
            <div>
              <span style={{ color: colors.primary }}>Email:</span>
              <span className="ml-2" style={{ color: colors.text }}>{resumeData.contact.email}</span>
            </div>
          )}
          {resumeData.contact?.phone && (
            <div>
              <span style={{ color: colors.primary }}>Phone:</span>
              <span className="ml-2" style={{ color: colors.text }}>{resumeData.contact.phone}</span>
            </div>
          )}
          {resumeData.contact?.location && (
            <div>
              <span style={{ color: colors.primary }}>Location:</span>
              <span className="ml-2" style={{ color: colors.text }}>{resumeData.contact.location}</span>
            </div>
          )}
          {resumeData.contact?.website && (
            <div>
              <span style={{ color: colors.primary }}>Website:</span>
              <span className="ml-2" style={{ color: colors.text }}>
                <a href={resumeData.contact.website} target="_blank" rel="noopener noreferrer">
                  {resumeData.contact.website}
                </a>
              </span>
            </div>
          )}
          {resumeData.contact?.linkedin && (
            <div>
              <span style={{ color: colors.primary }}>LinkedIn:</span>
              <span className="ml-2" style={{ color: colors.text }}>
                <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">
                  {resumeData.contact.linkedin}
                </a>
              </span>
            </div>
          )}
          {resumeData.contact?.github && (
            <div>
              <span style={{ color: colors.primary }}>GitHub:</span>
              <span className="ml-2" style={{ color: colors.text }}>
                <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer">
                  {resumeData.contact.github}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    ),

    clear: () => {
      setCommandHistory([]);
      return null;
    }
  };

  const runCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === 'clear') {
      setCommandHistory([]);
      return;
    }

    const output = commands[trimmedCmd as keyof typeof commands] 
      ? commands[trimmedCmd as keyof typeof commands]()
      : (
        <div>
          <span style={{ color: colors.error }}>bash: {cmd}: command not found</span>
          <div className="mt-2">Type 'help' for available commands.</div>
        </div>
      );

    setCommandHistory(prev => [...prev, { command: cmd, output }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        runCommand(currentCommand);
        setCurrentCommand('');
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  if (!showTerminal) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono" style={{ backgroundColor: colors.background, color: colors.text }}>
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold mb-8" style={{ color: colors.primary }}>
            Portfolio System Boot
          </div>
          <div className="space-y-2">
            {bootSequence.map((message, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span style={{ color: colors.success }}>[OK]</span>
                <span>{message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 font-mono text-sm lg:text-base cursor-text"
      style={{ backgroundColor: colors.background, color: colors.text }}
      onClick={handleTerminalClick}
    >
      <div className="max-w-6xl mx-auto">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-t-lg border-b" style={{ backgroundColor: colors.surface, borderColor: colors.primary }}>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <Terminal className="w-4 h-4 ml-4" style={{ color: colors.primary }} />
            <span className="font-semibold">portfolio-terminal</span>
          </div>
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            {userName}@portfolio-os
          </div>
        </div>

        {/* Terminal Content */}
        <div className="bg-opacity-90 rounded-b-lg p-4 min-h-[calc(100vh-8rem)]" style={{ backgroundColor: colors.surface }}>
          {/* Command History */}
          <div className="space-y-4 mb-4">
            {commandHistory.map((entry, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span style={{ color: colors.success }}>{userName}@portfolio-os</span>
                  <span style={{ color: colors.textSecondary }}>:</span>
                  <span style={{ color: colors.primary }}>{currentPath}</span>
                  <span style={{ color: colors.textSecondary }}>$</span>
                  <span>{entry.command}</span>
                </div>
                <div className="ml-4">{entry.output}</div>
              </div>
            ))}
          </div>

          {/* Current Command Input */}
          <div className="flex items-center space-x-2">
            <span style={{ color: colors.success }}>{userName}@portfolio-os</span>
            <span style={{ color: colors.textSecondary }}>:</span>
            <span style={{ color: colors.primary }}>{currentPath}</span>
            <span style={{ color: colors.textSecondary }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent outline-none border-none"
              style={{ color: colors.text }}
              autoFocus
            />
            <div className="w-2 h-5 animate-pulse" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 