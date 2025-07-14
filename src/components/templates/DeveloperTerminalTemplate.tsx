'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DatabasePortfolio } from '@/lib/portfolio-db';

interface DeveloperTerminalTemplateProps {
  portfolio: DatabasePortfolio;
}

export function DeveloperTerminalTemplate({ portfolio }: DeveloperTerminalTemplateProps) {
  const { resumeData } = portfolio;
  const [isDark, setIsDark] = useState(true);
  const [commandHistory, setCommandHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = resumeData.contact.name.toLowerCase().replace(/\s+/g, '');

  useEffect(() => {
    // Auto-show welcome and help
    setCommandHistory([
      {
        command: 'welcome',
        output: (
          <div className="text-green-400 space-y-2">
            <div className="text-cyan-400 text-lg font-bold">
              ╔══════════════════════════════════════════════════════════════╗
            </div>
            <div className="text-cyan-400 text-lg font-bold">
              ║                    PORTFOLIO TERMINAL v2.1                  ║
            </div>
            <div className="text-cyan-400 text-lg font-bold">
              ║                  Welcome, {resumeData.contact.name}!                   ║
            </div>
            <div className="text-cyan-400 text-lg font-bold">
              ╚══════════════════════════════════════════════════════════════╝
            </div>
            <div className="mt-4">
              <div>System: Portfolio OS v2.1.0</div>
              <div>Shell: /bin/portfolio-bash</div>
            </div>
          </div>
        )
      },
      {
        command: 'help',
        output: (
          <div className="text-green-400 space-y-2">
            <div className="text-cyan-400 font-semibold">Available Commands:</div>
            <div className="ml-4 space-y-1">
              <div><span className="text-blue-400">about</span> - Display professional summary</div>
              <div><span className="text-blue-400">skills</span> - List technical skills</div>
              <div><span className="text-blue-400">experience</span> - Show work experience</div>
              <div><span className="text-blue-400">projects</span> - Browse projects</div>
              <div><span className="text-blue-400">education</span> - Display educational background</div>
              <div><span className="text-blue-400">contact</span> - Show contact information</div>
              <div><span className="text-blue-400">clear</span> - Clear terminal screen</div>
            </div>
          </div>
        )
      }
    ]);
  }, []);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const executeCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let output: React.ReactNode;

    switch (command) {
      case 'about':
        output = (
          <div className="text-green-400">
            <div className="text-cyan-400 font-semibold">$ cat about.md</div>
            <div className="ml-4 p-4 border-l-2 border-green-500">
              {resumeData.summary || "Professional developer passionate about creating innovative solutions."}
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="text-green-400">
            <div className="text-cyan-400 font-semibold">$ ls -la skills/</div>
            <div className="ml-4">
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index} className="mb-3">
                  <div className="text-blue-400 font-semibold">📁 {skillGroup.category}/</div>
                  <div className="ml-6">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div key={skillIndex} className="py-0.5">
                        <span className="text-gray-500">-rwxr-xr-x</span> {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="text-green-400">
            <div className="text-cyan-400 font-semibold">$ git log --oneline --work</div>
            <div className="ml-4 space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-yellow-500 pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">●</span>
                    <span className="text-cyan-400 font-semibold">{exp.title}</span>
                    <span className="text-gray-500">@</span>
                    <span className="text-blue-400">{exp.company}</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    📅 {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div className="space-y-1">
                    {exp.description.map((desc, descIndex) => (
                      <div key={descIndex} className="text-sm">
                        <span className="text-green-400">→</span> {desc}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="text-green-400">
            <div className="text-cyan-400 font-semibold">$ find ./projects -name "*.md"</div>
            <div className="ml-4 space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="border border-gray-600 rounded p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-400">📂</span>
                    <span className="text-cyan-400 font-semibold">{project.name}</span>
                    {(project.link || project.github) && (
                      <div className="flex space-x-3 ml-auto">
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-green-600 text-black rounded text-xs font-mono font-bold hover:bg-green-500 transition-colors"
                          >
                            <span>🚀</span>
                            <span>LIVE</span>
                          </a>
                        )}
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-xs font-mono font-bold hover:bg-gray-500 transition-colors"
                          >
                            <span>💻</span>
                            <span>CODE</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm mb-2">{project.description}</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-gray-500">Tech:</span>
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="text-green-400">
            <div className="text-cyan-400 font-semibold">$ cat education.json</div>
            <div className="ml-4 space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="border border-gray-600 rounded p-4">
                  <div className="text-cyan-400 font-semibold text-lg">{edu.degree}</div>
                  <div className="text-blue-400 mt-1">{edu.institution}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    📅 Graduated: {edu.graduationDate}
                  </div>
                  {edu.gpa && (
                    <div className="text-gray-400 text-sm">
                      🎯 GPA: {edu.gpa}
                    </div>
                  )}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className="text-yellow-400 text-sm mt-2">
                      🏆 Honors: {edu.honors.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-green-400">
            <div className="text-cyan-400 font-semibold">$ curl -X GET /api/contact</div>
            <div className="ml-4 bg-gray-800 rounded p-4">
              <div>name: {resumeData.contact.name}</div>
              <div>email: <a href={`mailto:${resumeData.contact.email}`} className="text-blue-400 hover:underline">{resumeData.contact.email}</a></div>
              <div>phone: {resumeData.contact.phone}</div>
              {resumeData.contact.linkedin && (
                <div>linkedin: <a href={resumeData.contact.linkedin} className="text-blue-400 hover:underline">{resumeData.contact.linkedin}</a></div>
              )}
              {resumeData.contact.github && (
                <div>github: <a href={resumeData.contact.github} className="text-blue-400 hover:underline">{resumeData.contact.github}</a></div>
              )}
            </div>
          </div>
        );
        break;

      case 'clear':
        setCommandHistory([]);
        return;

      case 'help':
        output = (
          <div className="text-green-400 space-y-2">
            <div className="text-cyan-400 font-semibold">Available Commands:</div>
            <div className="ml-4 space-y-1">
              <div><span className="text-blue-400">about</span> - Display professional summary</div>
              <div><span className="text-blue-400">skills</span> - List technical skills</div>
              <div><span className="text-blue-400">experience</span> - Show work experience</div>
              <div><span className="text-blue-400">projects</span> - Browse projects</div>
              <div><span className="text-blue-400">education</span> - Display educational background</div>
              <div><span className="text-blue-400">contact</span> - Show contact information</div>
              <div><span className="text-blue-400">clear</span> - Clear terminal screen</div>
            </div>
          </div>
        );
        break;

      default:
        output = (
          <div className="text-red-400">
            bash: {command}: command not found
            <div className="mt-1 text-gray-500">Type 'help' to see available commands</div>
          </div>
        );
    }

    setCommandHistory(prev => [...prev, { command, output }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        executeCommand(currentCommand);
      }
      setCurrentCommand('');
    }
  };

  const handleCommandClick = (cmd: string) => {
    setCurrentCommand(cmd);
    executeCommand(cmd);
    setCurrentCommand('');
    // Refocus input after command execution
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} font-mono text-sm`}>
      <div className="container mx-auto p-4">
        <div className={`${isDark ? 'bg-black' : 'bg-white'} rounded-lg shadow-2xl border-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          
          {/* Terminal Header */}
          <div className={`flex items-center justify-between px-4 py-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-t-lg border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              terminal — portfolio@{userName}
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Terminal Content */}
          <div className="p-6 space-y-4 min-h-[600px]" onClick={() => inputRef.current?.focus()}>
            
            {/* Command History */}
            {commandHistory.map((entry, index) => (
              <div key={index} className="space-y-2">
                <div className="text-blue-400 flex items-center space-x-2">
                  <span className="text-gray-500">{userName}@portfolio:~$</span>
                  <span>{entry.command}</span>
                </div>
                <div className="ml-4">{entry.output}</div>
              </div>
            ))}

            {/* Current Command Line with Input */}
            <div className="text-blue-400 flex items-center space-x-2">
              <span className="text-gray-500">{userName}@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-green-400 flex-1"
                placeholder=""
                autoFocus
              />
            </div>

            {/* Quick Commands */}
            <div className="mt-6 p-4 bg-gray-800/20 rounded border border-gray-600">
              <div className="text-cyan-400 text-sm mb-3">Quick Commands:</div>
              <div className="flex flex-wrap gap-2">
                {['about', 'skills', 'experience', 'projects', 'education', 'contact', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleCommandClick(cmd)}
                    className="px-3 py-2 text-sm bg-gray-700 text-white rounded border border-gray-600 hover:border-blue-400 hover:bg-blue-400/20 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 