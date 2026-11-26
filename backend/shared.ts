export const PAGE_SIZE = 15;

export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set`);
    return value;
}

export function toParams(
  input: Record<string, string | number | boolean | string[] | null | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else params.set(key, String(value));
  }
  return params;
}


export function safePage(page: unknown): number {
  const n = Math.floor(Number(page));
  return Number.isFinite(n) && n >= 0 ? n : 1;
}