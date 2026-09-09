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
		List<MovieScreeningDTO> screenings
		) {

	/**
	 * Usata per le liste (catalogo, pannello admin, festival->film): non tocca
	 * le collezioni LAZY (festivals/screenings) per evitare N+1 query, restano
	 * vuote. Il dettaglio di un singolo film usa invece {@link #fromDetail}.
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
				List.of());
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
				screenings);
	}
}
