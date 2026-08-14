package it.uniroma3.siw.service;

import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.model.Review;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private MovieService movieService;
    
    @Autowired
    private UserService userService;
    
    
    @Transactional(readOnly = true)
    public List<Review> findAll() {
        return reviewRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Review> findByMovie(Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }
    
    @Transactional(readOnly = true)
    public List<Review> findByMovieWithUser(Long movieId) {
        return reviewRepository.findByMovieWithUser(movieId);
    }
    
    @Transactional(readOnly = true)
    public List<Review> findByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    @Transactional(readOnly = true)
    public Page<Review> findByMoviePaginated(Long movieId, Pageable pageable) {
        return reviewRepository.findByMovieId(movieId, pageable);
    }
    
    @Transactional(readOnly = true)
    public Double getAverageRating(Long movieId) {
        return reviewRepository.getAverageRating(movieId);
    }
    
    @Transactional(readOnly = true)
    public Long countByMovie(Long movieId) {
        return reviewRepository.countByMovieId(movieId);
    }
    
    @Transactional(readOnly = true)
    public boolean hasUserReviewedMovie(Long userId, Long movieId) {
        return reviewRepository.existsByUserIdAndMovieId(userId, movieId);
    }
    public Review createReview(Review review, Long userId, Long movieId) {
        // Verifica che l'utente non abbia già recensito questo film
        if (reviewRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new RuntimeException("Hai già recensito questo film");
        }
        
 
        User user = userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        Movie movie = movieService.findById(movieId)
        	    .orElseThrow(() -> new RuntimeException("Film non trovato"));
     
        review.setUser(user);
        review.setMovie(movie);
        review.setDate(LocalDate.now());
        
        return reviewRepository.save(review);
    }
    
    public Review updateReview(Review review, Long userId) {

        Review existing = reviewRepository.findById(review.getId())
            .orElseThrow(() -> new RuntimeException("Recensione non trovata"));
        

        if (!existing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Non sei autorizzato a modificare questa recensione");
        }
        
        existing.setReview(review.getReview());
        existing.setVote(review.getVote());
        
        return reviewRepository.save(existing);
    }
    
    public void deleteReview(Long reviewId, Long userId) {
        Review existing = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Recensione non trovata"));

        if (!existing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Non sei autorizzato a eliminare questa recensione");
        }
        
        reviewRepository.delete(existing);
    }

}

    