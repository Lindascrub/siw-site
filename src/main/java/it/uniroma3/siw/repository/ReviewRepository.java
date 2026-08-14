package it.uniroma3.siw.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.uniroma3.siw.model.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByMovieId(Long movieId);
    List<Review> findByUserId(Long userId);
    List<Review> findByMovieIdOrderByDateDesc(Long movieId);
    

    Page<Review> findByMovieId(Long movieId, Pageable pageable);
    

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
    

    List<Review> findByUserIdAndMovieId(Long userId, Long movieId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.id = :movieId")
    Double getAverageRating(@Param("movieId") Long movieId);
    

    @Query("SELECT r FROM Review r JOIN FETCH r.user WHERE r.movie.id = :movieId")
    List<Review> findByMovieWithUser(@Param("movieId") Long movieId);
    
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.movie.id = :movieId")
    Long countByMovieId(@Param("movieId") Long movieId);
    

    List<Review> findByMovieIdAndRatingGreaterThanEqual(Long movieId, Integer minRating);
}