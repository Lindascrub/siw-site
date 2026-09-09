// Accesso ai dati con fallback dimostrativo: se il backend Spring Boot non
// risponde (errore di rete), vengono usati i dati demo così l'interfaccia
// resta navigabile in anteprima.

import * as api from "./api";
import {
  demoAddReview,
  demoDeleteReview,
  demoFestivals,
  demoMovies,
  demoReviews,
  demoScreenings,
  demoUpdateReview,
} from "./demo-data";
import type { FestivalDTO, MovieDTO, PageResponse, ReviewDTO, ScreeningDTO } from "./types";

async function withFallback<T>(call: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await call();
  } catch (e) {
    // Backend assente o risposta non JSON (es. la preview serve index.html):
    // in ogni caso di fallimento usiamo i dati demo.
    return fallback();
  }
}

export const fetchFestivals = () => withFallback(api.getFestivals, () => demoFestivals);

export const fetchFestival = (id: number) =>
  withFallback(
    () => api.getFestival(id),
    () => {
      const f = demoFestivals.find((x) => x.id === id);
      if (!f) throw new api.ApiError(404, "Festival non trovato");
      return f;
    },
  );

export const fetchFestivalMovies = (id: number) =>
  withFallback(
    () => api.getFestivalMovies(id),
    () => demoMovies.filter((m) => (demoScreenings[id] ?? []).some((s) => s.movie.id === m.id)),
  );

export const fetchFestivalScreenings = (id: number) =>
  withFallback<ScreeningDTO[]>(
    () => api.getFestivalScreenings(id),
    () => demoScreenings[id] ?? [],
  );

export const fetchMovies = (q: api.MovieQuery = {}) =>
  withFallback<PageResponse<MovieDTO>>(
    () => api.getMovies(q),
    () => {
      const page = q.page ?? 0;
      const size = q.size ?? 20;
      const text = (q.search ?? "").toLowerCase();
      let filtered = demoMovies.filter((m) => {
        if (q.genre && m.genre !== q.genre) return false;
        if (!text) return true;
        return (
          m.title.toLowerCase().includes(text) ||
          (m.genre ?? "").toLowerCase().includes(text) ||
          (m.director ? `${m.director.name} ${m.director.surname}`.toLowerCase().includes(text) : false)
        );
      });
      const sortBy = q.sortBy ?? "title";
      const dir = q.sortDir === "desc" ? -1 : 1;
      filtered = [...filtered].sort((a, b) => {
        const av = a[sortBy] ?? "";
        const bv = b[sortBy] ?? "";
        return av < bv ? -dir : av > bv ? dir : 0;
      });
      const content = filtered.slice(page * size, page * size + size);
      return {
        content,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        number: page,
        size,
      };
    },
  );

export const fetchMovieGenres = () => withFallback<string[]>(api.getMovieGenres, () => Array.from(new Set(demoMovies.map((m) => m.genre).filter((g): g is string => !!g))).sort());

/** Film con la media voti piu' alta, per la sezione in evidenza della home. */
export const fetchTopRatedMovies = (limit = 6) =>
  withFallback<MovieDTO[]>(
    () => api.getTopRatedMovies(limit),
    () =>
      [...demoMovies]
        .sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1))
        .slice(0, limit),
  );

export const fetchMovie = (id: number) =>
  withFallback(
    () => api.getMovie(id),
    () => {
      const m = demoMovies.find((x) => x.id === id);
      if (!m) throw new api.ApiError(404, "Film non trovato");
      return m;
    },
  );

export const fetchMovieReviews = (id: number) =>
  withFallback<ReviewDTO[]>(
    () => api.getMovieReviews(id),
    () => demoReviews[id] ?? [],
  );

// Le scritture in modalità demo aggiornano lo store in memoria.

export function submitReview(
  demo: boolean,
  movieId: number,
  text: string,
  vote: number,
  user: { id: number; username: string },
): Promise<ReviewDTO> {
  if (demo) return Promise.resolve(demoAddReview(movieId, text, vote, user.id, user.username));
  return api.createReview(movieId, text, vote);
}

export function editReview(demo: boolean, id: number, text: string, vote: number): Promise<void> {
  if (demo) {
    demoUpdateReview(id, text, vote);
    return Promise.resolve();
  }
  return api.updateReview(id, text, vote).then(() => undefined);
}

export function removeReview(demo: boolean, id: number): Promise<void> {
  if (demo) {
    demoDeleteReview(id);
    return Promise.resolve();
  }
  return api.deleteReview(id);
}
