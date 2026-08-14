package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;
import java.time.LocalTime;

import it.uniroma3.siw.model.Screening;
import it.uniroma3.siw.model.ScreeningStatus;

public record ScreeningDTO(
		Long id,
		LocalDate date,
		LocalTime time,
		ScreeningStatus status,
		Long festivalId,
		MovieDTO movie,
		HallDTO hall
		) {
	public static ScreeningDTO from(Screening s) {
		return new ScreeningDTO(
				s.getId(),
				s.getDate(),
				s.getTime(),
				s.getStatus(),
				s.getFestival().getId(),
				MovieDTO.from(s.getMovie()),
				HallDTO.from(s.getHall())
				);
	}

}
