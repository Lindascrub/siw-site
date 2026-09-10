package it.uniroma3.siw.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.uniroma3.siw.model.Review;
import it.uniroma3.siw.modelDTO.MovieRatingStats;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	  List<Review> findByMovieIdOrderByDateDesc(Long movieId);
	  boolean existsByMovieIdAndUserId(Long movieId, Long userId);
	  List<Review> findByUserIdOrderByDateDesc(Long userId);

	  /** Media voti e conteggio recensioni per un insieme di film, in un'unica query (usata per arricchire le liste). */
	  @Query("SELECT new it.uniroma3.siw.modelDTO.MovieRatingStats(r.movie.id, AVG(r.vote), COUNT(r)) " +
	         "FROM Review r WHERE r.movie.id IN :movieIds GROUP BY r.movie.id")
	  List<MovieRatingStats> aggregateForMovies(@Param("movieIds") List<Long> movieIds);
}