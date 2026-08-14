package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DirectorFormDTO {
    @NotBlank(message = "Il nome e' obbligatorio")
    private String nome;

    @NotBlank(message = "Il cognome e' obbligatorio")
    private String cognome;

    private LocalDate dataNascita;
    private String nazionalita;
}
