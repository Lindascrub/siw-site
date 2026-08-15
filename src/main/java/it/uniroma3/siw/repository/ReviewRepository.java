package it.uniroma3.siw.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.uniroma3.siw.model.Review;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	  List<Review> findByMovieIdOrderByDateDesc(Long movieId);
	  Optional<Review> findByMovieIdAndUserId(Long movieId, Long userId);
	  boolean existsByMovieIdAndUserId(Long movieId, Long userId);

}