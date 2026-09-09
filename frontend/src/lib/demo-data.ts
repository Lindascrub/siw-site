// Dati dimostrativi usati quando il backend Spring Boot non è raggiungibile
// (es. anteprima del solo frontend). Quando l'API risponde, vengono ignorati.

import type { FestivalDTO, MovieDTO, ReviewDTO, ScreeningDTO } from "./types";

import posterNoir from "../assets/poster-noir.jpg";
import posterDrama from "../assets/poster-drama.jpg";
import posterComedy from "../assets/poster-comedy.jpg";
import posterDoc from "../assets/poster-doc.jpg";

/** Locandine dimostrative per id film (solo modalità demo). */
export const demoPosters: Record<number, string> = {
  1: posterNoir,
  2: posterDrama,
  3: posterComedy,
  4: posterDoc,
};

export const demoFestivals: FestivalDTO[] = [
  {
    id: 1,
    name: "Festival del Cinema di Roma",
    year: 2026,
    city: "Roma",
    startDate: "2026-10-14",
    endDate: "2026-10-25",
    description:
      "Dodici giorni di anteprime, retrospettive e incontri con i maestri del cinema contemporaneo nel cuore della capitale.",
  },
  {
    id: 2,
    name: "Torino Film Festival",
    year: 2026,
    city: "Torino",
    startDate: "2026-11-20",
    endDate: "2026-11-28",
    description:
      "Il festival del cinema indipendente: nuove voci, opere prime e seconde, e uno sguardo attento al cinema di ricerca.",
  },
  {
    id: 3,
    name: "Laceno d'Oro",
    year: 2026,
    city: "Avellino",
    startDate: "2026-12-06",
    endDate: "2026-12-13",
    description:
      "Il più antico festival cinematografico italiano dopo Venezia, dedicato al cinema del reale e alle giovani promesse.",
  },
];

export const demoMovies: MovieDTO[] = [
  {
    id: 1,
    title: "Neon Notturno",
    year: 2026,
    duration: 118,
    genre: "Noir",
    contryProduction: "Italia",
    director: { id: 1, name: "Livia", surname: "Ferrante", birthDate: "1984-03-12", nationality: "Italiana" },
    posterFilename: null,
    festivals: [],
    screenings: [],
    avgRating: null,
    reviewCount: 0,
  },
  {
    id: 2,
    title: "Marea di Sale",
    year: 2025,
    duration: 112,
    genre: "Drammatico",
    contryProduction: "Italia, Francia",
    director: { id: 2, name: "Elena", surname: "Vair", birthDate: "1979-07-01", nationality: "Italiana" },
    posterFilename: null,
    festivals: [],
    screenings: [],
    avgRating: null,
    reviewCount: 0,
  },
  {
    id: 3,
    title: "L'Ultimo Espresso",
    year: 2026,
    duration: 96,
    genre: "Commedia",
    contryProduction: "Italia",
    director: { id: 3, name: "Marco", surname: "Selva", birthDate: "1990-11-23", nationality: "Italiana" },
    posterFilename: null,
    festivals: [],
    screenings: [],
    avgRating: null,
    reviewCount: 0,
  },
  {
    id: 4,
    title: "La Pellicola Perduta",
    year: 2025,
    duration: 104,
    genre: "Documentario",
    contryProduction: "Italia",
    director: { id: 4, name: "Paolo", surname: "Ricci", birthDate: "1972-05-30", nationality: "Italiano" },
    posterFilename: null,
    festivals: [],
    screenings: [],
    avgRating: null,
    reviewCount: 0,
  },
];

export const demoScreenings: Record<number, ScreeningDTO[]> = {
  1: [
    {
      id: 1,
      date: "2026-10-15",
      time: "18:30",
      status: "SCHEDULED",
      festivalId: 1,
      movie: demoMovies[0]!,
      hall: { id: 1, name: "Sala Santa Maura", address: "Piazza Santa Maria in Trastevere 4, Roma", capacity: 320 },
    },
    {
      id: 2,
      date: "2026-10-16",
      time: "21:00",
      status: "SCHEDULED",
      festivalId: 1,
      movie: demoMovies[1]!,
      hall: { id: 2, name: "Sala Petrassi", address: "Via di Valle Giulia 12, Roma", capacity: 480 },
    },
    {
      id: 3,
      date: "2026-10-18",
      time: "17:00",
      status: "SCHEDULED",
      festivalId: 1,
      movie: demoMovies[3]!,
      hall: { id: 1, name: "Sala Santa Maura", address: "Piazza Santa Maria in Trastevere 4, Roma", capacity: 320 },
    },
  ],
  2: [
    {
      id: 4,
      date: "2026-11-21",
      time: "20:30",
      status: "SCHEDULED",
      festivalId: 2,
      movie: demoMovies[2]!,
      hall: { id: 3, name: "Cinema Massimo 1", address: "Via Verdi 18, Torino", capacity: 500 },
    },
    {
      id: 5,
      date: "2026-11-23",
      time: "18:00",
      status: "SCHEDULED",
      festivalId: 2,
      movie: demoMovies[0]!,
      hall: { id: 4, name: "Cinema Romano", address: "Piazza San Carlo 5, Torino", capacity: 260 },
    },
  ],
  3: [],
};

export const demoReviews: Record<number, ReviewDTO[]> = {
  1: [
    {
      id: 1,
      text: "La fotografia notturna è una lezione di luce: ogni neon racconta la città. Finale teso fino all'ultimo fotogramma.",
      vote: 5,
      date: "2026-08-21",
      movieId: 1,
      userId: 1,
      username: "giulia.m",
    },
    {
      id: 2,
      text: "Atmosfera incredibile, anche se il secondo atto rallenta un po'. Da vedere in sala, possibilmente tardi.",
      vote: 4,
      date: "2026-08-23",
      movieId: 1,
      userId: 2,
      username: "tommy85",
    },
  ],
  2: [
    {
      id: 3,
      text: "Un dramma trattenuto e luminoso. Elena Vair dirige il silenzio come pochi.",
      vote: 5,
      date: "2026-09-02",
      movieId: 2,
      userId: 3,
      username: "cinefilo_anonimo",
    },
  ],
  3: [
    {
      id: 4,
      text: "Novantasei minuti di risate sincere. Il bar è quasi un terzo protagonista.",
      vote: 4,
      date: "2026-07-30",
      movieId: 3,
      userId: 1,
      username: "giulia.m",
    },
  ],
  4: [],
};

// ---- Store demo in memoria (per le recensioni create in modalità demo) ----

let nextReviewId = 100;

export function demoAddReview(movieId: number, text: string, vote: number, userId: number, username: string): ReviewDTO {
  const review: ReviewDTO = {
    id: nextReviewId++,
    text,
    vote,
    date: new Date().toISOString().slice(0, 10),
    movieId,
    userId,
    username,
  };
  (demoReviews[movieId] ??= []).unshift(review);
  return review;
}

export function demoUpdateReview(id: number, text: string, vote: number): void {
  for (const list of Object.values(demoReviews)) {
    const r = list.find((x) => x.id === id);
    if (r) {
      r.text = text;
      r.vote = vote;
      return;
    }
  }
}

export function demoDeleteReview(id: number): void {
  for (const key of Object.keys(demoReviews)) {
    const list = demoReviews[Number(key)];
    if (list) demoReviews[Number(key)] = list.filter((x) => x.id !== id);
  }
}
