export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const getInitials = (email: string): string => {
  return email[0]?.toUpperCase() || '?';
};

export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};
