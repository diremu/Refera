const store = new Map();
const MAX_ENTRIES = 500;
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function makeKey(source, form) {
  return JSON.stringify([
    source,
    form.searchStr.trim().toLowerCase().replace(/\s+/g, " "),
    form.era ?? "All",
    form.prOnly === true || form.prOnly === "true",
    form.page ?? 1,
  ]);
}

export function cached(key, fn, ttl = DEFAULT_TTL) {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) {
    console.log("cache hit:", key);
    store.delete(key);       // re-insert so the most recently used entry is last
    store.set(key, hit);
    return hit.promise;
  }

  const promise = fn().catch((err) => {
    if (store.get(key)?.promise === promise) store.delete(key); // never cache failures
    throw err;
  });

  store.set(key, { promise, expires: Date.now() + ttl });
  if (store.size > MAX_ENTRIES) store.delete(store.keys().next().value); // evict oldest
  return promise;
}