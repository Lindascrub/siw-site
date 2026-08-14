package it.uniroma3.siw.service;

import it.uniroma3.siw.model.Director;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MovieService {
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private DirectorService directorService;
    
    
    @Transactional(readOnly = true)
    public List<Movie> findAll() {
        return (List<Movie>) movieRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<Movie> findAllWithDirector() {
        return movieRepository.findAllWithDirector();
    }
    
    @Transactional(readOnly = true)
    public Optional<Movie> findById(Long id) {
        return movieRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Movie findByIdWithDirector(Long id) {
        return movieRepository.findByIdWithDirector(id)
            .orElseThrow(() -> new RuntimeException("Film non trovato con id: " + id));
    }
    
    @Transactional(readOnly = true)
    public Movie findByIdWithDetails(Long id) {
        return movieRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new RuntimeException("Film non trovato con id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Movie> findByTitle(String title) {
        return movieRepository.findByTitle(title);
    }
    
    @Transactional(readOnly = true)
    public List<Movie> findByTitleContaining(String title) {
        return movieRepository.findByTitleContaining(title);
    }
    
    @Transactional(readOnly = true)
    public List<Movie> findByDirectorId(Long directorId) {
        return movieRepository.findByDirectorId(directorId);
    }
    
    public Movie save(Movie movie) {

        if (movieRepository.existsByTitleAndYear(movie.getTitle(), movie.getYear())) {
            throw new RuntimeException("Film già presente nel sistema: " + movie.getTitle());
        }
        
        
        if (movie.getDirector() != null && movie.getDirector().getId() != null) {
            Director director = directorService.findById(movie.getDirector().getId())
                .orElseThrow(() -> new RuntimeException("Regista non trovato"));
            movie.setDirector(director);
        }
        
        return movieRepository.save(movie);
    }
    
    public Movie update(Movie movie) {
        Movie existing = movieRepository.findById(movie.getId())
            .orElseThrow(() -> new RuntimeException("Film non trovato"));
        
        existing.setTitle(movie.getTitle());
        existing.setYear(movie.getYear());
        existing.setDuration(movie.getDuration());
        existing.setGenre(movie.getGenre());
        existing.setProductionContry(movie.getProductionContry());
        
        if (movie.getDirector() != null && movie.getDirector().getId() != null) {
            Director director = directorService.findById(movie.getDirector().getId())
                .orElseThrow(() -> new RuntimeException("Regista non trovato"));
            existing.setDirector(director);
        }
        
        return movieRepository.save(existing);
    }
    
    public void delete(Long id) {
        movieRepository.deleteById(id);
    }
}