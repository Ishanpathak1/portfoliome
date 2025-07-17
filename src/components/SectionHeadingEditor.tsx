'use client';

import { useState } from 'react';
import { SectionHeadings } from '@/types/resume';
import { Edit2, Save, X, RotateCcw } from 'lucide-react';

interface SectionHeadingEditorProps {
  sectionHeadings: SectionHeadings | undefined;
  onUpdate: (headings: SectionHeadings) => void;
  onClose: () => void;
}

// Default section headings
const DEFAULT_HEADINGS: SectionHeadings = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  summary: 'Summary',
  contact: 'Contact',
};

// Common alternative headings for different professions
const PROFESSION_PRESETS: Record<string, Partial<SectionHeadings>> = {
  'Software Engineer': {
    experience: 'Professional Experience',
    skills: 'Technical Skills',
    projects: 'Key Projects',
  },
  'Data Scientist': {
    experience: 'Professional Experience',
    skills: 'Technical Expertise',
    projects: 'Data Science Projects',
  },
  'Product Manager': {
    experience: 'Professional Experience',
    skills: 'Core Competencies',
    projects: 'Product Initiatives',
  },
  'Designer': {
    experience: 'Design Experience',
    skills: 'Design Skills',
    projects: 'Design Portfolio',
  },
  'Marketing': {
    experience: 'Marketing Experience',
    skills: 'Marketing Skills',
    projects: 'Campaigns & Initiatives',
  },
  'Sales': {
    experience: 'Sales Experience',
    skills: 'Sales Skills',
    projects: 'Key Achievements',
  },
  'Consultant': {
    experience: 'Consulting Experience',
    skills: 'Expertise Areas',
    projects: 'Client Engagements',
  },
  'Academic': {
    experience: 'Academic & Research Experience',
    skills: 'Research Areas',
    projects: 'Research Projects',
    education: 'Academic Background',
  },
  'Healthcare': {
    experience: 'Clinical Experience',
    skills: 'Clinical Skills',
    projects: 'Clinical Initiatives',
    education: 'Medical Education',
  },
};

export function SectionHeadingEditor({ sectionHeadings, onUpdate, onClose }: SectionHeadingEditorProps) {
  const [editedHeadings, setEditedHeadings] = useState<SectionHeadings>({
    ...DEFAULT_HEADINGS,
    ...sectionHeadings,
  });

  const handleHeadingChange = (section: keyof SectionHeadings, value: string) => {
    setEditedHeadings(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(editedHeadings);
    onClose();
  };

  const handleReset = () => {
    setEditedHeadings(DEFAULT_HEADINGS);
  };

  const applyPreset = (preset: Partial<SectionHeadings>) => {
    setEditedHeadings(prev => {
      const updated = { ...prev };
      Object.entries(preset).forEach(([key, value]) => {
        if (value !== undefined) {
          updated[key] = value;
        }
      });
      return updated;
    });
  };

  const mainSections: (keyof SectionHeadings)[] = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Customize Section Headings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Customize section headings to match your profession and style preferences.
          </p>
        </div>

        <div className="p-6">
          {/* Profession Presets */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(PROFESSION_PRESETS).map(([profession, preset]) => (
                <button
                  key={profession}
                  onClick={() => applyPreset(preset)}
                  className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-gray-700"
                >
                  {profession}
                </button>
              ))}
            </div>
          </div>

          {/* Section Heading Inputs */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Section Headings</h3>
            {mainSections.map((section) => (
              <div key={section} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {section}
                </label>
                <input
                  type="text"
                  value={editedHeadings[section] || ''}
                  onChange={(e) => handleHeadingChange(section, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={DEFAULT_HEADINGS[section]}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 