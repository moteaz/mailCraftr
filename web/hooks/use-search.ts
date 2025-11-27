import { useState, useMemo } from 'react';

export function useSearch<T>(items: T[], searchKey: keyof T) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query, searchKey]);

  return { query, setQuery, filtered };
}
