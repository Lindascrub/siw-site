package it.uniroma3.siw.controller.admin;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import it.uniroma3.siw.model.Hall;
import it.uniroma3.siw.modelDTO.HallFormDTO;
import it.uniroma3.siw.service.FestivalService;
import it.uniroma3.siw.service.HallService;
import it.uniroma3.siw.service.MovieService;
import it.uniroma3.siw.service.ScreeningService;

@Controller
@RequestMapping("/admin/halls")
@RequiredArgsConstructor
public class AdminHallController {

    private final HallService hallService;


    @GetMapping
    public String list(Model model) {
        model.addAttribute("sale", hallService.findAll());
        return "list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("salaForm", new HallFormDTO());
        return "form";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
    	Hall h = hallService.findById(id);
    	HallFormDTO form = new HallFormDTO();
        form.setId(h.getId());
        form.setName(h.getName());
        form.setAddress(h.getAddress());
        form.setCapacity(h.getCapacity());
        model.addAttribute("hallForm", form);
        return "form";
    }

    @PostMapping("/save")
    public String save(@Valid @ModelAttribute("hallForm") HallFormDTO form, BindingResult binding) {
        if (binding.hasErrors()) {
            return "form";
        }
        if (form.getId() == null) {
        	hallService.create(form);
        } else {
        	hallService.update(form.getId(), form);
        }
        return "redirect:/admin/halls";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
    	hallService.delete(id);
        return "redirect:/admin/halls";
    }
}
