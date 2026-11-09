"use client";
/* eslint-disable @next/next/no-img-element */

import { Info } from "lucide-react";
import { IMG } from "@/lib/tmdb";
import type { ShowSummary } from "@/lib/types";
import { useApp } from "./AppProviders";
import { formatDate } from "./ShowCard";
import { ProviderLogo } from "./ProviderLogo";
import { WatchlistButton } from "./WatchlistButton";

export function Hero({ show }: { show: ShowSummary }) {
  const { openShow } = useApp();
  return (
    <section className="relative w-full aspect-[16/9] max-h-[70vh] min-h-[360px] overflow-hidden">
      {show.backdrop_path ? (
        <img
          src={`${IMG}/w1280${show.backdrop_path}`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/90 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 max-w-2xl p-6 sm:p-10 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-white/80">
          {show.provider && <ProviderLogo provider={show.provider} size={32} />}
          <span>{formatDate(show.first_air_date)}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold">{show.name}</h1>
        <p className="line-clamp-3 text-white/80">{show.overview || "No synopsis available yet."}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => openShow(show)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium text-black hover:bg-white/90"
          >
            <Info size={18} /> View Details
          </button>
          <WatchlistButton id={show.id} />
        </div>
      </div>
    </section>
  );
}
