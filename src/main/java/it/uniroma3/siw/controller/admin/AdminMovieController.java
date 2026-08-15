package it.uniroma3.siw.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.MovieFormDTO;
import it.uniroma3.siw.service.DirectorService;
import it.uniroma3.siw.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/movies")
@RequiredArgsConstructor
public class AdminMovieController {

    private final MovieService movieService;
    private final DirectorService directorService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("movieList", movieService.findAll());
        return "admin/movie/list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("movieForm", new MovieFormDTO());
        model.addAttribute("directors", directorService.findAll());
        return "admin/movie/form";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
    	Movie m = movieService.findById(id);
        MovieFormDTO form = new MovieFormDTO();
        form.setId(m.getId());
        form.setTitle(m.getTitle());
        form.setYear(m.getYear());
        form.setDuration(m.getDuration());
        form.setGenre(m.getGenre());
        form.setContryProduction(m.getContryProduction());
        form.setDirectorId(m.getDirector().getId());
        model.addAttribute("movieForm", form);
        model.addAttribute("directors", directorService.findAll());
        return "admin/movie/form";
    }

    @PostMapping("/save")
    public String save(@Valid @ModelAttribute("movieForm") MovieFormDTO form, BindingResult binding, Model model) {
        if (binding.hasErrors()) {
            model.addAttribute("directors", directorService.findAll());
            return "admin/movie/form";
        }
        if (form.getId() == null) {
        	movieService.create(form);
        } else {
        	movieService.update(form.getId(), form);
        }
        return "redirect:/admin/movies";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
    	movieService.delete(id);
        return "redirect:/admin/movies";
    }
}
