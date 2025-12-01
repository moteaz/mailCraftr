interface VariablesPanelProps {
  placeholders: { key: string; value: string }[];
  onInsert: (key: string) => void;
  isFullscreen: boolean;
}

export function VariablesPanel({ placeholders, onInsert, isFullscreen }: VariablesPanelProps) {
  return (
    <div className={`w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col max-h-[30vh] lg:max-h-none transition-all duration-300 ${isFullscreen ? 'lg:w-64 xl:w-72' : ''}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          🏷️ Variables
          <span className="ml-auto text-xs font-normal text-gray-500">{placeholders?.length || 0}</span>
        </h3>
        <p className="text-xs text-gray-600 mt-1">Click to insert</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {!placeholders || placeholders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-sm text-gray-500">No variables</p>
          </div>
        ) : (
          placeholders.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onInsert(p.key)}
              className="w-full text-left p-3 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200/50 rounded-xl transition-all duration-200 group hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <code className="font-mono text-xs font-bold text-orange-700 break-all">{`{{${p.key}}}`}</code>
                <span className="text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{p.value || 'No preview'}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
