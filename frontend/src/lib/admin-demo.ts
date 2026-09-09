// Store in memoria usato dalla pagina admin quando il backend Spring Boot
// non è raggiungibile (modalità demo dell'anteprima).

import { demoFestivals, demoMovies, demoScreenings } from "./demo-data";
import type {
  DirectorDTO,
  FestivalDTO,
  HallDTO,
  MovieDTO,
  ScreeningDTO,
  UserAccountDTO,
} from "./types";
import type {
  DirectorForm,
  FestivalForm,
  HallForm,
  MovieForm,
  ScreeningForm,
  UserForm,
} from "./admin-api";

let seq = 1000;
const nextId = () => ++seq;

export const demoDirectors: DirectorDTO[] = demoMovies
  .map((m) => m.director)
  .filter((d): d is DirectorDTO => d !== null);

export const demoHalls: HallDTO[] = Object.values(demoScreenings)
  .flat()
  .reduce<HallDTO[]>((acc, s) => (acc.some((h) => h.id === s.hall.id) ? acc : [...acc, s.hall]), []);

const allScreenings = (): ScreeningDTO[] => Object.values(demoScreenings).flat();

export const demoUsers: UserAccountDTO[] = [
  {
    id: 1,
    username: "admin",
    name: "Admin",
    surname: "Demo",
    email: "admin@cinefest.it",
    role: "ADMIN",
  },
  {
    id: 2,
    username: "collaboratore",
    name: "Giulia",
    surname: "Rossi",
    email: "giulia@cinefest.it",
    role: "USER",
  },
];

export const demoAdmin = {
  listMovies: () => [...demoMovies],
  listFestivals: () => [...demoFestivals],
  listScreenings: () => allScreenings(),
  listDirectors: () => [...demoDirectors],
  listHalls: () => [...demoHalls],
  listUsers: () => [...demoUsers],

  saveUser(form: UserForm): void {
    const value: UserAccountDTO = {
      id: form.id ?? nextId(),
      username: form.username,
      name: form.name,
      surname: form.surname,
      email: form.email || null,
      role: form.role,
    };
    const i = demoUsers.findIndex((u) => u.id === value.id);
    if (i >= 0) demoUsers[i] = value;
    else demoUsers.push(value);
  },
  deleteUser(id: number): void {
    const i = demoUsers.findIndex((u) => u.id === id);
    if (i >= 0) demoUsers.splice(i, 1);
  },

  saveMovie(form: MovieForm): void {
    const director = demoDirectors.find((d) => d.id === form.directorId) ?? null;
    const existing = demoMovies.find((m) => m.id === form.id);
    const value: MovieDTO = {
      id: form.id ?? nextId(),
      title: form.title,
      year: form.year,
      duration: form.duration,
      genre: form.genre || null,
      contryProduction: form.contryProduction || null,
      director,
      posterFilename: existing?.posterFilename ?? null,
      festivals: existing?.festivals ?? [],
      screenings: existing?.screenings ?? [],
    };
    const i = demoMovies.findIndex((m) => m.id === value.id);
    if (i >= 0) demoMovies[i] = value;
    else demoMovies.push(value);
  },
  deleteMovie(id: number): void {
    const i = demoMovies.findIndex((m) => m.id === id);
    if (i >= 0) demoMovies.splice(i, 1);
    for (const key of Object.keys(demoScreenings)) {
      const k = Number(key);
      demoScreenings[k] = (demoScreenings[k] ?? []).filter((s) => s.movie.id !== id);
    }
  },

  saveFestival(form: FestivalForm): void {
    const value: FestivalDTO = {
      id: form.id ?? nextId(),
      name: form.name,
      year: form.year,
      city: form.city || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      description: form.description || null,
    };
    const i = demoFestivals.findIndex((f) => f.id === value.id);
    if (i >= 0) demoFestivals[i] = value;
    else {
      demoFestivals.push(value);
      demoScreenings[value.id] = [];
    }
  },
  deleteFestival(id: number): void {
    const i = demoFestivals.findIndex((f) => f.id === id);
    if (i >= 0) demoFestivals.splice(i, 1);
    delete demoScreenings[id];
  },

  saveScreening(form: ScreeningForm): void {
    const movie = demoMovies.find((m) => m.id === form.movieId);
    const hall = demoHalls.find((h) => h.id === form.hallId);
    const festivalId = form.festivalId ?? 0;
    if (!movie || !hall || !festivalId) throw new Error("Film, sala e festival sono obbligatori");
    const value: ScreeningDTO = {
      id: form.id ?? nextId(),
      date: form.date,
      time: form.time,
      status: "SCHEDULED",
      festivalId,
      movie,
      hall,
    };
    if (form.id) demoAdmin.deleteScreening(form.id);
    (demoScreenings[festivalId] ??= []).push(value);
    demoScreenings[festivalId]!.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  },
  deleteScreening(id: number): void {
    for (const key of Object.keys(demoScreenings)) {
      const k = Number(key);
      demoScreenings[k] = (demoScreenings[k] ?? []).filter((s) => s.id !== id);
    }
  },

  saveDirector(form: DirectorForm): void {
    const value: DirectorDTO = {
      id: form.id ?? nextId(),
      name: form.name,
      surname: form.surname,
      birthDate: form.birthDate || null,
      nationality: form.nationality || null,
    };
    const i = demoDirectors.findIndex((d) => d.id === value.id);
    if (i >= 0) demoDirectors[i] = value;
    else demoDirectors.push(value);
    for (const m of demoMovies) if (m.director?.id === value.id) m.director = value;
  },
  deleteDirector(id: number): void {
    const i = demoDirectors.findIndex((d) => d.id === id);
    if (i >= 0) demoDirectors.splice(i, 1);
  },

  saveHall(form: HallForm): void {
    const value: HallDTO = {
      id: form.id ?? nextId(),
      name: form.name,
      address: form.address || null,
      capacity: form.capacity,
    };
    const i = demoHalls.findIndex((h) => h.id === value.id);
    if (i >= 0) demoHalls[i] = value;
    else demoHalls.push(value);
  },
  deleteHall(id: number): void {
    const i = demoHalls.findIndex((h) => h.id === id);
    if (i >= 0) demoHalls.splice(i, 1);
  },
};
