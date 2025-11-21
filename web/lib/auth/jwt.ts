export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp || typeof payload.exp !== 'number') return true;

    return Math.floor(Date.now() / 1000) >= payload.exp;
  } catch {
    return true;
  }
}
