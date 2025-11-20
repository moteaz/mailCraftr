// app/utils/auth.ts
export function isTokenValid(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp && exp > now;
  } catch {
    return false;
  }
}