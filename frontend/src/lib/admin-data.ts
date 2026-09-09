// Livello dati della pagina admin: usa le API REST del backend quando è
// raggiungibile, altrimenti lo store dimostrativo in memoria.

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
import { demoAdmin } from "./admin-demo";
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

/** Carica tutte le collezioni; ricade sui dati demo se il backend non risponde. */
export async function loadAdminData(): Promise<{ data: AdminData; demo: boolean }> {
  try {
    const [movies, festivals, screenings, directors, halls, users] = await Promise.all([
      adminMovies.list(),
      adminFestivals.list(),
      adminScreenings.list(),
      adminDirectors.list(),
      adminHalls.list(),
      adminUsers.list(),
    ]);
    return { data: { movies, festivals, screenings, directors, halls, users }, demo: false };
  } catch {
    return {
      data: {
        movies: demoAdmin.listMovies(),
        festivals: demoAdmin.listFestivals(),
        screenings: demoAdmin.listScreenings(),
        directors: demoAdmin.listDirectors(),
        halls: demoAdmin.listHalls(),
        users: demoAdmin.listUsers(),
      },
      demo: true,
    };
  }
}

export async function saveMovie(demo: boolean, form: MovieForm): Promise<void> {
  if (demo) return demoAdmin.saveMovie(form);
  if (form.id) await adminMovies.update(form.id, form);
  else await adminMovies.create(form);
}
export async function deleteMovie(demo: boolean, id: number): Promise<void> {
  if (demo) return demoAdmin.deleteMovie(id);
  await adminMovies.remove(id);
}

export async function saveFestival(demo: boolean, form: FestivalForm): Promise<void> {
  if (demo) return demoAdmin.saveFestival(form);
  if (form.id) await adminFestivals.update(form.id, form);
  else await adminFestivals.create(form);
}
export async function deleteFestival(demo: boolean, id: number): Promise<void> {
  if (demo) return demoAdmin.deleteFestival(id);
  await adminFestivals.remove(id);
}

export async function saveScreening(demo: boolean, form: ScreeningForm): Promise<void> {
  if (demo) return demoAdmin.saveScreening(form);
  if (form.id) await adminScreenings.update(form.id, form);
  else await adminScreenings.create(form);
}
export async function deleteScreening(demo: boolean, id: number): Promise<void> {
  if (demo) return demoAdmin.deleteScreening(id);
  await adminScreenings.remove(id);
}

export async function saveDirector(demo: boolean, form: DirectorForm): Promise<void> {
  if (demo) return demoAdmin.saveDirector(form);
  if (form.id) await adminDirectors.update(form.id, form);
  else await adminDirectors.create(form);
}
export async function deleteDirector(demo: boolean, id: number): Promise<void> {
  if (demo) return demoAdmin.deleteDirector(id);
  await adminDirectors.remove(id);
}

export async function saveHall(demo: boolean, form: HallForm): Promise<void> {
  if (demo) return demoAdmin.saveHall(form);
  if (form.id) await adminHalls.update(form.id, form);
  else await adminHalls.create(form);
}
export async function deleteHall(demo: boolean, id: number): Promise<void> {
  if (demo) return demoAdmin.deleteHall(id);
  await adminHalls.remove(id);
}

export async function saveUser(demo: boolean, form: UserForm): Promise<void> {
  if (demo) return demoAdmin.saveUser(form);
  if (form.id) await adminUsers.update(form.id, form);
  else await adminUsers.create(form);
}
export async function deleteUser(demo: boolean, id: number): Promise<void> {
  if (demo) return demoAdmin.deleteUser(id);
  await adminUsers.remove(id);
}

export async function setFestivalMovie(
  demo: boolean,
  festivalId: number,
  movieId: number,
  associated: boolean,
): Promise<void> {
  if (demo) {
    throw new Error("L'associazione film-festival non è disponibile in modalità demo.");
  }
  if (associated) await addMovieToFestival(festivalId, movieId);
  else await removeMovieFromFestival(festivalId, movieId);
}

export async function uploadPoster(demo: boolean, movieId: number, file: File): Promise<void> {
  if (demo) {
    throw new Error("Il caricamento della locandina non è disponibile in modalità demo.");
  }
  await uploadMoviePoster(movieId, file);
}
