package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import it.uniroma3.siw.model.Festival;

public record FestivalDTO(
		Long id, 
		String name, 
		Integer year, 
		String city,
		LocalDate startDate, 
		LocalDate endDate, 
		String description
		) {
	public static FestivalDTO from(Festival f) {
		return new FestivalDTO(
				f.getId(), 
				f.getName(), 
				f.getYear(), 
				f.getCity(),
				f.getStartDate(), 
				f.getEndDate(), 
				f.getDescription()
				);
	}
}
