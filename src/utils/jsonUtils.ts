export function deepMerge<T>(target: T, source: unknown): T {
    if (source == null || typeof source !== 'object') {
      return target;
    }
    const src = source as Record<string, unknown>;
    const out: any = Array.isArray(target) ? [...(target as any)] : { ...(target as any) };
    for (const key of Object.keys(src)) {
      const value = (src as any)[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        out[key] = deepMerge(out[key] ?? {}, value);
      } else {
        out[key] = value;
      }
    }
    return out as T;
  }