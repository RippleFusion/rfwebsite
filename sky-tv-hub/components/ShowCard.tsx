"use client";
/* eslint-disable @next/next/no-img-element */

import { IMG } from "@/lib/tmdb";
import type { ShowSummary } from "@/lib/types";
import { useApp } from "./AppProviders";
import { ProviderLogo } from "./ProviderLogo";

export function formatDate(d: string | null) {
  if (!d) return "Date TBC";
  return new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ShowCard({ show }: { show: ShowSummary }) {
  const { openShow } = useApp();
  return (
    <button
      type="button"
      onClick={() => openShow(show)}
      className="group relative shrink-0 w-64 sm:w-72 lg:w-80 aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
    >
      {show.backdrop_path ? (
        <img
          src={`${IMG}/w780${show.backdrop_path}`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-slate-900 flex items-center justify-center p-4">
          <span className="text-center text-lg font-semibold text-white/70">{show.name}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      {show.provider && (
        <div className="absolute right-2 top-2">
          <ProviderLogo provider={show.provider} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="truncate font-semibold">{show.name}</p>
        <p className="text-xs text-white/70">{formatDate(show.first_air_date)}</p>
      </div>
    </button>
  );
}
