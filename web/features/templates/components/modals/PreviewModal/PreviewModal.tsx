import { X, Download } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onDownloadPDF: () => Promise<void>;
}

export function PreviewModal({ isOpen, onClose, content, onDownloadPDF }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            👁️ Preview
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div 
            id="pdf-preview"
            className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm min-h-[400px] prose prose-base max-w-none mx-auto"
            dangerouslySetInnerHTML={{
              __html: content || '<div class="flex flex-col items-center justify-center py-12 text-center"><div class="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-3xl">📄</span></div><p class="text-gray-400 text-base">No content to preview</p></div>'
            }}
          />
        </div>
      </div>
    </div>
  );
}
