export const aiService = {
  extractPlaceholders: async (content: string): Promise<{ key: string; value: string }[]> => {
    const response = await fetch('/api/ai/extract-placeholders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract placeholders');
    }

    const data = await response.json();
    return data.placeholders;
  },
};
