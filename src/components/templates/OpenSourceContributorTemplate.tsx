'use client';

import { useState, useEffect } from 'react';
import { 
  Github, GitBranch, GitCommit, Star, Users, Award, 
  ExternalLink, MessageSquare, Heart, Zap, Folder
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';

interface OpenSourceContributorTemplateProps {
  portfolio: DatabasePortfolio;
}

export function OpenSourceContributorTemplate({ portfolio }: OpenSourceContributorTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [contributionHeatmap, setContributionHeatmap] = useState<number[][]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  

  // GitHub color schemes
  const getGitHubColors = (scheme: string) => {
    const palettes = {
      blue: {
        primary: '#0969DA',
        secondary: '#218BFF',
        accent: '#54A3FF',
        success: '#1A7F37',
        warning: '#9A6700',
        error: '#DA3633',
        background: '#0D1117',
        surface: '#161B22',
        border: '#30363D',
        text: '#F0F6FC',
        textSecondary: '#7D8590'
      },
      purple: {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#C084FC',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        background: '#0F0A1A',
        surface: '#1A1625',
        border: '#2D2438',
        text: '#F8FAFC',
        textSecondary: '#94A3B8'
      },
      green: {
        primary: '#2EA043',
        secondary: '#1F883D',
        accent: '#56D364',
        success: '#1A7F37',
        warning: '#9A6700',
        error: '#DA3633',
        background: '#0A1A0A',
        surface: '#162016',
        border: '#2D3A2D',
        text: '#F0FDF4',
        textSecondary: '#86EFAC'
      },
      orange: {
        primary: '#FD8C00',
        secondary: '#FB8500',
        accent: '#FFB366',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        background: '#1A0F00',
        surface: '#2D1A00',
        border: '#4D2F00',
        text: '#FFF7ED',
        textSecondary: '#FDBA74'
      },
      red: {
        primary: '#DA3633',
        secondary: '#F85149',
        accent: '#FF7B72',
        success: '#1A7F37',
        warning: '#D97706',
        error: '#DA3633',
        background: '#1A0000',
        surface: '#2D0A0A',
        border: '#4D1515',
        text: '#FEF2F2',
        textSecondary: '#FCA5A5'
      }
    };
    return palettes[scheme as keyof typeof palettes] || palettes.blue;
  };

  const colors = getGitHubColors(personalization.colorScheme);

  // Real metrics based on resume data
  const metrics = [
    { 
      label: 'Public Repos', 
      value: resumeData.projects?.filter(p => p.github).length || 0,
      icon: Folder
    },
    { 
      label: 'Total Projects', 
      value: resumeData.projects?.length || 0,
      icon: GitCommit
    },
    { 
      label: 'Technologies', 
      value: resumeData.skills?.reduce((acc, skill) => acc + skill.items.length, 0) || 0,
      icon: Star
    },
    { 
      label: 'Experience', 
      value: resumeData.experience?.length ? 
        Math.max(...resumeData.experience.map(exp => {
          const start = new Date(exp.startDate);
          const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate);
          return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        })) : 0,
      icon: Users
    }
  ];

  // Generate contribution heatmap
  useEffect(() => {
    const weeks = 52;
    const daysPerWeek = 7;
    const heatmap = [];
    
    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < daysPerWeek; day++) {
        const isWeekend = day === 0 || day === 6;
        const baseActivity = isWeekend ? 0.3 : 0.8;
        const randomFactor = Math.random();
        const contributions = Math.floor(baseActivity * randomFactor * 4);
        weekData.push(contributions);
      }
      heatmap.push(weekData);
    }
    
    setContributionHeatmap(heatmap);
    const total = heatmap.flat().reduce((sum, day) => sum + day, 0);
    setTotalContributions(total);
  }, []);

  const getContributionColor = (count: number) => {
    if (count === 0) return colors.border;
    if (count <= 1) return `${colors.primary}40`;
    if (count <= 2) return `${colors.primary}60`;
    if (count <= 3) return `${colors.primary}80`;
    return colors.primary;
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: colors.background }}>
      {/* GitHub Profile Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            {/* Avatar */}
            <div className="mb-6">
              <div 
                className="w-80 h-80 lg:w-full lg:h-auto lg:aspect-square rounded-full mx-auto flex items-center justify-center text-7xl lg:text-9xl font-bold text-white shadow-2xl"
                style={{ backgroundColor: colors.primary }}
              >
                {resumeData.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>

            {/* Name and Title */}
            <div className="text-center lg:text-left mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: colors.text }}>
                {resumeData.contact.name}
              </h1>
              <p className="text-xl lg:text-2xl mb-4" style={{ color: colors.textSecondary }}>
                {resumeData.experience?.[0]?.title || 'Open Source Developer'}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-base leading-relaxed" style={{ color: colors.textSecondary }}>
                {resumeData.summary || 'Passionate open source contributor building tools and libraries that help developers worldwide. Believer in collaborative development and knowledge sharing.'}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {resumeData.contact.email && (
                <div className="flex items-center space-x-3 text-base">
                  <span style={{ color: colors.textSecondary }} className="text-lg">📧</span>
                  <span style={{ color: colors.textSecondary }}>{resumeData.contact.email}</span>
                </div>
              )}
              {resumeData.contact.location && (
                <div className="flex items-center space-x-3 text-base">
                  <span style={{ color: colors.textSecondary }} className="text-lg">📍</span>
                  <span style={{ color: colors.textSecondary }}>{resumeData.contact.location}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${resumeData.contact.email}`}
                className="w-full py-3 px-5 rounded-lg font-medium text-center block transition-all duration-200 text-base"
                style={{ backgroundColor: colors.primary, color: colors.background }}
              >
                Contact for Collaboration
              </a>
              {resumeData.contact.github && (
                <a
                  href={resumeData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-lg font-medium text-center border block transition-all duration-200 text-base"
                  style={{ 
                    borderColor: colors.border, 
                    color: colors.text,
                    backgroundColor: colors.surface
                  }}
                >
                  Follow on GitHub
                </a>
              )}
            </div>

            {/* Achievements */}
            <div className="rounded-lg border p-5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <h3 className="font-semibold mb-4 text-base" style={{ color: colors.text }}>
                Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5" style={{ color: colors.warning }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Arctic Code Vault Contributor
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5" style={{ color: colors.error }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    GitHub Sponsor
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5" style={{ color: colors.primary }} />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Pro Developer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Main Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contribution Graph */}
            <div className="rounded-lg border p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-base" style={{ color: colors.text }}>
                  {totalContributions} contributions in the last year
                </h3>
                <div className="flex items-center space-x-2 text-sm" style={{ color: colors.textSecondary }}>
                  <span>Less</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getContributionColor(level) }}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
              
              {/* Contribution Heatmap */}
              <div className="relative mb-6">
                <div className="absolute left-0 top-0 flex flex-col gap-1 text-sm" style={{ color: colors.textSecondary, width: '35px' }}>
                  <div className="h-3 flex items-center justify-end">Mon</div>
                  <div className="h-3"></div>
                  <div className="h-3 flex items-center justify-end">Wed</div>
                  <div className="h-3"></div>
                  <div className="h-3 flex items-center justify-end">Fri</div>
                  <div className="h-3"></div>
                  <div className="h-3 flex items-center justify-end">Sun</div>
                </div>
                
                <div className="ml-10 overflow-x-auto">
                  <div className="flex gap-1 min-w-max">
                    {contributionHeatmap.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className="w-3 h-3 rounded-sm cursor-pointer hover:outline hover:outline-1 hover:outline-white/50"
                            style={{ backgroundColor: getContributionColor(day) }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="ml-10 mt-3 flex justify-between text-sm max-w-full" style={{ color: colors.textSecondary }}>
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>
              
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Learn how GitHub calculates contributions.
              </p>
            </div>

            {/* Popular Repositories */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                  Popular repositories
                </h2>
                <a
                  href={resumeData.contact.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:underline"
                  style={{ color: colors.primary }}
                >
                  View all repositories →
                </a>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {resumeData.projects?.slice(0, 6).map((project, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-5 hover:border-opacity-80 transition-colors"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 
                        className="font-semibold hover:underline cursor-pointer text-base"
                        style={{ color: colors.primary }}
                      >
                        {project.name}
                      </h3>
                      <span 
                        className="px-3 py-1 text-sm rounded-full border"
                        style={{ 
                          color: colors.textSecondary, 
                          borderColor: colors.border
                        }}
                      >
                        Public
                      </span>
                    </div>

                    <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <span className="text-sm" style={{ color: colors.textSecondary }}>
                          {project.technologies?.[0] || 'JavaScript'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-4">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                            style={{ color: colors.textSecondary }}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                            style={{ color: colors.textSecondary }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                Technical Skills
              </h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {resumeData.skills?.map((skillCategory, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-5"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  >
                    <h3 className="font-semibold mb-4 text-base" style={{ color: colors.primary }}>
                      {skillCategory.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 rounded-full text-sm border"
                          style={{ 
                            backgroundColor: `${colors.primary}20`,
                            borderColor: colors.primary,
                            color: colors.text
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )) || []}
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {resumeData.experience?.map((job, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-5"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>
                          {job.title}
                        </h3>
                        <p className="text-base" style={{ color: colors.primary }}>
                          {job.company}
                        </p>
                      </div>
                      <div className="mt-2 lg:mt-0">
                        <span 
                          className="px-3 py-1 rounded-full text-sm border"
                          style={{ 
                            borderColor: colors.border,
                            color: colors.textSecondary
                          }}
                        >
                          {job.startDate} - {job.endDate}
                        </span>
                      </div>
                    </div>
                    
                    {job.description && (
                      <div className="space-y-2">
                        {job.description.map((line, lineIndex) => (
                          <p key={lineIndex} className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )) || []}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education?.map((edu, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-5"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>
                          {edu.degree}
                        </h3>
                        <p className="text-base mb-2" style={{ color: colors.primary }}>
                          {edu.institution}
                        </p>
                        {edu.location && (
                          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                            {edu.location}
                          </p>
                        )}
                        {edu.honors && edu.honors.length > 0 && (
                          <p className="text-sm" style={{ color: colors.textSecondary }}>
                            {edu.honors.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 lg:mt-0">
                        <span 
                          className="px-3 py-1 rounded-full text-sm border"
                          style={{ 
                            borderColor: colors.border,
                            color: colors.textSecondary
                          }}
                        >
                          {edu.graduationDate}
                        </span>
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>

            {/* Certifications (if available) */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                  Certifications
                </h2>
                <div className="grid lg:grid-cols-2 gap-4">
                  {resumeData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 flex items-center space-x-3"
                      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                    >
                      <Award className="w-5 h-5" style={{ color: colors.warning }} />
                      <div>
                        <h3 className="font-medium text-base" style={{ color: colors.text }}>
                          {cert}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center border-t pt-12" style={{ borderColor: colors.border }}>
          <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
            Let's Build Something <span style={{ color: colors.primary }}>Together</span>
          </h2>
          <p className="text-base mb-8" style={{ color: colors.textSecondary }}>
            Interested in collaborating on open source projects?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={`mailto:${resumeData.contact.email}`}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-lg font-medium transition-all duration-200 text-base"
              style={{ backgroundColor: colors.primary, color: colors.background }}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Start a Conversation</span>
            </a>
            
            {resumeData.contact.github && (
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-lg font-medium border transition-all duration-200 text-base"
                style={{ 
                  borderColor: colors.border, 
                  color: colors.text,
                  backgroundColor: colors.surface
                }}
              >
                <Github className="w-5 h-5" />
                <span>Follow on GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 