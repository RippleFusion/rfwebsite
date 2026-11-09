/* eslint-disable @next/next/no-img-element */
import { IMG } from "@/lib/tmdb";
import type { ProviderBadge } from "@/lib/types";

export function ProviderLogo({ provider, size = 28 }: { provider: ProviderBadge; size?: number }) {
  if (!provider.logo_path) {
    return (
      <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
        {provider.name}
      </span>
    );
  }
  return (
    <img
      src={`${IMG}/w92${provider.logo_path}`}
      alt={provider.name}
      title={provider.name}
      width={size}
      height={size}
      className="rounded-md shadow ring-1 ring-white/20"
    />
  );
}
