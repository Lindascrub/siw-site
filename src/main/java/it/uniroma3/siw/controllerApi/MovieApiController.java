package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.ReviewDTO;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieApiController {

    private final MovieService movieService;
    private final ReviewService reviewService;

    @GetMapping
    public List<MovieDTO> getAll(@RequestParam(required = false) String search) {
        List<Movie> movies = (search == null || search.isBlank())
                ? movieService.findAll()
                : movieService.search(search);
        return movies.stream().map(MovieDTO::from).toList();
    }

    @GetMapping("/{id}")
    public MovieDTO getById(@PathVariable Long id) {
        return MovieDTO.from(movieService.findByIdWithDetails(id));
    }

    @GetMapping("/{id}/reviews")
    public List<ReviewDTO> getReviews(@PathVariable Long id) {
        return reviewService.findByMovie(id).stream().map(ReviewDTO::from).toList();
    }
}
