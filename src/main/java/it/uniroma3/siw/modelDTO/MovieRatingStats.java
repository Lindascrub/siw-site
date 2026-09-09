package it.uniroma3.siw.modelDTO;

/** Media voti e numero di recensioni di un film, aggregati in una sola query per pagina (evita N+1). */
public record MovieRatingStats(Long movieId, Double avgRating, Long reviewCount) {
}
