"use client";

import { useCallback, useEffect, useState } from "react";

const PREFIX = "yaqiin:memorization:";

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

function readIds(slug: string): Set<string> {
  try {
    const saved = JSON.parse(readStorage(slug) ?? "[]");
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
      if (e.key === PREFIX + slug) setMemorized(readIds(slug));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [slug]);

  const update = useCallback((next: Set<string>) => {
    setMemorized(next);
    writeStorage(slug, JSON.stringify([...next]));
  }, [slug]);

  const toggle = useCallback((id: string) => {
    setMemorized(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeStorage(slug, JSON.stringify([...next]));
      return next;
    });
  }, [slug]);

  const clear = useCallback(() => update(new Set()), [update]);

  return { memorized, loaded, toggle, clear };
}
