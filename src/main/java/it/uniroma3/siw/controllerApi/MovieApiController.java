package it.uniroma3.siw.controllerApi;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.model.Review;
import it.uniroma3.siw.modelDTO.FestivalDTO;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.ReviewDTO;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ReviewService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieApiController {

	private final MovieService movieService;
	private final ReviewService reviewService;

	@GetMapping
	public List<MovieDTO> getAll(@RequestParam(required = false) String search){
		List <Movie> movies;
		if (search == null || search.isBlank()) {
			movies = movieService.findAll();
		} else {
			movies = movieService.search(search);
		}
		return movies.stream().map(MovieDTO::form).toList();
	}
	
	@GetMapping("/{id}")
	public MovieDTO getById(@PathVariable Long id){
		return MovieDTO.from(movieService.findByIdWithDetails(id));
	}

	@GetMapping("/{id}/reviews")
	public List<ReviewDTO> getByMovies(@PathVariable Long id){
		return reviewService.findByMovie(id).stream().map(ReviewDTO::form).toList();
	}
	
}
