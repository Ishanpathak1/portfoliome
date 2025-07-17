'use client';

import { useState } from 'react';
import { TemplateText } from '@/types/resume';
import { Save, X, RotateCcw, Type } from 'lucide-react';
import { DEFAULT_TEMPLATE_TEXT, getAllTemplateText } from '@/lib/template-text';

interface TemplateTextEditorProps {
  templateId: string;
  templateText: TemplateText | undefined;
  onUpdate: (text: TemplateText) => Promise<void>;
  onClose: () => void;
}

// Template configurations
const TEMPLATE_CONFIGS: Record<string, { name: string; fields: Array<{ key: string; label: string; description: string; type: 'text' | 'textarea' }> }> = {
  'corporate-executive': {
    name: 'Corporate Executive',
    fields: [
      { key: 'tagline', label: 'Tagline', description: 'Main tagline under your name', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Title', description: 'Call-to-action section title', type: 'text' },
      { key: 'ctaDescription', label: 'CTA Description', description: 'Call-to-action description', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Button Text', description: 'Text on the contact button', type: 'text' },
    ],
  },
  'modern-glassmorphism': {
    name: 'Modern Glassmorphism',
    fields: [
      { key: 'tagline', label: 'Tagline', description: 'Main tagline under your name', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Title', description: 'Call-to-action section title', type: 'text' },
      { key: 'ctaDescription', label: 'CTA Description', description: 'Call-to-action description', type: 'textarea' },
      { key: 'fallbackName', label: 'Fallback Name', description: 'Displayed when no name is available', type: 'text' },
      { key: 'fallbackPosition', label: 'Fallback Position', description: 'Displayed when no position is available', type: 'text' },
    ],
  },
  'creative-gradient': {
    name: 'Creative Gradient',
    fields: [
      { key: 'tagline', label: 'Tagline', description: 'Main tagline under your name', type: 'text' },
      { key: 'fallbackName', label: 'Fallback Name', description: 'Displayed when no name is available', type: 'text' },
      { key: 'fallbackSummary', label: 'Fallback Summary', description: 'Displayed when no summary is available', type: 'textarea' },
    ],
  },
  'creative-portfolio': {
    name: 'Creative Portfolio',
    fields: [
      { key: 'tagline', label: 'Tagline', description: 'Main tagline under your name', type: 'text' },
      { key: 'fallbackName', label: 'Fallback Name', description: 'Displayed when no name is available', type: 'text' },
      { key: 'fallbackSummary', label: 'Fallback Summary', description: 'Displayed when no summary is available', type: 'textarea' },
    ],
  },
  'developer-terminal': {
    name: 'Developer Terminal',
    fields: [], // No customizable text for this template
  },
  'full-stack-dev': {
    name: 'Full Stack Dev',
    fields: [
      { key: 'endMessage', label: 'End Message', description: 'Message displayed at the end of the portfolio', type: 'text' },
      { key: 'footerMessage', label: 'Footer Message', description: 'Thank you message in the footer', type: 'text' },
      { key: 'techStack', label: 'Tech Stack', description: 'Technology stack description', type: 'text' },
    ],
  },
  'minimalist-clean': {
    name: 'Minimalist Clean',
    fields: [
      { key: 'fallbackName', label: 'Fallback Name', description: 'Displayed when no name is available', type: 'text' },
      { key: 'fallbackPosition', label: 'Fallback Position', description: 'Displayed when no position is available', type: 'text' },
      { key: 'fallbackSummary', label: 'Fallback Summary', description: 'Displayed when no summary is available', type: 'textarea' },
    ],
  },
  'tech-innovator': {
    name: 'Tech Innovator',
    fields: [
      { key: 'fallbackName', label: 'Fallback Name', description: 'Displayed when no name is available', type: 'text' },
      { key: 'tagline', label: 'Tagline', description: 'Main tagline under the prompt', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Title', description: 'Call-to-action title in footer', type: 'text' },
      { key: 'ctaDescription', label: 'CTA Description', description: 'Call-to-action description in footer', type: 'textarea' },
    ],
  },
  'open-source-contributor': {
    name: 'Open Source Contributor',
    fields: [
      { key: 'fallbackName', label: 'Fallback Name', description: 'Displayed when no name is available', type: 'text' },
      { key: 'tagline', label: 'Tagline', description: 'Main tagline under the name', type: 'text' },
      { key: 'footerTitle', label: 'Footer Title', description: 'Title in the footer section', type: 'text' },
      { key: 'footerDescription', label: 'Footer Description', description: 'Description in the footer section', type: 'textarea' },
    ],
  },
};

export function TemplateTextEditor({ templateId, templateText, onUpdate, onClose }: TemplateTextEditorProps) {
  const templateKey = templateId.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  const config = TEMPLATE_CONFIGS[templateId];
  
  const [editedText, setEditedText] = useState<TemplateText>(() => {
    const currentText = getAllTemplateText(templateText, templateId);
    return {
      ...templateText,
      [templateKey]: currentText,
    };
  });

  if (!config) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Not Supported</h2>
          <p className="text-gray-600 mb-4">
            Text customization is not yet available for this template.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleFieldChange = (fieldKey: string, value: string) => {
    setEditedText(prev => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        [fieldKey]: value,
      },
    }));
  };

  const handleSave = async () => {
    await onUpdate(editedText);
    onClose();
  };

  const handleReset = () => {
    setEditedText({
      ...templateText,
      [templateKey]: DEFAULT_TEMPLATE_TEXT[templateKey],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Customize Template Text</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Customize the text content for your <strong>{config.name}</strong> template.
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={editedText[templateKey]?.[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder={DEFAULT_TEMPLATE_TEXT[templateKey]?.[field.key] || ''}
                  />
                ) : (
                  <input
                    type="text"
                    value={editedText[templateKey]?.[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={DEFAULT_TEMPLATE_TEXT[templateKey]?.[field.key] || ''}
                  />
                )}
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