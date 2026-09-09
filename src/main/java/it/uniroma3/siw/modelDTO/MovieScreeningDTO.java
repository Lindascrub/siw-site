package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;
import java.time.LocalTime;

import it.uniroma3.siw.model.Screening;
import it.uniroma3.siw.model.ScreeningStatus;

/**
 * Proiezione vista dal lato film (GET /api/movies/{id}): a differenza di
 * ScreeningDTO non porta il film al suo interno, per evitare un riferimento
 * circolare Movie -> Screening -> Movie in fase di serializzazione JSON.
 */
public record MovieScreeningDTO(
		Long id,
		LocalDate date,
		LocalTime time,
		ScreeningStatus status,
		Long festivalId,
		String festivalName,
		HallDTO hall
		) {
	public static MovieScreeningDTO from(Screening s) {
		return new MovieScreeningDTO(
				s.getId(),
				s.getDate(),
				s.getTime(),
				s.getStatus(),
				s.getFestival().getId(),
				s.getFestival().getName(),
				HallDTO.from(s.getHall()));
	}
}
