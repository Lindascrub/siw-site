// Livello dati della pagina admin: usa le API REST del backend.

import {
  addMovieToFestival,
  adminDirectors,
  adminFestivals,
  adminHalls,
  adminMovies,
  adminScreenings,
  adminUsers,
  removeMovieFromFestival,
  uploadMoviePoster,
  type DirectorForm,
  type FestivalForm,
  type HallForm,
  type MovieForm,
  type ScreeningForm,
  type UserForm,
} from "./admin-api";
import type {
  DirectorDTO,
  FestivalDTO,
  HallDTO,
  MovieDTO,
  ScreeningDTO,
  UserAccountDTO,
} from "./types";

export interface AdminData {
  movies: MovieDTO[];
  festivals: FestivalDTO[];
  screenings: ScreeningDTO[];
  directors: DirectorDTO[];
  halls: HallDTO[];
  users: UserAccountDTO[];
}

export async function loadAdminData(): Promise<AdminData> {
  const [movies, festivals, screenings, directors, halls, users] = await Promise.all([
    adminMovies.list(),
    adminFestivals.list(),
    adminScreenings.list(),
    adminDirectors.list(),
    adminHalls.list(),
    adminUsers.list(),
  ]);
  return { movies, festivals, screenings, directors, halls, users };
}

export async function saveMovie(form: MovieForm): Promise<void> {
  if (form.id) await adminMovies.update(form.id, form);
  else await adminMovies.create(form);
}
export async function deleteMovie(id: number): Promise<void> {
  await adminMovies.remove(id);
}

export async function saveFestival(form: FestivalForm): Promise<void> {
  if (form.id) await adminFestivals.update(form.id, form);
  else await adminFestivals.create(form);
}
export async function deleteFestival(id: number): Promise<void> {
  await adminFestivals.remove(id);
}

export async function saveScreening(form: ScreeningForm): Promise<void> {
  if (form.id) await adminScreenings.update(form.id, form);
  else await adminScreenings.create(form);
}
export async function deleteScreening(id: number): Promise<void> {
  await adminScreenings.remove(id);
}

export async function saveDirector(form: DirectorForm): Promise<void> {
  if (form.id) await adminDirectors.update(form.id, form);
  else await adminDirectors.create(form);
}
export async function deleteDirector(id: number): Promise<void> {
  await adminDirectors.remove(id);
}

export async function saveHall(form: HallForm): Promise<void> {
  if (form.id) await adminHalls.update(form.id, form);
  else await adminHalls.create(form);
}
export async function deleteHall(id: number): Promise<void> {
  await adminHalls.remove(id);
}

export async function saveUser(form: UserForm): Promise<void> {
  if (form.id) await adminUsers.update(form.id, form);
  else await adminUsers.create(form);
}
export async function deleteUser(id: number): Promise<void> {
  await adminUsers.remove(id);
}

export async function setFestivalMovie(
  festivalId: number,
  movieId: number,
  associated: boolean,
): Promise<void> {
  if (associated) await addMovieToFestival(festivalId, movieId);
  else await removeMovieFromFestival(festivalId, movieId);
}

export async function uploadPoster(movieId: number, file: File): Promise<void> {
  await uploadMoviePoster(movieId, file);
}
