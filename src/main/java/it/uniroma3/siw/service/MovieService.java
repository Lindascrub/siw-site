package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Director;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.MovieFormDTO;
import it.uniroma3.siw.modelDTO.MovieRatingStats;
import it.uniroma3.siw.repository.DirectorRepository;
import it.uniroma3.siw.repository.MovieRepository;
import it.uniroma3.siw.repository.ReviewRepository;
import it.uniroma3.siw.repository.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;
    private final DirectorRepository directorRepository;
    private final ScreeningRepository screeningRepository;
    private final ReviewRepository reviewRepository;
    private final FileStorageService fileStorageService;

    public List<Movie> findAll() {
        return movieRepository.findAll();
    }

    public Movie findById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + id));
    }

    public Movie findByIdWithDetails(Long id) {
        return movieRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + id));
    }

    /** Catalogo pubblico paginato, con ricerca e filtro per genere facoltativi. */
    public Page<Movie> search(String query, String genre, Long directorId,Pageable pageable) {
        return movieRepository.search(
                (query == null || query.isBlank()) ? null : query,
                (genre == null || genre.isBlank()) ? null : genre,
                directorId,
                pageable);
    }

    public List<String> findDistinctGenres() {
        return movieRepository.findDistinctGenres();
    }
    public List<Director> findDirectorsWithMovies() {
        return movieRepository.findDirectorsWithMovies();
    }


    /**
     * Arricchisce una lista di MovieDTO con media voti e numero di recensioni,
     * con un'unica query aggregata sui soli film passati (niente N+1: non
     * viene mai interrogata la collezione LAZY Movie.reviews per singolo film).
     */
    public List<MovieDTO> enrichWithStats(List<MovieDTO> movies) {
        if (movies.isEmpty()) return movies;
        List<Long> ids = movies.stream().map(MovieDTO::id).toList();
        Map<Long, MovieRatingStats> statsById = new HashMap<>();
        for (MovieRatingStats s : reviewRepository.aggregateForMovies(ids)) {
            statsById.put(s.movieId(), s);
        }
        return movies.stream()
                .map(m -> {
                    MovieRatingStats s = statsById.get(m.id());
                    return s == null ? m.withStats(null, 0L) : m.withStats(s.avgRating(), s.reviewCount());
                })
                .toList();
    }

    /** I 6 (o quanti richiesti) film con la media voti piu' alta, per la sezione in evidenza della home. */
    public List<Movie> findTopRated(int limit) {
        return movieRepository.findTopRated(org.springframework.data.domain.PageRequest.of(0, limit));
    }

    @Transactional
    public Movie create(MovieFormDTO form) {
        Movie m = new Movie();
        applyForm(m, form);
        return movieRepository.save(m);
    }

    @Transactional
    public Movie update(Long id, MovieFormDTO form) {
        Movie m = findById(id);
        applyForm(m, form);
        return movieRepository.save(m);
    }

    @Transactional
    public void delete(Long id) {
        Movie m = findById(id);
        if (screeningRepository.existsByMovieId(id)) {
            throw new BusinessRuleException(
                    "Impossibile eliminare il film '" + m.getTitle() + "': esistono proiezioni programmate che lo riguardano.");
        }
        movieRepository.delete(m);
    }

    public Movie attachPoster(Long id, MultipartFile file) {
        Movie movie = findById(id);
        String filename = fileStorageService.store(file);
        if (movie.getPosterFilename() != null) {
            fileStorageService.delete(movie.getPosterFilename());
        }
        movie.setPosterFilename(filename);
        return movieRepository.save(movie);
    }

    public List<Movie> findByFestivalLazy(Long festivalId) {
        return movieRepository.findByFestivalIdLazy(festivalId);
    }

    public List<Movie> findByFestivalJoinFetch(Long festivalId) {
        return movieRepository.findByFestivalIdJoinFetch(festivalId);
    }

    public List<Movie> findByFestivalEntityGraph(Long festivalId) {
        return movieRepository.findByFestivalIdEntityGraph(festivalId);
    }

    private void applyForm(Movie m, MovieFormDTO form) {
        Director director = directorRepository.findById(form.getDirectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Regista non trovato: id=" + form.getDirectorId()));
        m.setTitle(form.getTitle());
        m.setYear(form.getYear());
        m.setDuration(form.getDuration());
        m.setGenre(form.getGenre());
        m.setContryProduction(form.getContryProduction());
        m.setDirector(director);
    }
    public List<Director> findDirectorsForFilter() {
        return movieRepository.findDirectorsWithMovies();
    }
}
