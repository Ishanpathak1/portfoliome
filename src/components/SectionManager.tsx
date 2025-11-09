'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Edit3, Save, X } from 'lucide-react';
import { CustomCard, CustomSection, ResumeData } from '@/types/resume';

interface SectionManagerProps {
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  sectionOrder?: string[];
  hiddenSections?: string[];
  onSectionOrderChange?: (order: string[]) => void;
  onHiddenSectionsChange?: (hidden: string[]) => void;
  sectionRenderStyle?: { [sectionId: string]: 'grouped' | 'cards' };
  onSectionRenderStyleChange?: (styleMap: { [sectionId: string]: 'grouped' | 'cards' }) => void;
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
  { type: 'list', title: 'Analytics Metrics', placeholder: 'Projects Completed: 5\nAccuracy Rate: 95%\nData Processed: 10,000+\nModels Deployed: 3' },
];

export function SectionManager({ 
  resumeData, 
  onUpdateResumeData, 
  sectionOrder = [], 
  hiddenSections = [],
  onSectionOrderChange,
  onHiddenSectionsChange,
  sectionRenderStyle = {},
  onSectionRenderStyleChange
}: SectionManagerProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSectionType, setNewSectionType] = useState<'text' | 'list' | 'cards'>('text');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newSectionCards, setNewSectionCards] = useState<CustomCard[]>([]);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<'text' | 'list' | 'cards'>('text');
  const [editTextContent, setEditTextContent] = useState('');
  const [editListItems, setEditListItems] = useState<string[]>([]);
  const [editCards, setEditCards] = useState<CustomCard[]>([]);

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
      content:
        newSectionType === 'list'
          ? newSectionContent.split('\n').filter(line => line.trim())
          : newSectionType === 'cards'
          ? newSectionCards.filter(c => c && (c.title?.trim() || c.description?.trim() || c.date?.trim() || c.link?.trim()))
          : newSectionContent,
      type: newSectionType,
      order: customSections.length,
      visible: true
    };

    const updatedResumeData = {
      ...resumeData,
      customSections: [...customSections, newSection]
    };

    onUpdateResumeData(updatedResumeData);

    // Ensure new custom section appears in templates that rely on sectionOrder
    if (onSectionOrderChange) {
      const currentOrder = sectionOrder.length > 0
        ? sectionOrder
        : allSections.map(s => s.id);
      const newOrder = [...currentOrder, newSection.id];
      onSectionOrderChange(newOrder);
    }
    
    // Reset form
    setNewSectionTitle('');
    setNewSectionContent('');
    setNewSectionCards([]);
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

  const setRenderStyle = (sectionId: string, style: 'grouped' | 'cards') => {
    if (!onSectionRenderStyleChange) return;
    const updated = { ...sectionRenderStyle, [sectionId]: style };
    onSectionRenderStyleChange(updated);
  };

  const beginEditSection = (sectionId: string) => {
    const section = customSections.find(s => s.id === sectionId);
    if (!section) return;
    setEditingSection(sectionId);
    setEditTitle(section.title || '');
    const normalizedType: 'text' | 'list' | 'cards' =
      section.type === 'list' ? 'list' : section.type === 'cards' ? 'cards' : 'text';
    setEditType(normalizedType);
    if (normalizedType === 'list') {
      setEditListItems(Array.isArray(section.content) ? (section.content as string[]) : section.content ? [String(section.content)] : []);
      setEditTextContent('');
      setEditCards([]);
    } else if (normalizedType === 'cards') {
      const asArray = Array.isArray(section.content) ? (section.content as any[]) : [];
      const cards: CustomCard[] = asArray.map((it: any) => ({
        title: String(it?.title || ''),
        description: it?.description ? String(it.description) : undefined,
        date: it?.date ? String(it.date) : undefined,
        link: it?.link ? String(it.link) : undefined,
      }));
      setEditCards(cards);
      setEditTextContent('');
      setEditListItems([]);
    } else {
      setEditTextContent(
        typeof section.content === 'string'
          ? section.content
          : Array.isArray(section.content)
          ? (section.content as string[]).join('\n')
          : ''
      );
      setEditListItems([]);
      setEditCards([]);
    }
  };

  const saveEditSection = (sectionId: string) => {
    const updates: Partial<CustomSection> = {
      title: editTitle,
      type: editType,
      content:
        editType === 'list'
          ? editListItems.filter(item => item.trim())
          : editType === 'cards'
          ? editCards.filter(c => c && (c.title?.trim() || c.description?.trim() || c.date?.trim() || c.link?.trim()))
          : editTextContent
    };
    updateCustomSection(sectionId, updates);
    setEditingSection(null);
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
                onChange={(e) => setNewSectionType(e.target.value as 'text' | 'list' | 'cards')}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="text">Text Content</option>
                <option value="list">List Items</option>
                <option value="cards">Cards (Title + Text + Date)</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Section Title</label>
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="e.g., Awards, Volunteer Work, Hobbies"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {newSectionType !== 'cards' ? (
              <div>
                <label className="block text-white mb-2">Content</label>
                <textarea
                  value={newSectionContent}
                  onChange={(e) => setNewSectionContent(e.target.value)}
                  placeholder={newSectionType === 'list' 
                    ? "Enter each item on a new line\nItem 1\nItem 2\nItem 3"
                    : "Write your content here..."}
                  rows={4}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white">Cards</label>
                  <button
                    onClick={() => setNewSectionCards([...
                      newSectionCards,
                      { title: '', description: '', date: '', link: '' }
                    ])}
                    className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/15"
                  >
                    Add Card
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {newSectionCards.map((card, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                      <div className="text-white/70 text-xs">Card {i + 1}</div>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const next = [...newSectionCards];
                          next[i] = { ...next[i], title: e.target.value };
                          setNewSectionCards(next);
                        }}
                        placeholder="Heading / Title"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <textarea
                        rows={3}
                        value={card.description || ''}
                        onChange={(e) => {
                          const next = [...newSectionCards];
                          next[i] = { ...next[i], description: e.target.value };
                          setNewSectionCards(next);
                        }}
                        placeholder="Text / Description"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="date"
                        value={card.date || ''}
                        onChange={(e) => {
                          const next = [...newSectionCards];
                          next[i] = { ...next[i], date: e.target.value };
                          setNewSectionCards(next);
                        }}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="url"
                        value={card.link || ''}
                        onChange={(e) => {
                          const next = [...newSectionCards];
                          next[i] = { ...next[i], link: e.target.value };
                          setNewSectionCards(next);
                        }}
                        placeholder="Optional: https://example.com"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => setNewSectionCards(newSectionCards.filter((_, idx) => idx !== i))}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  {/* Render Style (custom sections only) */}
                  {isCustom && onSectionRenderStyleChange ? (
                    <div className="flex items-center space-x-1 mr-2">
                      <button
                        onClick={() => setRenderStyle(section.id, 'grouped')}
                        className={`px-2 py-1 text-xs rounded-md ${
                          (sectionRenderStyle[section.id] || 'grouped') === 'grouped'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/15'
                        }`}
                      >
                        Grouped
                      </button>
                      <button
                        onClick={() => setRenderStyle(section.id, 'cards')}
                        className={`px-2 py-1 text-xs rounded-md ${
                          sectionRenderStyle[section.id] === 'cards'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/15'
                        }`}
                      >
                        Cards
                      </button>
                    </div>
                  ) : null}
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
                      onClick={() => beginEditSection(section.id)}
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
                  {editingSection === section.id ? (
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white mb-1 text-sm">Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                        </div>
                        <div>
                          <label className="block text-white mb-1 text-sm">Content Type</label>
                          <select
                            value={editType}
                            onChange={(e) => {
                              const next = e.target.value as 'text' | 'list' | 'cards';
                              if (next === 'list') {
                                if (editType === 'text') {
                                  const fromText = editTextContent
                                    ? editTextContent.split('\n').map(s => s.trim()).filter(Boolean)
                                    : [];
                                  setEditListItems(fromText);
                                  setEditTextContent('');
                                  setEditCards([]);
                                }
                                if (editType === 'cards') {
                                  const fromCards = editCards.map(c => (c.title?.trim() || c.description?.trim() || '')).filter(Boolean);
                                  setEditListItems(fromCards);
                                  setEditCards([]);
                                }
                              }
                              if (next === 'cards') {
                                if (editType === 'text') {
                                  const initial: CustomCard = { title: '', description: editTextContent || '', date: '' };
                                  setEditCards(editTextContent ? [initial] : []);
                                  setEditTextContent('');
                                  setEditListItems([]);
                                }
                                if (editType === 'list') {
                                  const initialCards: CustomCard[] = editListItems.map(t => ({ title: t, description: '', date: '' }));
                                  setEditCards(initialCards);
                                  setEditListItems([]);
                                }
                              }
                              if (next === 'text') {
                                if (editType === 'list') {
                                  setEditTextContent(editListItems.join('\n'));
                                  setEditListItems([]);
                                  setEditCards([]);
                                }
                                if (editType === 'cards') {
                                  const joined = editCards.map(c => c.title || c.description || '').filter(Boolean).join('\n');
                                  setEditTextContent(joined);
                                  setEditCards([]);
                                  setEditListItems([]);
                                }
                              }
                              setEditType(next);
                            }}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          >
                            <option value="text">Text</option>
                            <option value="list">List</option>
                            <option value="cards">Cards</option>
                          </select>
                        </div>
                      </div>

                      {editType === 'text' && (
                        <div>
                          <label className="block text-white mb-1 text-sm">Text Content</label>
                          <textarea
                            rows={5}
                            value={editTextContent}
                            onChange={(e) => setEditTextContent(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                        </div>
                      )}

                      {editType === 'list' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-white text-sm">Cards</label>
                            <button
                              onClick={() => setEditListItems([...editListItems, ''])}
                              className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/15"
                            >
                              Add Card
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {editListItems.map((item, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                                <div className="text-white/70 text-xs">Card {i + 1}</div>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const next = [...editListItems];
                                    next[i] = e.target.value;
                                    setEditListItems(next);
                                  }}
                                  placeholder={`Enter content for card ${i + 1}`}
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => setEditListItems(editListItems.filter((_, idx) => idx !== i))}
                                    className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {editType === 'cards' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-white text-sm">Cards</label>
                            <button
                              onClick={() => setEditCards([...editCards, { title: '', description: '', date: '', link: '' }])}
                              className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/15"
                            >
                              Add Card
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {editCards.map((card, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                                <div className="text-white/70 text-xs">Card {i + 1}</div>
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => {
                                    const next = [...editCards];
                                    next[i] = { ...next[i], title: e.target.value };
                                    setEditCards(next);
                                  }}
                                  placeholder="Heading / Title"
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <textarea
                                  rows={3}
                                  value={card.description || ''}
                                  onChange={(e) => {
                                    const next = [...editCards];
                                    next[i] = { ...next[i], description: e.target.value };
                                    setEditCards(next);
                                  }}
                                  placeholder="Text / Description"
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                  type="date"
                                  value={card.date || ''}
                                  onChange={(e) => {
                                    const next = [...editCards];
                                    next[i] = { ...next[i], date: e.target.value };
                                    setEditCards(next);
                                  }}
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <input
                                  type="url"
                                  value={card.link || ''}
                                  onChange={(e) => {
                                    const next = [...editCards];
                                    next[i] = { ...next[i], link: e.target.value };
                                    setEditCards(next);
                                  }}
                                  placeholder="Optional: https://example.com"
                                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => setEditCards(editCards.filter((_, idx) => idx !== i))}
                                    className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveEditSection(section.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-300 text-sm">
                      {Array.isArray(customSection.content)
                        ? (typeof customSection.content[0] === 'string'
                            ? (customSection.content as string[]).slice(0, 3).join(', ') + ((customSection.content as any[]).length > 3 ? '...' : '')
                            : (customSection.content as CustomCard[]).slice(0, 3).map(c => c.title || c.description || '').filter(Boolean).join(', ') + ((customSection.content as any[]).length > 3 ? '...' : '')
                          )
                        : (customSection.content as string).slice(0, 100) + ((customSection.content as string).length > 100 ? '...' : '')
                      }
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
} 