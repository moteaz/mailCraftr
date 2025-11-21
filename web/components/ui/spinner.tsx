export function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
      </div>
    </div>
  );
}
