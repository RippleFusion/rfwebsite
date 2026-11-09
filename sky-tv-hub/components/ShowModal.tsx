"use client";
/* eslint-disable @next/next/no-img-element */

import { Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IMG } from "@/lib/tmdb";
import type { ShowDetails, ShowSummary } from "@/lib/types";
import { formatDate } from "./ShowCard";
import { ProviderLogo } from "./ProviderLogo";
import { WatchlistButton } from "./WatchlistButton";

export function ShowModal({ show, onClose }: { show: ShowSummary; onClose: () => void }) {
  const [details, setDetails] = useState<ShowDetails | null>(null);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/tv/${show.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad response"))))
      .then((d: ShowDetails) => !cancelled && setDetails(d))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [show.id]);

  // Escape to close, Tab trapped inside, focus restored on close, body scroll locked.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const backdrop = details?.backdrop_path ?? show.backdrop_path;
  const next = details?.next_air_date;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={show.name}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 backdrop-blur-md hover:bg-black/80"
        >
          <X size={20} />
        </button>
        <div className="relative aspect-video bg-gradient-to-br from-indigo-900/70 to-slate-900">
          {details?.trailerKey ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${details.trailerKey}?rel=0`}
              title={`${show.name} trailer`}
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            backdrop && (
              <>
                <img
                  src={`${IMG}/w780${backdrop}`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] to-transparent" />
              </>
            )
          )}
        </div>
        <div className="flex flex-col gap-4 p-6">
          <h2 className="text-2xl font-bold">{show.name}</h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/70">
            <span className="inline-flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {(details?.vote_average ?? show.vote_average).toFixed(1)}
            </span>
            <span>Premiere: {formatDate(details?.first_air_date ?? show.first_air_date)}</span>
            {next && <span>Next episode: {formatDate(next)}</span>}
            {details && details.seasons > 0 && (
              <span>
                {details.seasons} season{details.seasons === 1 ? "" : "s"}
              </span>
            )}
            {details?.genres.length ? <span>{details.genres.join(", ")}</span> : null}
          </div>
          <p className="text-white/85">
            {details?.overview || show.overview || "No synopsis available yet."}
          </p>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/50">
              Available in the UK
            </h3>
            {failed ? (
              <p className="text-sm text-white/50">Couldn&apos;t load details. Try again later.</p>
            ) : !details ? (
              <p className="text-sm text-white/50">Loading…</p>
            ) : details.providers.length === 0 ? (
              <p className="text-sm text-white/50">Not currently on a UK streaming service.</p>
            ) : (
              <ul className="flex flex-wrap gap-3">
                {details.providers.map((p) => (
                  <li key={p.id}>
                    <ProviderLogo provider={p} size={40} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <WatchlistButton id={show.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
