package it.uniroma3.siw.modelDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReviewCreateDTO (
	 @NotBlank(message = "Il testo della recensione non puo' essere vuoto") String text,
     @NotNull(message = "Il voto e' obbligatorio")
     @Min(value = 1, message = "Il voto minimo e' 1")
     @Max(value = 5, message = "Il voto massimo e' 5") Integer rating
) {}
