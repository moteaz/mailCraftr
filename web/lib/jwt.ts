export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Math.floor(Date.now() / 1000) >= payload.exp;
  } catch {
    return true;
  }
}
