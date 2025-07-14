'use client';

import { useState } from 'react';
import { AVAILABLE_TEMPLATES, TemplateId, TemplateConfig } from '@/types/templates';
import { Check, Palette, Sparkles, Monitor, Code, Briefcase } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onTemplateChange: (templateId: TemplateId) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'modern': return <Sparkles className="w-5 h-5" />;
    case 'minimalist': return <Monitor className="w-5 h-5" />;
    case 'creative': return <Palette className="w-5 h-5" />;
    case 'professional': return <Briefcase className="w-5 h-5" />;
    case 'developer': return <Code className="w-5 h-5" />;
    default: return <Monitor className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'modern': return 'from-purple-500 to-blue-600';
    case 'minimalist': return 'from-gray-500 to-slate-600';
    case 'creative': return 'from-pink-500 to-orange-500';
    case 'professional': return 'from-blue-600 to-indigo-700';
    case 'developer': return 'from-green-500 to-teal-600';
    default: return 'from-gray-500 to-slate-600';
  }
};

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-3">Choose Your Template</h3>
        <p className="text-gray-300">Select a design that reflects your style and profession</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id 
                ? 'scale-105 ring-2 ring-blue-400' 
                : 'hover:scale-102'
            }`}
            onClick={() => onTemplateChange(template.id as TemplateId)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            <div className={`
              relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden
              ${selectedTemplate === template.id ? 'bg-white/20' : 'hover:bg-white/15'}
              transition-all duration-300
            `}>
              {/* Template Preview */}
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {/* Template Preview Content */}
                <div className="absolute inset-0 p-4">
                  {template.id === 'modern-glassmorphism' && (
                    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4 text-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto mb-2"></div>
                        <div className="h-2 bg-white/30 rounded mb-1"></div>
                        <div className="h-1 bg-white/20 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 'minimalist-clean' && (
                    <div className="h-full bg-white rounded-lg p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-800 rounded-full mx-auto mb-2"></div>
                        <div className="h-2 bg-gray-300 rounded mb-1 w-16 mx-auto"></div>
                        <div className="h-1 bg-gray-200 rounded w-12 mx-auto"></div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 'dark-professional' && (
                    <div className="h-full bg-gray-900 rounded-lg p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                        <div className="h-2 bg-gray-600 rounded mb-1 w-16 mx-auto"></div>
                        <div className="h-1 bg-gray-700 rounded w-12 mx-auto"></div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 'creative-gradient' && (
                    <div className="h-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mx-auto mb-2"></div>
                        <div className="h-2 bg-white/80 rounded mb-1 w-16 mx-auto"></div>
                        <div className="h-1 bg-white/60 rounded w-12 mx-auto"></div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 'developer-terminal' && (
                    <div className="h-full bg-black rounded-lg p-4 flex items-center justify-center font-mono">
                      <div className="text-left">
                        <div className="text-green-400 text-xs mb-1">$ whoami</div>
                        <div className="text-white text-xs mb-1">developer</div>
                        <div className="text-green-400 text-xs">$ portfolio --show</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <div className={`
                    px-3 py-1 bg-gradient-to-r ${getCategoryColor(template.category)} 
                    rounded-full text-white text-xs font-medium flex items-center space-x-1
                  `}>
                    {getCategoryIcon(template.category)}
                    <span className="capitalize">{template.category}</span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-2">{template.name}</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{template.description}</p>
                
                {/* Features */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Features</div>
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-full">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              {(hoveredTemplate === template.id || selectedTemplate === template.id) && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Template Info Details */}
      {selectedTemplate && (
        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          {(() => {
            const template = AVAILABLE_TEMPLATES.find(t => t.id === selectedTemplate);
            if (!template) return null;
            
            return (
              <div>
                <h5 className="text-lg font-bold text-white mb-3">
                  {template.name} Features
                </h5>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {template.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
} 