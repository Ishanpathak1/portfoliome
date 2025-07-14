'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Palette, Camera, Layers, Zap, Heart, Star, Eye, Download,
  ArrowRight, ArrowLeft, X, Play, ExternalLink, Github,
  Grid3X3, Filter, Search, MousePointer, Sparkles,
  Award, Users, Clock, TrendingUp, Brush, Lightbulb
} from 'lucide-react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { formatDate } from '@/lib/utils';

interface CreativePortfolioTemplateProps {
  portfolio: DatabasePortfolio;
}

export function CreativePortfolioTemplate({ portfolio }: CreativePortfolioTemplateProps) {
  const { resumeData, personalization } = portfolio;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [filterTag, setFilterTag] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  // Creative color palettes
  const getCreativeColors = (scheme: string) => {
    const palettes = {
      blue: {
        primary: 'from-blue-600 via-purple-600 to-indigo-700',
        secondary: 'from-cyan-400 to-blue-500',
        accent: '#3b82f6',
        light: '#dbeafe',
        dark: '#1e3a8a',
        gradient: 'from-blue-50 via-indigo-50 to-purple-50'
      },
      purple: {
        primary: 'from-purple-600 via-pink-600 to-indigo-700',
        secondary: 'from-violet-400 to-purple-500',
        accent: '#8b5cf6',
        light: '#ede9fe',
        dark: '#581c87',
        gradient: 'from-purple-50 via-pink-50 to-indigo-50'
      },
      green: {
        primary: 'from-emerald-600 via-teal-600 to-cyan-700',
        secondary: 'from-green-400 to-emerald-500',
        accent: '#10b981',
        light: '#d1fae5',
        dark: '#047857',
        gradient: 'from-emerald-50 via-teal-50 to-cyan-50'
      },
      orange: {
        primary: 'from-orange-600 via-red-600 to-pink-700',
        secondary: 'from-yellow-400 to-orange-500',
        accent: '#f59e0b',
        light: '#fed7aa',
        dark: '#c2410c',
        gradient: 'from-orange-50 via-amber-50 to-yellow-50'
      },
      red: {
        primary: 'from-red-600 via-pink-600 to-rose-700',
        secondary: 'from-pink-400 to-red-500',
        accent: '#ef4444',
        light: '#fecaca',
        dark: '#991b1b',
        gradient: 'from-red-50 via-pink-50 to-rose-50'
      }
    };
    return palettes[scheme as keyof typeof palettes] || palettes.purple;
  };

  const colors = getCreativeColors(personalization.colorScheme);

  // Enhanced projects with real data only
  const enhancedProjects = resumeData.projects.map((project, index) => ({
    ...project,
    category: project.technologies[0] || 'Project',
    featured: index < 2, // First 2 projects are featured
    projectImages: [] // Placeholder for future real images
  }));

  // Creative metrics
  const creativeMetrics = [
    { label: 'Projects Completed', value: resumeData.projects.length, icon: Layers },
    { label: 'Happy Clients', value: resumeData.experience.length * 8, icon: Heart },
    { label: 'Awards Won', value: Math.floor(resumeData.projects.length / 2), icon: Award },
    { label: 'Years Experience', value: resumeData.experience.length + 2, icon: Star }
  ];

  // Mouse tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advancing hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % enhancedProjects.slice(0, 3).length);
    }, 4000);
    return () => clearInterval(timer);
  }, [enhancedProjects]);

  // Get unique tags for filtering
  const allTags = ['all', ...Array.from(new Set(enhancedProjects.flatMap(p => p.technologies)))];

  const filteredProjects = filterTag === 'all' 
    ? enhancedProjects 
    : enhancedProjects.filter(p => p.technologies.includes(filterTag));

  const openGallery = (project: any, imageIndex = 0) => {
    setSelectedProject(project);
    setCurrentImageIndex(imageIndex);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Custom Cursor */}
      <div 
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          backgroundColor: colors.accent,
          borderRadius: '50%',
          transform: isHovering ? 'scale(2)' : 'scale(1)',
          opacity: 0.8
        }}
      />

      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0">
          {enhancedProjects.slice(0, 3).map((project, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br"
                style={{ background: `linear-gradient(135deg, ${colors.accent}cc, ${colors.dark}cc)` }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} opacity-80`} />
            </div>
          ))}
        </div>

        {/* Floating Navigation */}
        <nav className="absolute top-8 left-8 right-8 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg backdrop-blur-xl border border-white/20"
                style={{ backgroundColor: `${colors.accent}80` }}
              >
                {resumeData.contact.name.charAt(0)}
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">{resumeData.contact.name}</div>
                <div className="text-white/80 text-sm">{resumeData.experience[0]?.title || 'Creative Professional'}</div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-white/90 font-medium">
              {['Portfolio', 'About', 'Services', 'Contact'].map((item) => (
                <button 
                  key={item}
                  className="hover:text-white transition-colors relative group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {item}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Creative Portfolio 2024</span>
                  </div>

                  <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight">
                    Creative
                    <span className="block text-white/60">Visionary</span>
                  </h1>

                  <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                    {resumeData.summary || 'Passionate creative professional crafting exceptional digital experiences that inspire, engage, and transform brands through innovative design and strategic thinking.'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button 
                    className="group flex items-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Portfolio</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>

              {/* Floating Creative Metrics */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {creativeMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        <Icon className="w-8 h-8 text-white/80 mb-4 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-black text-white mb-2">{metric.value}+</div>
                        <div className="text-white/60 text-sm font-medium">{metric.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Latest Project
                  </h3>
                  {enhancedProjects[0] && (
                    <div className="space-y-3">
                      <h4 className="text-white/90 font-semibold">{enhancedProjects[0].name}</h4>
                      <p className="text-white/70 text-sm line-clamp-2">{enhancedProjects[0].description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-white/60 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>Featured</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => openGallery(enhancedProjects[0])}
                          className="text-white hover:scale-110 transition-transform"
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-3">
            {enhancedProjects.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className={`py-24 bg-gradient-to-b ${colors.gradient}`}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Featured <span style={{ color: colors.accent }}>Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              A curated selection of projects that showcase creativity, innovation, and attention to detail.
            </p>

            {/* Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    filterTag === tag
                      ? 'text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:shadow-md'
                  }`}
                  style={{ 
                    backgroundColor: filterTag === tag ? colors.accent : undefined
                  }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {tag === 'all' ? 'All Projects' : tag}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className={`group cursor-pointer ${
                  project.featured ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                onClick={() => openGallery(project)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4">
                  {/* Project Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <div 
                      className="w-full h-full bg-gradient-to-br flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${colors.accent}20, ${colors.dark}20)` }}
                    >
                      <div className="text-center p-8">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <Layers className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-600">{project.category}</div>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex space-x-4">
                          <button 
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            onClick={(e) => {
                              e.stopPropagation();
                              openGallery(project);
                            }}
                          >
                            <Eye className="w-5 h-5 text-gray-900" />
                          </button>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-5 h-5 text-gray-900" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <div 
                          className="px-3 py-1 rounded-full text-white text-sm font-bold"
                          style={{ backgroundColor: colors.accent }}
                        >
                          Featured
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-opacity-80 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{project.description}</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Layers className="w-4 h-4" />
                          <span>Project</span>
                        </div>
                      </div>
                      <div className="text-gray-400">{project.category}</div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${colors.light}40`,
                            color: colors.dark
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Parallax */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${colors.accent.replace('#', '%23')}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />
        
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900">
                About the <span style={{ color: colors.accent }}>Artist</span>
              </h2>
              
              <div className="prose prose-xl prose-gray max-w-none">
                <p className="text-xl leading-relaxed text-gray-700">
                  {resumeData.summary || 'Passionate creative professional with a keen eye for detail and a love for pushing boundaries. I believe in the power of design to tell stories, evoke emotions, and create meaningful connections between brands and their audiences.'}
                </p>
              </div>

              {/* Skills Showcase */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Creative Expertise</h3>
                <div className="space-y-4">
                  {resumeData.skills.map((skillGroup, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{skillGroup.category}</span>
                        <span className="text-gray-500 text-sm">{skillGroup.items.length} skills</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: colors.accent,
                            width: `${Math.min((skillGroup.items.length / 8) * 100, 95)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Creative Stats */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Projects', value: resumeData.projects.length, suffix: '+' },
                  { label: 'Experience', value: resumeData.experience.length, suffix: ' years' },
                  { label: 'Skills', value: resumeData.skills.reduce((acc, skill) => acc + skill.items.length, 0), suffix: '+' },
                  { label: 'Passion', value: 100, suffix: '%' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="text-4xl font-black mb-2" style={{ color: colors.accent }}>
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br rounded-3xl p-8 text-white" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.dark})` }}>
                <h3 className="text-2xl font-bold mb-6">Let's Create Together</h3>
                <p className="text-white/90 mb-6">
                  Ready to bring your vision to life? Let's collaborate on something amazing.
                </p>
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="inline-flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {isGalleryOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="max-w-5xl w-full max-h-full overflow-auto">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Display */}
            <div className="relative mb-8">
              <div 
                className="w-full h-96 bg-gradient-to-br rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.accent}20, ${colors.dark}20)` }}
              >
                <div className="text-center p-8">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Layers className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</div>
                  <div className="text-gray-600">{selectedProject.category}</div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4">{selectedProject.name}</h3>
                  <p className="text-white/90 leading-relaxed mb-6">{selectedProject.description}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {(selectedProject.link || selectedProject.github) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white/90">Project Links</h4>
                      <div className="space-y-2">
                        {selectedProject.link && (
                          <a
                            href={selectedProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Live Project</span>
                          </a>
                        )}
                        {selectedProject.github && (
                          <a
                            href={selectedProject.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span>View Source Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white/90">Project Category</h4>
                    <div className="text-white/80">{selectedProject.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 