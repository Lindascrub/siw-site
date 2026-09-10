package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.DirectorDTO;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.MovieScreeningDTO;
import it.uniroma3.siw.modelDTO.ReviewDTO;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ReviewService;
import it.uniroma3.siw.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieApiController {

    private static final int DEFAULT_PAGE_SIZE = 12;

    private final MovieService movieService;
    private final ReviewService reviewService;
    private final ScreeningService screeningService;

    private static final java.util.Set<String> SORTABLE_FIELDS = java.util.Set.of("title", "year", "duration");

    /**
     * Catalogo pubblico paginato. La ricerca (se presente) confronta titolo,
     * genere e nome/cognome del regista - vedi MovieRepository.search.
     * sortBy/sortDir sono validati contro una whitelist per evitare di
     * esporre nomi di proprieta' arbitrari nella query di ordinamento.
     */
    @GetMapping
    public Page<MovieDTO> getAll(@RequestParam(required = false) String search,
                                  @RequestParam(required = false) String genre,
                                  @RequestParam(required = false) Long directorId,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "" + DEFAULT_PAGE_SIZE) int size,
                                  @RequestParam(defaultValue = "title") String sortBy,
                                  @RequestParam(defaultValue = "asc") String sortDir) {
        String field = SORTABLE_FIELDS.contains(sortBy) ? sortBy : "title";
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, field));
        Page<Movie> result = movieService.search(search, genre, directorId, pageable);
        List<MovieDTO> enriched = movieService.enrichWithStats(result.getContent().stream().map(MovieDTO::from).toList());
        return new PageImpl<>(enriched, pageable, result.getTotalElements());
    }

    @GetMapping("/genres")
    public List<String> getGenres() {
        return movieService.findDistinctGenres();
    }

    /** I film con la media voti piu' alta (recensioni positive), per la sezione in evidenza della home. */
    @GetMapping("/top-rated")
    public List<MovieDTO> getTopRated(@RequestParam(defaultValue = "6") int limit) {
        List<MovieDTO> dtos = movieService.findTopRated(limit).stream().map(MovieDTO::from).toList();
        return movieService.enrichWithStats(dtos);
    }

    @GetMapping("/{id}")
    public MovieDTO getById(@PathVariable Long id) {
        Movie movie = movieService.findByIdWithDetails(id);
        List<MovieScreeningDTO> screenings = screeningService.findByMovie(id).stream()
                .map(MovieScreeningDTO::from).toList();
        return MovieDTO.fromDetail(movie, screenings);
    }

    @GetMapping("/{id}/reviews")
    public List<ReviewDTO> getReviews(@PathVariable Long id) {
        return reviewService.findByMovie(id).stream().map(ReviewDTO::from).toList();
    }
    
    @GetMapping("/directors")
    public List<DirectorDTO> getDirectors() {
        return movieService.findDirectorsWithMovies().stream().map(DirectorDTO::from).toList();
    }
}
