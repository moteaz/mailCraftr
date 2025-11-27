interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({ value, onChange, placeholder = '🔍 Search...', resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {resultCount} {totalCount !== resultCount && `of ${totalCount}`}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
      />
    </div>
  );
}
