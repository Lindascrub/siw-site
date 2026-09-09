package it.uniroma3.siw.modelDTO;

import it.uniroma3.siw.model.Movie;

import java.util.List;

public record MovieDTO(
		Long id,
		String title,
		Integer year,
		Integer duration,
		String genre,
		String contryProduction,
		DirectorDTO director,
		String posterFilename,
		List<FestivalDTO> festivals,
		List<MovieScreeningDTO> screenings,
		Double avgRating,
		Long reviewCount
		) {

	/**
	 * Usata per le liste (catalogo, pannello admin, festival->film): non tocca
	 * le collezioni LAZY (festivals/screenings) per evitare N+1 query, restano
	 * vuote. Le statistiche recensioni partono a 0/null: chi chiama arricchisce
	 * con {@link #withStats} dopo una query aggregata separata (vedi
	 * MovieApiController), non con un accesso lazy per film.
	 */
	public static MovieDTO from(Movie m) {
		return new MovieDTO(
				m.getId(),
				m.getTitle(),
				m.getYear(),
				m.getDuration(),
				m.getGenre(),
				m.getContryProduction(),
				DirectorDTO.from(m.getDirector()),
				m.getPosterFilename(),
				List.of(),
				List.of(),
				null,
				0L);
	}

	/**
	 * Usata da GET /api/movies/{id}: include i festival a cui il film partecipa
	 * (gia' caricati con join fetch da MovieRepository.findByIdWithDetails) e le
	 * sue proiezioni (caricate a parte da ScreeningService.findByMovie).
	 */
	public static MovieDTO fromDetail(Movie m, List<MovieScreeningDTO> screenings) {
		return new MovieDTO(
				m.getId(),
				m.getTitle(),
				m.getYear(),
				m.getDuration(),
				m.getGenre(),
				m.getContryProduction(),
				DirectorDTO.from(m.getDirector()),
				m.getPosterFilename(),
				m.getFestivals().stream().map(FestivalDTO::from).toList(),
				screenings,
				null,
				0L);
	}

	/** Copia arricchita con le statistiche delle recensioni (vedi ReviewRepository.aggregateForMovies). */
	public MovieDTO withStats(Double avgRating, Long reviewCount) {
		return new MovieDTO(id, title, year, duration, genre, contryProduction, director, posterFilename,
				festivals, screenings, avgRating, reviewCount == null ? 0L : reviewCount);
	}
}
