import { ChevronRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { PlaceCard } from "@/components/PlaceCard";
import { excerpt, getPlace, places } from "@/lib/data";
import { ImageGallery } from "./ImageGallery";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return places.map(place => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const place = getPlace((await params).slug);
  if (!place) return {};
  const description = excerpt(place.description);
  return {
    title: place.name,
    description,
    openGraph: { title: place.name, description, images: [place.images[0]] },
  };
}

export default async function PlacePage({ params }: { params: Params }) {
  const place = getPlace((await params).slug);
  if (!place) notFound();

  const others = places.filter(p => p.slug !== place.slug).slice(0, 3);

  return (
    <article className="container mx-auto px-4 py-10 sm:px-6">
      <Link href="/places/" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">
        <ChevronRight className="h-4 w-4" />
        كل المعالم
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black leading-tight text-emerald-950 sm:text-5xl">{place.name}</h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-emerald-900/60">
            <MapPin className="h-4 w-4" />
            {place.location}
          </p>
        </div>
        {place.mapsLink && (
          <a
            href={place.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
          >
            <MapPin className="h-4 w-4" />
            عرض على الخريطة
          </a>
        )}
      </header>

      <div className="mt-8">
        <ImageGallery images={place.images} alt={place.name} />
      </div>

      <div className="prose prose-lg mx-auto mt-12 max-w-3xl prose-headings:font-display prose-headings:text-emerald-950 prose-p:leading-loose prose-p:text-emerald-900/80 prose-li:text-emerald-900/80">
        <ReactMarkdown>{place.description}</ReactMarkdown>
      </div>

      {others.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-emerald-950">معالم أخرى</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map(other => <PlaceCard key={other.slug} place={other} />)}
          </div>
        </section>
      )}
    </article>
  );
}
