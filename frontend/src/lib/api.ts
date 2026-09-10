// Client HTTP verso il backend Spring Boot (autenticazione a sessione/cookie).
// Il backend gira di default su http://localhost:8080; si può cambiare con
// la variabile d'ambiente VITE_API_URL.

import type {
  CurrentUserDTO,
  FestivalDTO,
  MovieDTO,
  MyReviewDTO,
  PageResponse,
  RegisterRequest,
  ReviewDTO,
  ScreeningDTO,
} from "./types";

export const API_BASE: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8080";

/**
 * Costruisce l'URL completo di una locandina a partire dal solo nome file
 * salvato nel database (es. "a1b2c3.jpg" -> "http://localhost:8080/uploads/a1b2c3.jpg").
 * Ritorna null se il film non ha ancora una locandina caricata.
 */
export function posterUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `${API_BASE}/uploads/${filename}`;
}

export class ApiError extends Error {
  status: number;
  /** Messaggi di validazione per singolo campo (es. "Il titolo è obbligatorio"), quando presenti. */
  details: string[];
  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Errore di rete: backend non raggiungibile (es. Spring Boot non avviato). */
export function isNetworkError(e: unknown): boolean {
  return e instanceof TypeError;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    let message = res.statusText;
    let details: string[] = [];
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
      if (Array.isArray(body.details) && body.details.length > 0) {
        details = body.details;
        // Cosi' chi si limita a leggere err.message (la maggior parte del
        // codice esistente) vede comunque il dettaglio del campo mancante,
        // es. "Errore di validazione: Il titolo è obbligatorio, ...".
        message = `${message}: ${details.join(", ")}`;
      }
    } catch {
      /* corpo non JSON */
    }
    throw new ApiError(res.status, message, details);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Auth ----

export async function fetchMe(): Promise<CurrentUserDTO | null> {
  try {
    return await request<CurrentUserDTO>("/api/auth/me");
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}

/**
 * Login via form login di Spring Security (POST /auth/login).
 * In caso di credenziali errate Spring reindirizza di nuovo a /auth/login.
 */
export async function loginRequest(username: string, password: string): Promise<void> {
  const body = new URLSearchParams({ username, password });
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const finalUrl = new URL(res.url);
  if (finalUrl.pathname.startsWith("/auth/login")) {
    throw new ApiError(401, "Username o password non validi");
  }
}

export async function logoutRequest(): Promise<void> {
  await fetch(`${API_BASE}/logout`, { method: "POST", credentials: "include" });
}

export function registerRequest(data: RegisterRequest): Promise<void> {
  return request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ---- Catalogo ----

export const getFestivals = () => request<FestivalDTO[]>("/api/festivals");
export const getFestival = (id: number) => request<FestivalDTO>(`/api/festivals/${id}`);
export const getFestivalMovies = (id: number) =>
  request<MovieDTO[]>(`/api/festivals/${id}/movies`);
export const getFestivalScreenings = (id: number) =>
  request<ScreeningDTO[]>(`/api/festivals/${id}/screenings`);

export interface MovieQuery {
  search?: string | undefined;
  genre?: string | undefined;
  page?: number;
  size?: number;
  sortBy?: "title" | "year" | "duration";
  sortDir?: "asc" | "desc";
}

export function getMovies(q: MovieQuery = {}): Promise<PageResponse<MovieDTO>> {
  const params = new URLSearchParams({
    page: String(q.page ?? 0),
    size: String(q.size ?? 20),
    sortBy: q.sortBy ?? "title",
    sortDir: q.sortDir ?? "asc",
  });
  if (q.search) params.set("search", q.search);
  if (q.genre) params.set("genre", q.genre);
  return request<PageResponse<MovieDTO>>(`/api/movies?${params.toString()}`);
}

export const getMovieGenres = () => request<string[]>("/api/movies/genres");
export const getTopRatedMovies = (limit = 6) =>
  request<MovieDTO[]>(`/api/movies/top-rated?limit=${limit}`);
export const getMovie = (id: number) => request<MovieDTO>(`/api/movies/${id}`);
export const getMovieReviews = (id: number) => request<ReviewDTO[]>(`/api/movies/${id}/reviews`);
export const getMyReviews = () => request<MyReviewDTO[]>("/api/reviews/mine");

export const createReview = (movieId: number, text: string, vote: number) =>
  request<ReviewDTO>(`/api/movies/${movieId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, vote }),
  });

export const updateReview = (id: number, text: string, vote: number) =>
  request<ReviewDTO>(`/api/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, vote }),
  });

export const deleteReview = (id: number) =>
  request<void>(`/api/reviews/${id}`, { method: "DELETE" });
