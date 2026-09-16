/* ------------------------------------------------------------------ *
 * window.storage shim
 *
 * Inside the Claude artifact runtime, `window.storage` is provided by the
 * host. Outside it (a normal web deployment) it does not exist, so Save and
 * the Library would fail. This provides the same async API backed by
 * IndexedDB.
 *
 * IndexedDB rather than localStorage on purpose: saved assets embed the
 * uploaded images as data URLs and run to several MB each. localStorage caps
 * out around 5MB for the whole origin, which a handful of assets would blow
 * straight through. IndexedDB quota is typically hundreds of MB.
 *
 * API (matches the host):
 *   await window.storage.get(key)     -> { key, value } | null   (throws if missing)
 *   await window.storage.set(key, value)
 *   await window.storage.delete(key)
 *   await window.storage.list(prefix) -> { keys, prefix }
 * ------------------------------------------------------------------ */

const DB_NAME = "kto-saul";
const STORE = "kv";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        let result;
        try {
          result = fn(store);
        } catch (e) {
          reject(e);
          return;
        }
        t.oncomplete = () => resolve(result && result.result !== undefined ? result.result : result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      })
  );
}

const shim = {
  async get(key) {
    const value = await tx("readonly", (store) => store.get(key));
    // the host throws for a missing key; match that so callers behave the same
    if (value === undefined) throw new Error(`No value for key: ${key}`);
    return { key, value, shared: false };
  },

  async set(key, value) {
    await tx("readwrite", (store) => store.put(value, key));
    return { key, value, shared: false };
  },

  async delete(key) {
    await tx("readwrite", (store) => store.delete(key));
    return { key, deleted: true, shared: false };
  },

  async list(prefix = "") {
    const keys = await tx("readonly", (store) => store.getAllKeys());
    return { keys: (keys || []).filter((k) => String(k).startsWith(prefix)), prefix, shared: false };
  },
};

export function installStorage() {
  if (typeof window === "undefined") return;
  if (window.storage && typeof window.storage.get === "function") return; // host provides it
  if (!("indexedDB" in window)) {
    console.warn("[KTO Saul] IndexedDB unavailable — saving is disabled in this browser.");
    return;
  }
  window.storage = shim;
}
