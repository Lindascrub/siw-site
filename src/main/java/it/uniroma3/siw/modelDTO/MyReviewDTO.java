package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

/**
 * DTO per la pagina Profilo (frontend React): a differenza di ReviewDTO,
 * include il titolo del film gia' dentro, cosi' il frontend non deve fare
 * una chiamata separata per ogni recensione solo per mostrare il titolo.
 */
public record MyReviewDTO(Long id, String text, Integer vote, LocalDate date, Long movieId, String movieTitle) {
}
