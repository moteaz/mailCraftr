'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Heading1, Heading2 } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write your content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (editor) {
    (window as any).__tiptapEditor = editor;
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 border-b border-gray-300 bg-gray-50 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
          title="Heading 1"
          aria-label="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Heading 2"
          aria-label="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Bold"
          aria-label="Bold"
        >
          <Bold className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Italic"
          aria-label="Italic"
        >
          <Italic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="Underline"
          aria-label="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
          title="Align Left"
          aria-label="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
          title="Align Center"
          aria-label="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
          title="Align Right"
          aria-label="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Bullet List"
          aria-label="Bullet List"
        >
          <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 sm:p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1" />
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded cursor-pointer"
          title="Text Color"
          aria-label="Text Color"
        />
        <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Undo"
          aria-label="Undo"
        >
          <Undo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Redo"
          aria-label="Redo"
        >
          <Redo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-sm sm:prose max-w-none p-3 sm:p-4 min-h-[200px] sm:min-h-[300px] focus:outline-none text-sm sm:text-base"
      />
    </div>
  );
}
