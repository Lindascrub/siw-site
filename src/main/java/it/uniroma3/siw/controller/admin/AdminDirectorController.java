package it.uniroma3.siw.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import it.uniroma3.siw.model.Director;
import it.uniroma3.siw.modelDTO.DirectorFormDTO;
import it.uniroma3.siw.service.DirectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@Controller
@RequestMapping("/admin/directors")
@RequiredArgsConstructor
public class AdminDirectorController {

    private final DirectorService directorService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("directors", directorService.findAll());
        return "list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("directorForm", new DirectorFormDTO());
        return "form";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Director d = directorService.findById(id);
        DirectorFormDTO form = new DirectorFormDTO();
        form.setId(d.getId());
        form.setName(d.getName());
        form.setSurname(d.getSurname());
        form.setBirthDate(d.getBirthDate());
        form.setNationality(d.getNationality());
        model.addAttribute("directorForm", form);
        return "form";
    }

    @PostMapping("/save")
    public String save(@Valid @ModelAttribute("directorForm") DirectorFormDTO form, BindingResult binding) {
        if (binding.hasErrors()) {
            return "form";
        }
        if (form.getId() == null) {
        	directorService.create(form);
        } else {
        	directorService.update(form.getId(), form);
        }
        return "redirect:/admin/directors";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
    	directorService.delete(id);
        return "redirect:/admin/directors";
    }


}

