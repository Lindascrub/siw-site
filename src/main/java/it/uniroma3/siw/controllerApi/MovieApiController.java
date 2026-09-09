package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.MovieScreeningDTO;
import it.uniroma3.siw.modelDTO.ReviewDTO;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ReviewService;
import it.uniroma3.siw.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

    /**
     * Catalogo pubblico paginato. La ricerca (se presente) confronta titolo,
     * genere e nome/cognome del regista - vedi MovieRepository.search.
     */
    @GetMapping
    public Page<MovieDTO> getAll(@RequestParam(required = false) String search,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "" + DEFAULT_PAGE_SIZE) int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Movie> movies = (search == null || search.isBlank())
                ? movieService.findAll(pageable)
                : movieService.search(search, pageable);
        return movies.map(MovieDTO::from);
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
}
