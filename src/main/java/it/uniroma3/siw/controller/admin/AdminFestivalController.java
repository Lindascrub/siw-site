package it.uniroma3.siw.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.modelDTO.FestivalFormDTO;
import it.uniroma3.siw.service.FestivalService;
import it.uniroma3.siw.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/festivals")
@RequiredArgsConstructor
public class AdminFestivalController {

	private final FestivalService festivalService;
	private final MovieService movieService;

	@GetMapping
	public String list(Model model) {
		model.addAttribute("festivals", festivalService.findAll());
		return "list";
	}

	@GetMapping("/new")
	public String newForm(Model model) {
		model.addAttribute("festivalForm", new FestivalFormDTO());
		return "form";
	}

	@GetMapping("/{id}/edit")
	public String editForm(@PathVariable Long id, Model model) {
		Festival f = festivalService.findById(id);
		FestivalFormDTO form = new FestivalFormDTO();
		form.setId(f.getId());
		form.setName(f.getName());
		form.setYear(f.getYear());
		form.setCity(f.getCity());
		form.setStartDate(f.getStartDate());
		form.setEndDate(f.getEndDate());
		form.setDescription(f.getDescription());
		model.addAttribute("festivalForm", form);
		return "form";
	}

    @PostMapping("/save")
    public String save(@Valid @ModelAttribute("festivalForm") FestivalFormDTO form, BindingResult binding) {
        if (binding.hasErrors()) {
            return "admin/festival-form";
        }
        if (form.getId() == null) {
            festivalService.create(form);
        } else {
            festivalService.update(form.getId(), form);
        }
        return "redirect:/admin/festivals";
    }

	@PostMapping("/{id}/delete")
	public String delete(@PathVariable Long id) {
		festivalService.delete(id);
		return "redirect:/admin/festivals";
	}

	@GetMapping("/{id}/movies")
    public String manageMovie(@PathVariable Long id, Model model) {
        model.addAttribute("festival", festivalService.findByIdWithMovie(id));
        model.addAttribute("allMovies", movieService.findAll());
        return "admin/festival-movies";
    }

    @PostMapping("/{id}/movies/{movieId}/associa")
    public String matchMovie(@PathVariable Long id, @PathVariable Long movieId) {
        festivalService.matchMovie(id, movieId);
        return "redirect:/admin/festivals/" + id + "/movies";
    }

    @PostMapping("/{id}/movies/{movieId}/remove")
    public String removeMovie(@PathVariable Long id, @PathVariable Long movieId) {
        festivalService.removeMovie(id, movieId);
        return "redirect:/admin/festivals/" + id + "/movies";
    }

}
