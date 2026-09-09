// Chiamate REST verso le API di amministrazione del backend Spring Boot
// (/api/admin/**, JSON, autenticate con la sessione di Spring Security e
// riservate al ruolo ADMIN).

import { request } from "./api";
import type {
  DirectorDTO,
  FestivalDTO,
  HallDTO,
  MovieDTO,
  ScreeningDTO,
  UserAccountDTO,
} from "./types";

export interface MovieForm {
  id?: number | null;
  title: string;
  year: number | null;
  duration: number | null;
  genre: string;
  contryProduction: string;
  directorId: number | null;
}

export interface FestivalForm {
  id?: number | null;
  name: string;
  year: number | null;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ScreeningForm {
  id?: number | null;
  festivalId: number | null;
  movieId: number | null;
  hallId: number | null;
  date: string;
  time: string;
}

export interface DirectorForm {
  id?: number | null;
  name: string;
  surname: string;
  birthDate: string | null;
  nationality: string;
}

export interface HallForm {
  id?: number | null;
  name: string;
  address: string;
  capacity: number | null;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function crud<TDto, TForm extends { id?: number | null }>(resource: string) {
  return {
    list: () => request<TDto[]>(`/api/admin/${resource}`),
    create: (form: TForm) => request<TDto>(`/api/admin/${resource}`, json("POST", form)),
    update: (id: number, form: TForm) =>
      request<TDto>(`/api/admin/${resource}/${id}`, json("PUT", form)),
    remove: (id: number) => request<void>(`/api/admin/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const adminMovies = crud<MovieDTO, MovieForm>("movies");
export const adminFestivals = crud<FestivalDTO, FestivalForm>("festivals");
export const adminScreenings = crud<ScreeningDTO, ScreeningForm>("screenings");
export const adminDirectors = crud<DirectorDTO, DirectorForm>("directors");
export const adminHalls = crud<HallDTO, HallForm>("halls");

export interface UserForm {
  id?: number | null;
  username: string;
  /** vuota in modifica = password invariata */
  password: string;
  name: string;
  surname: string;
  email: string;
  role: "ADMIN" | "USER";
}

export const adminUsers = crud<UserAccountDTO, UserForm>("users");

/**
 * Upload della locandina: corpo multipart/form-data, non JSON come le altre
 * chiamate di questo file. Niente Content-Type impostato a mano - fetch lo
 * genera da solo con il "boundary" corretto quando il body e' un FormData.
 */
export function uploadMoviePoster(movieId: number, file: File): Promise<MovieDTO> {
  const formData = new FormData();
  formData.append("file", file);
  return request<MovieDTO>(`/api/admin/movies/${movieId}/poster`, {
    method: "POST",
    body: formData,
  });
}

/** Associa/rimuove un film a un festival (relazione molti-a-molti). */
export function addMovieToFestival(festivalId: number, movieId: number): Promise<void> {
  return request<void>(`/api/admin/festivals/${festivalId}/movies/${movieId}`, { method: "POST" });
}
export function removeMovieFromFestival(festivalId: number, movieId: number): Promise<void> {
  return request<void>(`/api/admin/festivals/${festivalId}/movies/${movieId}`, { method: "DELETE" });
}
