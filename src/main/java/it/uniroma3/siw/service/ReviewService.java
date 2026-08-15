package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.DuplicateReviewException;
import it.uniroma3.siw.exception.ForbiddenOperationException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.model.Review;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.modelDTO.ReviewCreateDTO;
import it.uniroma3.siw.repository.MovieRepository;
import it.uniroma3.siw.repository.ReviewRepository;
import it.uniroma3.siw.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public List<Review> findByMovie(Long movieId) {
        return reviewRepository.findByMovieIdOrderByDateDesc(movieId);
    }

    public Review findById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recensione non trovata: id=" + id));
    }

    @Transactional
    public Review create(Long movieId, Long userId, ReviewCreateDTO dto) {
        if (reviewRepository.existsByMovieIdAndUserId(movieId, userId)) {
            throw new DuplicateReviewException("Hai gia' inserito una recensione per questo film");
        }
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + movieId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato: id=" + userId));

        Review r = new Review();
        r.setText(dto.text());
        r.setVote(dto.vote());
        r.setMovie(movie);
        r.setUser(user);
        return reviewRepository.save(r);
    }

    @Transactional
    public Review update(Long id, Long userId, ReviewCreateDTO dto) {
        Review r = findById(id);
        assertOwner(r, userId);
        r.setText(dto.text());
        r.setVote(dto.vote());
        return reviewRepository.save(r);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Review r = findById(id);
        assertOwner(r, userId);
        reviewRepository.delete(r);
    }

    private void assertOwner(Review r, Long userId) {
        if (!r.getUser().getId().equals(userId)) {
            throw new ForbiddenOperationException("Non puoi modificare o eliminare una recensione di un altro utente");
        }
    }
}
