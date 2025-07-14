'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, ExternalLink, Briefcase, GraduationCap, Code, Award } from 'lucide-react';

interface DarkProfessionalTemplateProps {
  portfolio: DatabasePortfolio;
}

export function DarkProfessionalTemplate({ portfolio }: DarkProfessionalTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const { contact, summary, experience, education, skills, projects } = resumeData;

  // Color scheme based on personalization
  const colors = {
    blue: { accent: '#3B82F6', light: '#60A5FA', border: '#1E40AF' },
    green: { accent: '#10B981', light: '#34D399', border: '#047857' },
    purple: { accent: '#8B5CF6', light: '#A78BFA', border: '#6D28D9' },
    orange: { accent: '#F59E0B', light: '#FBBF24', border: '#D97706' },
    red: { accent: '#EF4444', light: '#F87171', border: '#DC2626' },
  };

  const currentColors = colors[personalization.colorScheme as keyof typeof colors] || colors.blue;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 min-h-screen p-8 border-r border-gray-700">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div 
              className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white"
              style={{ backgroundColor: currentColors.accent }}
            >
              {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <h1 className="text-2xl font-bold mb-2">{contact.name}</h1>
            <p className="text-gray-400 text-lg">Software Developer</p>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-600">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4" style={{ color: currentColors.accent }} />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <span>{contact.location}</span>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center space-x-3 text-sm">
                  <Linkedin className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </div>
              )}
              {contact.github && (
                <div className="flex items-center space-x-3 text-sm">
                  <Github className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center space-x-3 text-sm">
                  <Globe className="w-4 h-4" style={{ color: currentColors.accent }} />
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-600">Skills</h3>
              <div className="space-y-4">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-2 text-gray-300">{skillCategory.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 border"
                          style={{ borderColor: currentColors.accent }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-12">
          {/* About Section */}
          {summary && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700">About</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
                <Briefcase className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
                Experience
              </h2>
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        <p className="text-lg" style={{ color: currentColors.accent }}>{job.company}</p>
                        {job.location && (
                          <p className="text-gray-400 text-sm">{job.location}</p>
                        )}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {job.startDate} - {job.current ? 'Present' : job.endDate}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {job.description.map((item, descIndex) => (
                        <li key={descIndex} className="text-gray-300 flex items-start">
                          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: currentColors.accent }}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
                <GraduationCap className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                        <p className="text-lg" style={{ color: currentColors.accent }}>{edu.institution}</p>
                        {edu.location && (
                          <p className="text-gray-400 text-sm">{edu.location}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-gray-400 text-sm">GPA: {edu.gpa}</p>
                        )}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{edu.graduationDate}</span>
                      </div>
                    </div>
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-300 mb-2">Honors & Awards:</h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.honors.map((honor, honorIndex) => (
                            <span
                              key={honorIndex}
                              className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300 border"
                              style={{ borderColor: currentColors.accent }}
                            >
                              <Award className="w-3 h-3 inline mr-1" />
                              {honor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b border-gray-700 flex items-center">
                <Code className="w-8 h-8 mr-3" style={{ color: currentColors.accent }} />
                Projects
              </h2>
              <div className="grid gap-6 md:grid-cols-1">
                {projects.map((project, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                      {/* Enhanced Project Links */}
                      <div className="flex flex-col space-y-2">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 shadow-md"
                            style={{ backgroundColor: currentColors.accent }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Live</span>
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
                          >
                            <Github className="w-4 h-4" />
                            <span>View Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300 border"
                            style={{ borderColor: currentColors.accent }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {contact.name}. Professional Portfolio.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
} 