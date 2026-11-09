export type ProviderBadge = { id: number; name: string; logo_path: string | null };

export type ShowSummary = {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  first_air_date: string | null;
  vote_average: number;
  provider?: ProviderBadge | null;
};

export type ShowDetails = {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  first_air_date: string | null;
  next_air_date: string | null;
  seasons: number;
  vote_average: number;
  genres: string[];
  trailerKey: string | null;
  providers: ProviderBadge[];
};
