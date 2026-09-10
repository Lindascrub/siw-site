// Tipi TypeScript che rispecchiano i DTO del backend Spring Boot.

export interface DirectorDTO {
  id: number;
  name: string;
  surname: string;
  birthDate: string | null;
  nationality: string | null;
}

export interface FestivalDTO {
  id: number;
  name: string;
  year: number | null;
  city: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface HallDTO {
  id: number;
  name: string;
  address: string | null;
  capacity: number | null;
}

export type ScreeningStatus = string;

/** Proiezione vista dal lato film (dentro MovieDTO.screenings): niente `movie` annidato. */
export interface MovieScreeningDTO {
  id: number;
  date: string;
  time: string;
  status: ScreeningStatus;
  festivalId: number;
  festivalName: string;
  hall: HallDTO;
}

export interface MovieDTO {
  id: number;
  title: string;
  year: number | null;
  duration: number | null;
  genre: string | null;
  contryProduction: string | null;
  director: DirectorDTO | null;
  posterFilename: string | null;
  /** Presenti solo nella risposta di dettaglio (GET /api/movies/{id}); vuoti nelle liste. */
  festivals: FestivalDTO[];
  screenings: MovieScreeningDTO[];
  /** null/0 se il film non ha ancora recensioni. */
  avgRating: number | null;
  reviewCount: number;
}

/** Rispecchia org.springframework.data.domain.Page nella serializzazione JSON di Spring. */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // pagina corrente, 0-based
  size: number;
}

export interface ScreeningDTO {
  id: number;
  date: string;
  time: string;
  status: ScreeningStatus;
  festivalId: number;
  movie: MovieDTO;
  hall: HallDTO;
}

export interface ReviewDTO {
  id: number;
  text: string;
  vote: number;
  date: string;
  movieId: number;
  userId: number;
  username: string;
}

/** Recensione dell'utente loggato, con titolo del film gia' incluso (pagina Profilo). */
export interface MyReviewDTO {
  id: number;
  text: string;
  vote: number;
  date: string;
  movieId: number;
  movieTitle: string;
}

export interface CurrentUserDTO {
  id: number;
  username: string;
  name: string;
  surname: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
}

export type UserRole = "ADMIN" | "USER";

export interface UserAccountDTO {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string | null;
  role: UserRole | string;
}
