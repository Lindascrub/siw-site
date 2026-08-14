package it.uniroma3.siw.modelDTO;

import it.uniroma3.siw.model.Movie;

public record MovieDTO(
		Long id, 
		String title, 
		Integer year, 
		Integer duration, 
		String genre,
		String contryProduction, 
		DirectorDTO director
		) {
	public static MovieDTO from(Movie m) {
		return new MovieDTO(
				m.getId(),
				m.getTitle(),
				m.getYear(),
				m.getDuration(),
				m.getGenre(),
				m.getContryProduction(),
				DirectorDTO.from(m.getDirector()));
	}
}

