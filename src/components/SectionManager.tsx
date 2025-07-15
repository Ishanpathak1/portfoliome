'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Edit3, Save, X } from 'lucide-react';
import { CustomSection, ResumeData } from '@/types/resume';

interface SectionManagerProps {
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  sectionOrder?: string[];
  hiddenSections?: string[];
  onSectionOrderChange?: (order: string[]) => void;
  onHiddenSectionsChange?: (hidden: string[]) => void;
}

const DEFAULT_SECTIONS = [
  { id: 'summary', title: 'Professional Summary', required: true },
  { id: 'experience', title: 'Work Experience', required: true },
  { id: 'education', title: 'Education', required: true },
  { id: 'skills', title: 'Skills', required: true },
  { id: 'projects', title: 'Projects', required: false },
  { id: 'certifications', title: 'Certifications', required: false },
];

const CUSTOM_SECTION_TEMPLATES = [
  { type: 'text', title: 'About Me', placeholder: 'Write a personal introduction...' },
  { type: 'list', title: 'Achievements', placeholder: 'List your key achievements' },
  { type: 'list', title: 'Awards', placeholder: 'List your awards and recognitions' },
  { type: 'list', title: 'Publications', placeholder: 'List your publications' },
  { type: 'text', title: 'Volunteer Work', placeholder: 'Describe your volunteer experience...' },
  { type: 'list', title: 'Languages', placeholder: 'List languages you speak' },
  { type: 'text', title: 'Hobbies & Interests', placeholder: 'Describe your interests...' },
];

export function SectionManager({ 
  resumeData, 
  onUpdateResumeData, 
  sectionOrder = [], 
  hiddenSections = [],
  onSectionOrderChange,
  onHiddenSectionsChange 
}: SectionManagerProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSectionType, setNewSectionType] = useState<'text' | 'list'>('text');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  const customSections = resumeData.customSections || [];
  
  // Combine default and custom sections
  const allSections = [
    ...DEFAULT_SECTIONS,
    ...customSections.map(section => ({
      id: section.id,
      title: section.title,
      required: false,
      custom: true
    }))
  ];

  // Get ordered sections (use provided order or default order)
  const orderedSections = sectionOrder.length > 0 
    ? sectionOrder.map(id => allSections.find(s => s.id === id)).filter(Boolean)
    : allSections;

  const addCustomSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title: newSectionTitle,
      content: newSectionType === 'list' 
        ? newSectionContent.split('\n').filter(line => line.trim())
        : newSectionContent,
      type: newSectionType === 'list' ? 'list' : 'text',
      order: customSections.length,
      visible: true
    };

    const updatedResumeData = {
      ...resumeData,
      customSections: [...customSections, newSection]
    };

    onUpdateResumeData(updatedResumeData);
    
    // Reset form
    setNewSectionTitle('');
    setNewSectionContent('');
    setIsAddingSection(false);
  };

  const updateCustomSection = (sectionId: string, updates: Partial<CustomSection>) => {
    const updatedSections = customSections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    onUpdateResumeData({
      ...resumeData,
      customSections: updatedSections
    });
  };

  const deleteCustomSection = (sectionId: string) => {
    const updatedSections = customSections.filter(section => section.id !== sectionId);
    onUpdateResumeData({
      ...resumeData,
      customSections: updatedSections
    });

    // Remove from order and hidden arrays
    if (onSectionOrderChange) {
      onSectionOrderChange(sectionOrder.filter(id => id !== sectionId));
    }
    if (onHiddenSectionsChange) {
      onHiddenSectionsChange(hiddenSections.filter(id => id !== sectionId));
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!onSectionOrderChange) return;

    const currentOrder = sectionOrder.length > 0 ? sectionOrder : allSections.map(s => s.id);
    const currentIndex = currentOrder.indexOf(sectionId);
    
    if (currentIndex === -1) return;
    
    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[currentIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[currentIndex]];
      onSectionOrderChange(newOrder);
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!onHiddenSectionsChange) return;

    const isHidden = hiddenSections.includes(sectionId);
    const newHidden = isHidden
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    
    onHiddenSectionsChange(newHidden);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Manage Sections</h3>
        <button
          onClick={() => setIsAddingSection(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Add New Section Form */}
      {isAddingSection && (
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-medium text-white mb-4">Add Custom Section</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Section Type</label>
              <select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value as 'text' | 'list')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="text">Text Content</option>
                <option value="list">List Items</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Section Title</label>
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g., Awards, Volunteer Work, Hobbies"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Content</label>
              <textarea
                value={newSectionContent}
                onChange={(e) => setNewSectionContent(e.target.value)}
                placeholder={newSectionType === 'list' 
                  ? "Enter each item on a new line\nItem 1\nItem 2\nItem 3"
                  : "Write your content here..."}
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addCustomSection}
                disabled={!newSectionTitle.trim()}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Add Section</span>
              </button>
              <button
                onClick={() => {
                  setIsAddingSection(false);
                  setNewSectionTitle('');
                  setNewSectionContent('');
                }}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Templates */}
      {!isAddingSection && (
        <div className="mb-6">
          <h4 className="text-white mb-3">Quick Add:</h4>
          <div className="flex flex-wrap gap-2">
            {CUSTOM_SECTION_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewSectionTitle(template.title);
                  setNewSectionType(template.type as 'text' | 'list');
                  setNewSectionContent(template.placeholder);
                  setIsAddingSection(true);
                }}
                className="px-3 py-1 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors"
              >
                {template.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section List */}
      <div className="space-y-3">
        {orderedSections.map((section, index) => {
          if (!section) return null;
          
          const isHidden = hiddenSections.includes(section.id);
          const isCustom = 'custom' in section && section.custom;
          const customSection = customSections.find(s => s.id === section.id);
          
          return (
            <div
              key={section.id}
              className={`bg-white/10 border border-white/20 rounded-lg p-4 ${
                isHidden ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{section.title}</span>
                  {section.required && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                      Required
                    </span>
                  )}
                  {isCustom ? (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      Custom
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Move Up/Down */}
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === orderedSections.length - 1}
                    className="p-1 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Show/Hide */}
                  {!section.required ? (
                    <button
                      onClick={() => toggleSectionVisibility(section.id)}
                      className="p-1 text-white/70 hover:text-white"
                    >
                      {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  ) : null}

                  {/* Edit Custom Section */}
                  {isCustom ? (
                    <button
                      onClick={() => setEditingSection(section.id)}
                      className="p-1 text-white/70 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  ) : null}

                  {/* Delete Custom Section */}
                  {isCustom ? (
                    <button
                      onClick={() => deleteCustomSection(section.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Custom Section Content Preview */}
              {isCustom && customSection ? (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-gray-300 text-sm">
                    {Array.isArray(customSection.content) 
                      ? customSection.content.slice(0, 3).join(', ') + (customSection.content.length > 3 ? '...' : '')
                      : customSection.content.slice(0, 100) + (customSection.content.length > 100 ? '...' : '')
                    }
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
} 