package it.uniroma3.siw.controllerApi;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.modelDTO.FestivalDTO;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.ScreeningDTO;
import it.uniroma3.siw.service.FestivalService;
import it.uniroma3.siw.service.ScreeningService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
public class FestivalApiController {
	
	private final FestivalService festivalService;
	private final ScreeningService screeningService;
	
	@GetMapping
	public List<FestivalDTO> getAll(){
		return festivalService.findAll().stream().map(FestivalDTO::from).toList();
	}
	
	@GetMapping("/{id}")
	public Festival getById(@PathVariable Long id){
		return FestivalDTO.from(festivalService.findById(id));
	}

	@GetMapping("/{id}/movies")
	public List<FestivalDTO> getByMovies(@PathVariable Long id){
		Festival festival = festivalService.findByIdWithMovie(id);
		return festival.getMovies().stream().map(MovieDTO::form).toList();
	}
	@GetMapping("/{id}/screenings")
	public List<ScreeningDTO> getByScreenings(@PathVariable Long id){
		return screeningService.findByFestival(id).stream().map(ScreeningDTO :: from).toList();
	}
}
