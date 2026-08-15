package it.uniroma3.siw.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.ReviewCreateDTO;
import it.uniroma3.siw.security.UserDetails;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ReviewService;
import it.uniroma3.siw.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {
	private final MovieService movieService;
	private final ReviewService reviewService;
	
	@GetMapping("/{id}")
	public String detail(@PathVariable Long id, Model model) {
		Movie movie = movieService.findByIdWithDetails(id);
		model.addAttribute("movie", movie);
		model.addAttribute("reviws", reviewService.findByMovie(id));
		if(!model.containsAttribute("reviewForm")) {
			model.addAttribute("reviewForm", new ReviewCreateDTO("", null));
		}
		return "detail";
	}
	
	@PostMapping("/{id}/recensioni")
	public String addReview(@PathVariable Long id,
			@Valid @ModelAttribute("reviewForm") ReviewCreateDTO form,
			BindingResult binding,
			@AuthenticationPrincipal UserDetails principal,
			Model model) {
		if(binding.hasErrors()) {
			return detail(id, model);
		}
		reviewService.create(id, principal.getId(), form);
		return "redirect:/movies/" + id;
		
	}
}
