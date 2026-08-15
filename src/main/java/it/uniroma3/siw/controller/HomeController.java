package it.uniroma3.siw.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import it.uniroma3.siw.service.FestivalService;
import lombok.RequiredArgsConstructor;


@Controller
@RequiredArgsConstructor
public class HomeController {

    private final FestivalService festivalService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("festivals", festivalService.findAll());
        return "index";
    }
}
