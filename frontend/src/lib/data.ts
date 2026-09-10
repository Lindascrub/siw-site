// Accesso ai dati: chiama sempre il backend Spring Boot via api.ts.

import * as api from "./api";
import type { DirectorDTO, FestivalDTO, MovieDTO, MyReviewDTO, PageResponse, ReviewDTO, ScreeningDTO } from "./types";

export const fetchFestivals = () => api.getFestivals();

export const fetchFestival = (id: number) => api.getFestival(id);

export const fetchFestivalMovies = (id: number) => api.getFestivalMovies(id);

export const fetchFestivalScreenings = (id: number) => api.getFestivalScreenings(id);

export const fetchMovies = (q: api.MovieQuery = {}): Promise<PageResponse<MovieDTO>> => api.getMovies(q);

export const fetchMovieGenres = () => api.getMovieGenres();

export const fetchMovieDirectors = (): Promise<DirectorDTO[]> => api.getMovieDirectors();

/** Film con la media voti piu' alta, per la sezione in evidenza della home. */
export const fetchTopRatedMovies = (limit = 6) => api.getTopRatedMovies(limit);

export const fetchMovie = (id: number) => api.getMovie(id);

export const fetchMovieReviews = (id: number): Promise<ReviewDTO[]> => api.getMovieReviews(id);

/** Le recensioni dell'utente loggato, per la pagina Profilo. */
export const fetchMyReviews = (): Promise<MyReviewDTO[]> => api.getMyReviews();

export function submitReview(
  movieId: number,
  text: string,
  vote: number,
): Promise<ReviewDTO> {
  return api.createReview(movieId, text, vote);
}

export function editReview(id: number, text: string, vote: number): Promise<void> {
  return api.updateReview(id, text, vote).then(() => undefined);
}

export function removeReview(id: number): Promise<void> {
  return api.deleteReview(id);
}
