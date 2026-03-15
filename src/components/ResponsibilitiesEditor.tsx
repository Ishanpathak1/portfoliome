'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect } from 'react';
import { sanitizeResponsibilityHtml } from '@/lib/responsibility-html';

function extractListItemsFromHtml(html: string): string[] {
  if (typeof document === 'undefined') return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const lis = doc.querySelectorAll('li');
  return Array.from(lis).map((li) => {
    const p = li.querySelector('p');
    return (p ? p.innerHTML : li.innerHTML).trim();
  });
}

function itemsToHtml(items: string[]): string {
  if (!items.length) return '<p></p>';
  const safe = items.map((item) => {
    const raw = item.trim() || '<br>';
    const content = /<[a-z][\s\S]*>/i.test(raw) ? sanitizeResponsibilityHtml(raw) : raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<li><p>${content}</p></li>`;
  });
  return `<ul>${safe.join('')}</ul>`;
}

interface ResponsibilitiesEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function ResponsibilitiesEditor({
  value,
  onChange,
  placeholder = 'Add bullet points (Enter for new line, Backspace to delete)',
  className = '',
  minHeight = '120px'
}: ResponsibilitiesEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || 'Add bullet points (Enter for new line, Backspace to delete)' })
    ],
    content: itemsToHtml(value),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[120px]'
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const items = extractListItemsFromHtml(editor.getHTML());
      onChange(items);
    }
  });

  const valueKey = JSON.stringify(value);
  useEffect(() => {
    if (!editor) return;
    const current = extractListItemsFromHtml(editor.getHTML());
    if (JSON.stringify(current) !== valueKey) {
      editor.commands.setContent(itemsToHtml(value));
    }
  }, [editor, valueKey]);

  const toggleBold = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const setListType = useCallback((type: 'bullet' | 'ordered') => {
    if (!editor) return;
    if (type === 'bullet') {
      editor.chain().focus().toggleBulletList().run();
    } else {
      editor.chain().focus().toggleOrderedList().run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={`rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] ${className}`}>
      <div className="flex items-center gap-1 border-b border-[rgb(var(--border))] px-2 py-1.5">
        <button
          type="button"
          onClick={() => setListType('bullet')}
          className={`p-1.5 rounded text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] ${editor.isActive('bulletList') ? 'bg-[rgb(var(--muted))]/20 text-[rgb(var(--fg))]' : ''}`}
          title="Bullet list"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setListType('ordered')}
          className={`p-1.5 rounded text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] ${editor.isActive('orderedList') ? 'bg-[rgb(var(--muted))]/20 text-[rgb(var(--fg))]' : ''}`}
          title="Numbered list"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>
        <span className="w-px h-4 bg-[rgb(var(--border))]" aria-hidden />
        <button
          type="button"
          onClick={toggleBold}
          className={`p-1.5 rounded text-[rgb(var(--muted))] hover:bg-[rgb(var(--muted))]/20 hover:text-[rgb(var(--fg))] font-bold ${editor.isActive('bold') ? 'bg-[rgb(var(--muted))]/20 text-[rgb(var(--fg))]' : ''}`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <span className="ml-2 text-xs text-[rgb(var(--muted))]">Select text → Bold (Ctrl+B)</span>
      </div>
      <EditorContent
        editor={editor}
        className="px-3 py-2 [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-sm [&_[data-placeholder]::before]:text-[rgb(var(--muted))] [&_[data-placeholder]::before]:float-left [&_[data-placeholder]::before]:h-0 [&_[data-placeholder]::before]:pointer-events-none [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:leading-relaxed"
        style={{ minHeight }}
      />
    </div>
  );
}
