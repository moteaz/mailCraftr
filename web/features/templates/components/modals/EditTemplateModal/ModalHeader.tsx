import { X, Download, FileText } from 'lucide-react';
import type { Template } from '@/types';

interface ModalHeaderProps {
  template: Template;
  onClose: () => void;
  onDownloadPDF: () => Promise<void>;
}

export function ModalHeader({ template, onClose, onDownloadPDF }: ModalHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-[1px]">
      <div className="bg-white rounded-t-none sm:rounded-t-3xl">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate flex items-center gap-2">
                {template.name}
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Editing</span>
              </h2>
              {template.description && (
                <p className="text-xs text-gray-600 truncate mt-0.5">{template.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onDownloadPDF}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              aria-label="Close editor"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
            </button>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-3 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span>{template.placeholders?.length || 0} variables</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 ml-auto">
            <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+S</kbd>
            <span>to save</span>
          </div>
        </div>
      </div>
    </div>
  );
}
