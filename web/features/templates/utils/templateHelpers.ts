export function parsePlaceholders(placeholders: any): { key: string; value: string }[] {
  if (typeof placeholders === 'string') {
    try {
      const parsed = JSON.parse(placeholders);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  if (Array.isArray(placeholders)) {
    return placeholders.filter(p => p && p.key && p.value);
  }
  return [];
}

export function replacePlaceholders(content: string, placeholders: { key: string; value: string }[]): string {
  let result = content;
  if (Array.isArray(placeholders) && placeholders.length > 0) {
    placeholders.forEach((p) => {
      if (p && p.key && p.value) {
        result = result.replace(new RegExp(`{{${p.key}}}`, 'g'), p.value);
      }
    });
  }
  return result;
}
