import { useState, useRef } from 'react';
import { X, Plus, Sparkles, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { aiService } from '@/lib/services/ai.service';
import type { Category } from '@/types';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreate: (form: any) => Promise<void>;
}

export function CreateTemplateModal({ isOpen, onClose, categories, onCreate }: CreateTemplateModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    categorieId: '',
    placeholders: [] as { key: string; value: string }[],
  });
  const [aiContent, setAiContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const placeholdersEndRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const placeholders = Object.entries(json).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setForm({ ...form, placeholders });
        toast.success(`Loaded ${placeholders.length} placeholders from JSON`);
      } catch (err) {
        toast.error('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const handleAiExtract = async () => {
    if (!aiContent.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    setExtracting(true);
    try {
      const placeholders = await aiService.extractPlaceholders(aiContent);
      setForm({ ...form, placeholders });
      toast.success(`Extracted ${placeholders.length} placeholders using AI`);
    } catch (err) {
      toast.error('Failed to extract placeholders');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categorieId) {
      toast.error('Name and category are required');
      return;
    }

    setCreating(true);
    try {
      await onCreate(form);
      setForm({ name: '', description: '', categorieId: '', placeholders: [] });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Template</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Template name"
            disabled={creating}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Template description"
              disabled={creating}
              rows={2}
              className="block w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={form.categorieId}
              onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
              className="block w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base min-h-[44px] appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              disabled={creating}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placeholders</label>
            
            {/* AI Extraction */}
            <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-800">AI Extraction</span>
              </div>
              <textarea
                value={aiContent}
                onChange={(e) => setAiContent(e.target.value)}
                placeholder="Paste your content here and AI will extract placeholders automatically..."
                disabled={creating || extracting}
                rows={4}
                className="block w-full px-3 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-y mb-2"
              />
              <Button
                type="button"
                onClick={handleAiExtract}
                loading={extracting}
                loadingText="Extracting..."
                icon={Sparkles}
                disabled={!aiContent.trim() || creating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Extract with AI
              </Button>
            </div>

            {/* Manual JSON Upload */}
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Or upload JSON file</label>
              <input
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                disabled={creating}
              />
            </div>
            {form.placeholders.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">{form.placeholders.length} Placeholders</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, placeholders: [...form.placeholders, { key: '', value: '' }] });
                      setTimeout(() => placeholdersEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.placeholders.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                      <input
                        type="text"
                        value={p.key}
                        onChange={(e) => {
                          const updated = [...form.placeholders];
                          updated[i].key = e.target.value;
                          setForm({ ...form, placeholders: updated });
                        }}
                        placeholder="key"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                        disabled={creating}
                      />
                      <span className="text-gray-400">=</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => {
                          const updated = [...form.placeholders];
                          updated[i].value = e.target.value;
                          setForm({ ...form, placeholders: updated });
                        }}
                        placeholder="value"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                        disabled={creating}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.placeholders.filter((_, idx) => idx !== i);
                          setForm({ ...form, placeholders: updated });
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        disabled={creating}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div ref={placeholdersEndRef} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, placeholders: [...form.placeholders, { key: '', value: '' }] });
                    setTimeout(() => placeholdersEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
                  }}
                  className="w-full mt-2 py-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium flex items-center justify-center gap-1 border border-dashed border-blue-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Another
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Upload a JSON file with key-value pairs (e.g., {`{"name": "John", "email": "john@example.com"}`})
            </p>
          </div>

          <Button type="submit" loading={creating} loadingText="Creating..." icon={Plus}>
            Create Template
          </Button>
        </form>
      </div>
    </div>
  );
}
