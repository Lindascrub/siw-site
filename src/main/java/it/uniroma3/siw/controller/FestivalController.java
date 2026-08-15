package it.uniroma3.siw.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.service.FestivalService;
import it.uniroma3.siw.service.ScreeningService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/festivals")
public class FestivalController {

	private final FestivalService festivalService;
	private final ScreeningService screeningService;

	@GetMapping("/{id}")
	public String detail(@PathVariable Long id, Model model) {
		Festival festival = festivalService.findByIdWithMovie(id);
		model.addAttribute("festival", festival);
		model.addAttribute("movie", festival.getMovies());
		return "festival/detail";
	}

	@GetMapping("/{id}/programms")
	public String programms(@PathVariable Long id, Model model) {
		Festival festival = festivalService.findById(id);
		model.addAttribute("festival", festival);
		model.addAttribute("screenings", screeningService.findByFestival(id));
		return "festival/programms";
	}

}
