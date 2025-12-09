import { X, Download, Eye } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onDownloadPDF: () => Promise<void>;
}

export function PreviewModal({ isOpen, onClose, content, onDownloadPDF }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with smooth fade-in */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div 
          className="bg-white rounded-none sm:rounded-3xl shadow-2xl w-full h-full sm:max-w-7xl sm:h-[96vh] flex flex-col pointer-events-auto transform animate-in zoom-in-95 fade-in duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200/80 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Preview
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Review your content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onDownloadPDF}
                className="group relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              
              <button
                onClick={onClose}
                className="group p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar p-4 sm:p-8">
            <div 
              id="pdf-preview"
              className="bg-white p-6 sm:p-12 max-w-5xl mx-auto prose prose-sm sm:prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{
                  __html: content || `
                    <div class="flex flex-col items-center justify-center py-20 text-center">
                      <div class="relative mb-6">
                        <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
                          <span class="text-4xl">📄</span>
                        </div>
                        <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">No Content Yet</h3>
                      <p class="text-gray-500 max-w-sm">Start editing to see your content preview here</p>
                    </div>
                  `
                }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
