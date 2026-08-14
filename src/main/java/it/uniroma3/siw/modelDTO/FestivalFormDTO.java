package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FestivalFormDTO {
	private Long id;

    @NotBlank(message = "Il nome e' obbligatorio")
    private String name;

    @NotNull(message = "L'anno e' obbligatorio")
    private Integer year;

    @NotBlank(message = "La citta' e' obbligatoria")
    private String city;

    @NotNull(message = "La data di inizio e' obbligatoria")
    private LocalDate startDate;

    @NotNull(message = "La data di fine e' obbligatoria")
    private LocalDate endDate;

    private String description;
}
