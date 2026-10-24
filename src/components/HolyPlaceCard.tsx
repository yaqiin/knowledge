import { MapPin } from "lucide-react";
import Link from "next/link";
import { excerpt, type HolyPlace } from "@/lib/data";

export function HolyPlaceCard({ place }: { place: HolyPlace }) {
  return (
    <Link
      href={`/holy-places/${place.slug}/`}
      className="group overflow-hidden rounded-3xl border border-emerald-900/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-emerald-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images hosted on GitHub */}
        <img
          src={place.images[0]}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent" />
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-900 backdrop-blur">
          <MapPin className="h-3.5 w-3.5" />
          {place.location}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-emerald-950">{place.name}</h3>
        <p className="mt-2 line-clamp-2 leading-relaxed text-emerald-900/70">{excerpt(place.description)}</p>
      </div>
    </Link>
  );
}
