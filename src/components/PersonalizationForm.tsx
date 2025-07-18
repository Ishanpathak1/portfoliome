'use client';

import { useState } from 'react';
import { ArrowLeft, Palette, Layout, Eye, Plus, Settings, Stethoscope, Edit2 } from 'lucide-react';
import { ResumeData, PersonalizationData, SectionHeadings } from '@/types/resume';
import { TemplateSelector } from './TemplateSelector';
import { SectionManager } from './SectionManager';
import { HealthcareForm } from './HealthcareForm';
import { SectionHeadingEditor } from './SectionHeadingEditor';
import { TemplateId } from '@/types/templates';
import { getAllSectionHeadings } from '@/lib/section-headings';

interface PersonalizationFormProps {
  resumeData: ResumeData;
  personalization: PersonalizationData;
  onPersonalizationChange: (data: PersonalizationData) => void;
  onResumeDataChange: (data: ResumeData) => void;
  onPreviewClick: () => void;
}

export function PersonalizationForm({ resumeData, personalization, onPersonalizationChange, onResumeDataChange, onPreviewClick }: PersonalizationFormProps) {
  const [formData, setFormData] = useState<PersonalizationData>(personalization);
  const [activeTab, setActiveTab] = useState<'template' | 'sections' | 'healthcare' | 'styling'>('template');
  const [showHeadingEditor, setShowHeadingEditor] = useState(false);

  const updateFormData = (updates: Partial<PersonalizationData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onPersonalizationChange(newData);
  };

  const handleSectionHeadingsUpdate = async (headings: SectionHeadings) => {
    updateFormData({ sectionHeadings: headings });
  };

  const isHealthcareProfessional = resumeData.profession === 'healthcare';



  const colorSchemes = [
    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Forest Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500' },
    { id: 'orange', name: 'Sunset Orange', color: 'bg-orange-500' },
    { id: 'red', name: 'Crimson Red', color: 'bg-red-500' },
  ] as const;

  const layouts = [
    { id: 'single-column', name: 'Single Column', description: 'One flowing column' },
    { id: 'two-column', name: 'Two Column', description: 'Sidebar with main content' },
    { id: 'timeline', name: 'Timeline', description: 'Chronological timeline layout' },
  ] as const;

  const additionalSectionOptions = [
    'Certifications',
    'Awards',
    'Volunteer Work',
    'Languages',
    'Hobbies',
    'Publications',
    'References',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPersonalizationChange(formData);
  };

  const tabs = [
    { id: 'template', name: 'Template', icon: Palette },
    { id: 'sections', name: 'Sections', icon: Settings },
    ...(isHealthcareProfessional ? [{ id: 'healthcare', name: 'Healthcare Info', icon: Stethoscope }] : []),
    { id: 'styling', name: 'Styling', icon: Layout },
  ];

  return (
    <>
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Personalize Your Portfolio
          </h1>
          <p className="text-lg text-gray-300">
            Customize the look, sections, and features of your portfolio.
          </p>
        </div>
        
        <button
          onClick={onPreviewClick}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <Eye className="w-5 h-5" />
          <span>Preview Portfolio</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>



      {/* Tab Content */}
      <div className="space-y-8">
        {/* Template Selection Tab */}
        {activeTab === 'template' && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <TemplateSelector
              selectedTemplate={formData.templateId as TemplateId}
              onTemplateChange={(templateId) => updateFormData({ templateId })}
            />
          </div>
        )}

        {/* Section Management Tab */}
        {activeTab === 'sections' && (
          <SectionManager
            resumeData={resumeData}
            onUpdateResumeData={onResumeDataChange}
            sectionOrder={formData.sectionOrder}
            hiddenSections={formData.hiddenSections}
            onSectionOrderChange={(order) => updateFormData({ sectionOrder: order })}
            onHiddenSectionsChange={(hidden) => updateFormData({ hiddenSections: hidden })}
          />
        )}

        {/* Healthcare Information Tab */}
        {activeTab === 'healthcare' && isHealthcareProfessional && (
          <HealthcareForm
            healthcareData={resumeData.healthcare || {}}
            onHealthcareDataChange={(healthcare) => 
              onResumeDataChange({ ...resumeData, healthcare })
            }
          />
        )}

        {/* Styling Tab */}
        {activeTab === 'styling' && (
          <form onSubmit={handleSubmit} className="space-y-8">



        {/* Color Scheme Selection */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Color Scheme</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorSchemes.map((scheme) => (
              <label
                key={scheme.id}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  formData.colorScheme === scheme.id
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="colorScheme"
                  value={scheme.id}
                  checked={formData.colorScheme === scheme.id}
                  onChange={(e) => updateFormData({ colorScheme: e.target.value as any })}
                  className="sr-only"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-full ${scheme.color}`} />
                  <span className="text-white text-sm font-medium">{scheme.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Layout Selection */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Layout className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Layout Style</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <label
                key={layout.id}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  formData.layout === layout.id
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="layout"
                  value={layout.id}
                  checked={formData.layout === layout.id}
                  onChange={(e) => updateFormData({ layout: e.target.value as any })}
                  className="sr-only"
                />
                <h3 className="font-semibold text-white mb-1">{layout.name}</h3>
                <p className="text-gray-300 text-sm">{layout.description}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Additional Options</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.showPhoto}
                onChange={(e) => updateFormData({ showPhoto: e.target.checked })}
                className="w-5 h-5 text-purple-500 rounded border-white/30 focus:ring-purple-500 bg-white/10"
              />
              <span className="text-white">Include space for profile photo</span>
            </label>
          </div>
        </div>

        {/* Section Headings */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Edit2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Section Headings</h2>
          </div>
          
          <p className="text-gray-300 mb-4">
            Customize section headings to match your profession (e.g., "Technical Skills" instead of "Skills").
          </p>
          
          <button
            onClick={() => setShowHeadingEditor(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Customize Section Headings
          </button>
        </div>

        {/* Additional Sections */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Plus className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Additional Sections</h2>
          </div>
          
          <p className="text-gray-300 mb-4">
            Select any additional sections you'd like to include in your portfolio:
          </p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {additionalSectionOptions.map((section) => (
              <label key={section} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.additionalSections.includes(section)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFormData({
                        additionalSections: [...formData.additionalSections, section],
                      });
                    } else {
                      updateFormData({
                        additionalSections: formData.additionalSections.filter(s => s !== section),
                      });
                    }
                  }}
                  className="w-5 h-5 text-purple-500 rounded border-white/30 focus:ring-purple-500 bg-white/10"
                />
                <span className="text-white">{section}</span>
              </label>
            ))}
          </div>
        </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                Update Styling
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Final Generate Button */}
      <div className="flex justify-center mt-12">
        <button 
          onClick={onPreviewClick}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl"
        >
          Generate Portfolio
        </button>
      </div>
    </div>
    
    {/* Section Heading Editor Modal */}
    {showHeadingEditor && (
      <SectionHeadingEditor
        sectionHeadings={getAllSectionHeadings(formData.sectionHeadings)}
        onUpdate={handleSectionHeadingsUpdate}
        onClose={() => setShowHeadingEditor(false)}
      />
    )}
    </>
  );
} 