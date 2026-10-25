"use client";

import { useCallback, useEffect, useState } from "react";

// Keys look like "yaqiin:memorization:quran" or "yaqiin:habits"
const PREFIX = "yaqiin:";

// localStorage can throw (private mode, blocked storage); the pages must still work without it
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // ignore
  }
}

const memorizationKey = (slug: string) => `memorization:${slug}`;

function readIds(slug: string): Set<string> {
  try {
    const saved = JSON.parse(readStorage(memorizationKey(slug)) ?? "[]");
    return new Set(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * Memorized item ids for a collection, saved in the visitor's browser only.
 * Starts empty on the server and first client render (avoids hydration mismatches),
 * then loads the saved value and stays in sync across open tabs.
 */
export function useMemorized(slug: string) {
  const [memorized, setMemorized] = useState<Set<string>>(() => new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMemorized(readIds(slug));
    setLoaded(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFIX + memorizationKey(slug)) setMemorized(readIds(slug));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [slug]);

  const update = useCallback((next: Set<string>) => {
    setMemorized(next);
    writeStorage(memorizationKey(slug), JSON.stringify([...next]));
  }, [slug]);

  const toggle = useCallback((id: string) => {
    setMemorized(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeStorage(memorizationKey(slug), JSON.stringify([...next]));
      return next;
    });
  }, [slug]);

  const clear = useCallback(() => update(new Set()), [update]);

  return { memorized, loaded, toggle, clear };
}
