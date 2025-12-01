import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { toast } from 'sonner';
import type { Template, Category, ApiError } from '@/types';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, categoriesRes] = await Promise.all([
        apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATE.MY_TEMPLATES),
        apiClient.get<Category[]>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),
      ]);
      const parsedTemplates = templatesRes.map(t => ({
        ...t,
        placeholders: typeof t.placeholders === 'string' 
          ? JSON.parse(t.placeholders) 
          : Array.isArray(t.placeholders) ? t.placeholders : []
      }));
      setTemplates(parsedTemplates);
      setCategories(categoriesRes);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (payload: any) => {
    const response: any = await apiClient.post(API_ENDPOINTS.TEMPLATE.CREATE, payload);
    return response.template;
  };

  const updateTemplate = async (id: number, content: string) => {
    return await apiClient.patch(API_ENDPOINTS.TEMPLATE.UPDATE(id), { content });
  };

  const deleteTemplate = async (id: number) => {
    await apiClient.delete(API_ENDPOINTS.TEMPLATE.DELETE(id));
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return {
    templates,
    setTemplates,
    categories,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
