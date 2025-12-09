import { useState, useRef } from 'react';
import type { Template } from '@/types';
import { ModalHeader } from './ModalHeader';
import { VariablesPanel } from './VariablesPanel';
import { EditorPanel } from './EditorPanel';
import { ModalFooter } from './ModalFooter';

interface EditTemplateModalProps {
  template: Template | null;
  content: string;
  onContentChange: (content: string) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
  onDownloadPDF: () => Promise<void>;
  onShowPreview: () => void;
  updating: boolean;
}

export function EditTemplateModal({
  template,
  content,
  onContentChange,
  onClose,
  onSave,
  onDownloadPDF,
  onShowPreview,
  updating,
}: EditTemplateModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<any>(null);

  if (!template) return null;

  const insertPlaceholder = (key: string) => {
    const placeholder = `{{${key}}}`;
    if (editorRef.current) {
      editorRef.current.model.change((writer: any) => {
        const insertPosition = editorRef.current.model.document.selection.getFirstPosition();
        writer.insertText(placeholder, insertPosition);
      });
      editorRef.current.editing.view.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-0 sm:p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl w-full h-full sm:h-[96vh] sm:max-w-[98vw] lg:max-w-[90vw] xl:max-w-[85vw] flex flex-col overflow-hidden border-0 sm:border border-gray-200/50">
        {!isFullscreen && (
          <ModalHeader
            template={template}
            onClose={onClose}
            onDownloadPDF={onDownloadPDF}
          />
        )}

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50">
          <VariablesPanel
            placeholders={template.placeholders}
            onInsert={insertPlaceholder}
            isFullscreen={isFullscreen}
          />
          
          <EditorPanel
            content={content}
            onContentChange={onContentChange}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onShowPreview={onShowPreview}
            editorRef={editorRef}
          />
        </div>

        {!isFullscreen && (
          <ModalFooter
            onCancel={onClose}
            onSave={onSave}
            updating={updating}
          />
        )}
      </div>
    </div>
  );
}
