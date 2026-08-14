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

    @NotBlank(message = "Il nome è obbligatorio")
    private String name;

    @NotNull(message = "L'anno è obbligatorio")
    private Integer year;

    @NotBlank(message = "La città è obbligatoria")
    private String city;

    @NotNull(message = "La data di inizio è obbligatoria")
    private LocalDate startDate;

    @NotNull(message = "La data di fine è obbligatoria")
    private LocalDate endDate;

    private String description;
}
