package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import it.uniroma3.siw.model.Review;

public record ReviewDTO(
		Long id, 
		String text, 
		Double rating, 
		LocalDate date,
		Long movieId, 
		Long userId, 
		String username
		) {
	public static ReviewDTO from(Review r) {
		return new ReviewDTO(
				r.getId(), 
				r.getText(), 
				r.getRating(), 
				r.getDate(),
				r.getMovie().getId(), 
				r.getUser().getId(), 
				r.getUser().getName());
	}
}
