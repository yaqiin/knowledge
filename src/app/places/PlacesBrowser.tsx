"use client";

import { useMemo, useState } from "react";
import { EmptyState, SearchInput, matches } from "@/components/Filters";
import { PlaceCard } from "@/components/PlaceCard";
import type { Place } from "@/lib/data";

export function PlacesBrowser({ places }: { places: Place[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => places.filter(place => matches(query, place.name, place.location, place.description)),
    [places, query],
  );

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="ابحث باسم المكان أو البلد..." />
      {results.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(place => <PlaceCard key={place.slug} place={place} />)}
        </div>
      ) : (
        <div className="mt-8"><EmptyState onReset={() => setQuery("")} /></div>
      )}
    </>
  );
}
