package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import it.uniroma3.siw.model.Review;

public record ReviewDTO(
		Long id, 
		String text, 
		Integer vote, 
		LocalDate date,
		Long movieId, 
		Long userId, 
		String username
		) {
	public static ReviewDTO from(Review r) {
		return new ReviewDTO(
				r.getId(), 
				r.getText(), 
				r.getVote(), 
				r.getDate(),
				r.getMovie().getId(), 
				r.getUser().getId(), 
				r.getUser().getCredentials().getUsername()
				);
	}
}
