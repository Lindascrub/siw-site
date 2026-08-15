package it.uniroma3.siw.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Screening;
import it.uniroma3.siw.modelDTO.ScreeningFormDTO;
import it.uniroma3.siw.service.DirectorService;
import it.uniroma3.siw.service.FestivalService;
import it.uniroma3.siw.service.HallService;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ScreeningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin/screenings")
@RequiredArgsConstructor
public class AdminScreeningController {

    private final ScreeningService screeningService;
    private final FestivalService festivalService;
    private final MovieService movieService;
    private final HallService hallService;

    @GetMapping("/new")
    public String newForm(@RequestParam(required = false) Long festivalId, Model model) {
    	ScreeningFormDTO form = new ScreeningFormDTO();
        form.setFestivalId(festivalId);
        model.addAttribute("screeningForm", form);
        addReferenceData(model);
        return "form";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
    	Screening s = screeningService.findById(id);
    	ScreeningFormDTO form = new ScreeningFormDTO();
        form.setId(s.getId());
        form.setFestivalId(s.getFestival().getId());
        form.setMovieId(s.getMovie().getId());
        form.setHallId(s.getHall().getId());
        form.setDate(s.getDate());
        form.setTime(s.getTime());
        model.addAttribute("screeningForm", form);
        addReferenceData(model);
        return "form";
    }

    @PostMapping("/save")
    public String save(@Valid @ModelAttribute("proiezioneForm") ScreeningFormDTO form, BindingResult binding, Model model) {
        if (binding.hasErrors()) {
            addReferenceData(model);
            return "form";
        }
        try {
            if (form.getId() == null) {
            	screeningService.schedule(form);
            } else {
            	screeningService.update(form.getId(), form);
            }
            return "redirect:/festival/" + form.getFestivalId() + "/programms";
        } catch (BusinessRuleException e) {
            binding.reject("proiezione.sala.nonDisponibile", e.getMessage());
            addReferenceData(model);
            return "/form";
        } catch (ResourceNotFoundException e) {
            binding.reject("proiezione.entita.nonTrovata", e.getMessage());
            addReferenceData(model);
            return "form";
        }
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
    	Screening s = screeningService.findById(id);
        Long festivalId = s.getFestival().getId();
        screeningService.delete(id);
        return "redirect:/festivals/" + festivalId + "/programms";
    }

    private void addReferenceData(Model model) {
        model.addAttribute("festivals", festivalService.findAll());
        model.addAttribute("moviesList", movieService.findAll());
        model.addAttribute("halls", hallService.findAll());
    }
}
