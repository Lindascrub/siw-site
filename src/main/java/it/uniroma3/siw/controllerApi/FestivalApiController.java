package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.modelDTO.FestivalDTO;
import it.uniroma3.siw.modelDTO.MovieDTO;
import it.uniroma3.siw.modelDTO.ScreeningDTO;
import it.uniroma3.siw.service.FestivalService;
import it.uniroma3.siw.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
public class FestivalApiController {

    private final FestivalService festivalService;
    private final ScreeningService screeningService;

    @GetMapping
    public List<FestivalDTO> getAll() {
        return festivalService.findAll().stream().map(FestivalDTO::from).toList();
    }

    @GetMapping("/{id}")
    public FestivalDTO getById(@PathVariable Long id) {
        return FestivalDTO.from(festivalService.findById(id));
    }

    @GetMapping("/{id}/movies")
    public List<MovieDTO> getMovies(@PathVariable Long id) {
        Festival festival = festivalService.findByIdWithMovie(id);
        return festival.getMovies().stream().map(MovieDTO::from).toList();
    }

    @GetMapping("/{id}/screenings")
    public List<ScreeningDTO> getScreenings(@PathVariable Long id) {
        return screeningService.findByFestival(id).stream().map(ScreeningDTO::from).toList();
    }
}
